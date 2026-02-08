// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/USDCEscrow.sol";

contract MockERC20Invariant is IERC20 {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }

    function allowance(address _owner, address spender) external view override returns (uint256) {
        return _allowances[_owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        return true;
    }
}

contract EscrowHandler is Test {
    USDCEscrow public escrow;
    MockERC20Invariant public usdc;

    address public depositor = address(0x1);
    address public beneficiary = address(0x2);

    uint256 public totalCreated;
    uint256 public totalMinted;

    // Track escrow IDs by state
    uint256[] public activeEscrows;
    uint256[] public disputedEscrows;

    constructor(USDCEscrow _escrow, MockERC20Invariant _usdc) {
        escrow = _escrow;
        usdc = _usdc;
    }

    function handler_createEscrow(uint256 amount) public {
        amount = bound(amount, 1, 1000 * 1e6);
        uint256 deadline = block.timestamp + 30 days;

        usdc.mint(depositor, amount);
        totalMinted += amount;

        vm.prank(depositor);
        usdc.approve(address(escrow), amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Handler test", deadline);

        activeEscrows.push(id);
        totalCreated++;
    }

    function handler_release(uint256 seed) public {
        if (activeEscrows.length == 0) return;

        uint256 idx = seed % activeEscrows.length;
        uint256 id = activeEscrows[idx];

        vm.prank(depositor);
        try escrow.release(id) {
            _removeActive(idx);
        } catch {}
    }

    function handler_dispute(uint256 seed) public {
        if (activeEscrows.length == 0) return;

        uint256 idx = seed % activeEscrows.length;
        uint256 id = activeEscrows[idx];

        vm.prank(depositor);
        try escrow.dispute(id) {
            disputedEscrows.push(id);
            _removeActive(idx);
        } catch {}
    }

    function handler_resolve(uint256 seed, bool release) public {
        if (disputedEscrows.length == 0) return;

        uint256 idx = seed % disputedEscrows.length;
        uint256 id = disputedEscrows[idx];

        // arbiter is the test contract that deployed escrow - we need to call from there
        // The escrow's owner is the contract that deployed it (the invariant test contract)
        // We can't prank as the invariant test contract from here, so we call directly
        // since the handler is not the arbiter. We need the invariant test to be the caller.
        // Actually, the handler calls escrow.resolveDispute directly - but the arbiter is
        // the address that deployed the escrow contract. Let's check who that is.
        // The invariant test deploys the escrow, so owner = invariant test address.
        // We need to prank as that address.
        address arbiter = escrow.owner();
        vm.prank(arbiter);
        try escrow.resolveDispute(id, release) {
            _removeDisputed(idx);
        } catch {}
    }

    function handler_claimExpired(uint256 seed) public {
        if (activeEscrows.length == 0) return;

        uint256 idx = seed % activeEscrows.length;
        uint256 id = activeEscrows[idx];

        // Warp past deadline
        USDCEscrow.Escrow memory e = escrow.getEscrow(id);
        vm.warp(e.deadline + 1);

        try escrow.claimExpired(id) {
            _removeActive(idx);
        } catch {}
    }

    function _removeActive(uint256 idx) internal {
        activeEscrows[idx] = activeEscrows[activeEscrows.length - 1];
        activeEscrows.pop();
    }

    function _removeDisputed(uint256 idx) internal {
        disputedEscrows[idx] = disputedEscrows[disputedEscrows.length - 1];
        disputedEscrows.pop();
    }

    function getActiveCount() external view returns (uint256) {
        return activeEscrows.length;
    }

    function getDisputedCount() external view returns (uint256) {
        return disputedEscrows.length;
    }
}

contract USDCEscrowInvariantTest is Test {
    USDCEscrow public escrow;
    MockERC20Invariant public usdc;
    EscrowHandler public handler;

    address public depositor = address(0x1);
    address public beneficiary = address(0x2);

    function setUp() public {
        usdc = new MockERC20Invariant();
        escrow = new USDCEscrow(address(usdc));
        handler = new EscrowHandler(escrow, usdc);

        vm.warp(1000);

        targetContract(address(handler));
    }

    function invariant_conservationOfFunds() public view {
        uint256 escrowBalance = usdc.balanceOf(address(escrow));

        // Sum amounts of all active + disputed escrows
        uint256 expectedLocked = 0;
        uint256 count = escrow.getEscrowCount();
        for (uint256 i = 0; i < count; i++) {
            USDCEscrow.Escrow memory e = escrow.getEscrow(i);
            if (
                e.state == USDCEscrow.EscrowState.Active ||
                e.state == USDCEscrow.EscrowState.Disputed
            ) {
                expectedLocked += e.amount;
            }
        }

        assertEq(escrowBalance, expectedLocked);
    }

    function invariant_counterMatchesCreated() public view {
        assertEq(escrow.getEscrowCount(), handler.totalCreated());
    }

    function invariant_noFundsLeak() public view {
        uint256 totalMinted = handler.totalMinted();
        uint256 escrowBal = usdc.balanceOf(address(escrow));
        uint256 beneficiaryBal = usdc.balanceOf(beneficiary);
        uint256 depositorBal = usdc.balanceOf(depositor);
        uint256 handlerBal = usdc.balanceOf(address(handler));

        assertEq(totalMinted, escrowBal + beneficiaryBal + depositorBal + handlerBal);
    }
}

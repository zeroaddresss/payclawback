// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/USDCEscrow.sol";

contract MockERC20Fuzz is IERC20 {
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

contract USDCEscrowFuzzTest is Test {
    USDCEscrow public escrow;
    MockERC20Fuzz public usdc;

    address public depositor = address(0x1);
    address public beneficiary = address(0x2);

    function setUp() public {
        usdc = new MockERC20Fuzz();
        escrow = new USDCEscrow(address(usdc));
        vm.warp(1000);
    }

    function _mintAndApprove(address user, uint256 amount) internal {
        usdc.mint(user, amount);
        vm.prank(user);
        usdc.approve(address(escrow), amount);
    }

    function testFuzz_createEscrow(uint256 amount, uint256 deadline) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        deadline = bound(deadline, block.timestamp + 1, block.timestamp + 365 days);

        _mintAndApprove(depositor, amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Fuzz test", deadline);

        assertEq(id, 0);
        assertEq(escrow.getEscrowCount(), 1);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(e.depositor, depositor);
        assertEq(e.beneficiary, beneficiary);
        assertEq(e.amount, amount);
        assertEq(e.deadline, deadline);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Active));
        assertEq(usdc.balanceOf(address(escrow)), amount);
    }

    function testFuzz_createAndRelease(uint256 amount) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        uint256 deadline = block.timestamp + 1 days;

        _mintAndApprove(depositor, amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Fuzz release", deadline);

        uint256 balBefore = usdc.balanceOf(beneficiary);

        vm.prank(depositor);
        escrow.release(id);

        assertEq(usdc.balanceOf(beneficiary), balBefore + amount);

        USDCEscrow.Escrow memory e = escrow.getEscrow(id);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Released));
    }

    function testFuzz_createDisputeResolve(uint256 amount, bool releaseToBeneficiary) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        uint256 deadline = block.timestamp + 1 days;

        _mintAndApprove(depositor, amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Fuzz dispute", deadline);

        vm.prank(depositor);
        escrow.dispute(id);

        uint256 beneficiaryBefore = usdc.balanceOf(beneficiary);
        uint256 depositorBefore = usdc.balanceOf(depositor);

        // arbiter is address(this) since this contract deployed escrow
        escrow.resolveDispute(id, releaseToBeneficiary);

        if (releaseToBeneficiary) {
            assertEq(usdc.balanceOf(beneficiary), beneficiaryBefore + amount);
            USDCEscrow.Escrow memory e = escrow.getEscrow(id);
            assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Released));
        } else {
            assertEq(usdc.balanceOf(depositor), depositorBefore + amount);
            USDCEscrow.Escrow memory e = escrow.getEscrow(id);
            assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Refunded));
        }
    }

    function testFuzz_createAndExpire(uint256 amount, uint256 timePastDeadline) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        uint256 deadline = block.timestamp + 1 days;
        timePastDeadline = bound(timePastDeadline, 1, 365 days);

        _mintAndApprove(depositor, amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Fuzz expire", deadline);

        vm.warp(deadline + timePastDeadline);

        uint256 depositorBefore = usdc.balanceOf(depositor);

        escrow.claimExpired(id);

        assertEq(usdc.balanceOf(depositor), depositorBefore + amount);

        USDCEscrow.Escrow memory e = escrow.getEscrow(id);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Expired));
    }

    function testFuzz_multipleEscrows(uint8 count) public {
        count = uint8(bound(uint256(count), 1, 20));
        uint256 amountEach = 100 * 1e6; // 100 USDC each
        uint256 deadline = block.timestamp + 1 days;

        _mintAndApprove(depositor, amountEach * uint256(count));

        vm.startPrank(depositor);
        for (uint8 i = 0; i < count; i++) {
            uint256 id = escrow.createEscrow(beneficiary, amountEach, "Multi", deadline);
            assertEq(id, uint256(i));
        }
        vm.stopPrank();

        assertEq(escrow.getEscrowCount(), uint256(count));
        assertEq(usdc.balanceOf(address(escrow)), amountEach * uint256(count));
    }

    // ========== PBT: conservation of value property ==========

    function testFuzz_conservationOfValue_release(uint256 amount) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        _mintAndApprove(depositor, amount);

        uint256 totalBefore = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Conservation", block.timestamp + 1 days);

        // Value conserved after create
        uint256 totalMid = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalMid);

        vm.prank(depositor);
        escrow.release(id);

        // Value conserved after release
        uint256 totalAfter = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalAfter);
    }

    function testFuzz_conservationOfValue_disputeResolve(uint256 amount, bool releaseToBeneficiary) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        _mintAndApprove(depositor, amount);

        uint256 totalBefore = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Conservation", block.timestamp + 1 days);

        vm.prank(depositor);
        escrow.dispute(id);

        // Value conserved mid-dispute (funds still in escrow)
        uint256 totalMid = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalMid);

        escrow.resolveDispute(id, releaseToBeneficiary);

        uint256 totalAfter = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalAfter);
    }

    // ========== PBT: state transition validity property ==========

    function testFuzz_stateTransition_onlyValidFromActive(uint256 amount, uint8 action) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        action = uint8(bound(uint256(action), 0, 2)); // 0=release, 1=dispute, 2=expire
        _mintAndApprove(depositor, amount);

        uint256 deadline = block.timestamp + 1 days;

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "State test", deadline);

        // Perform one valid action
        if (action == 0) {
            vm.prank(depositor);
            escrow.release(id);
        } else if (action == 1) {
            vm.prank(depositor);
            escrow.dispute(id);
            // resolve it too
            escrow.resolveDispute(id, true);
        } else {
            vm.warp(deadline + 1);
            escrow.claimExpired(id);
        }

        // After terminal state, ALL actions should fail
        vm.prank(depositor);
        vm.expectRevert();
        escrow.release(id);

        vm.prank(depositor);
        vm.expectRevert();
        escrow.dispute(id);

        vm.warp(deadline + 2);
        vm.expectRevert();
        escrow.claimExpired(id);
    }

    // ========== PBT: escrow amount immutability ==========

    function testFuzz_amountNeverChanges(uint256 amount) public {
        amount = bound(amount, 1, 1e12 * 1e6);
        _mintAndApprove(depositor, amount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, amount, "Immutable", block.timestamp + 1 days);

        USDCEscrow.Escrow memory e1 = escrow.getEscrow(id);
        assertEq(e1.amount, amount);

        // Dispute
        vm.prank(depositor);
        escrow.dispute(id);

        USDCEscrow.Escrow memory e2 = escrow.getEscrow(id);
        assertEq(e2.amount, amount);

        // Resolve
        escrow.resolveDispute(id, true);

        USDCEscrow.Escrow memory e3 = escrow.getEscrow(id);
        assertEq(e3.amount, amount);
    }
}

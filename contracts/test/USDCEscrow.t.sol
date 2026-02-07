// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/USDCEscrow.sol";

contract MockERC20 is IERC20 {
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

contract USDCEscrowTest is Test {
    event EscrowCreated(uint256 indexed id, address indexed depositor, address indexed beneficiary, uint256 amount, uint256 deadline);
    event EscrowReleased(uint256 indexed id, address indexed beneficiary, uint256 amount);
    event EscrowDisputed(uint256 indexed id, address indexed disputedBy);
    event EscrowResolved(uint256 indexed id, bool releasedToBeneficiary, uint256 amount);
    event EscrowExpired(uint256 indexed id, address indexed depositor, uint256 amount);

    USDCEscrow public escrow;
    MockERC20 public usdc;

    address public owner = address(this);
    address public depositor = address(0x1);
    address public beneficiary = address(0x2);
    address public stranger = address(0x3);

    uint256 public constant AMOUNT = 1000 * 1e6; // 1000 USDC
    uint256 public constant DEADLINE = 1000000;

    function setUp() public {
        usdc = new MockERC20();
        escrow = new USDCEscrow(address(usdc));

        // Mint USDC to depositor
        usdc.mint(depositor, AMOUNT * 10);

        // Approve escrow contract from depositor
        vm.prank(depositor);
        usdc.approve(address(escrow), type(uint256).max);

        // Set block timestamp to something reasonable
        vm.warp(1000);
    }

    // ========== createEscrow tests ==========

    function test_createEscrow_success() public {
        vm.prank(depositor);
        vm.expectEmit(true, true, true, true);
        emit EscrowCreated(0, depositor, beneficiary, AMOUNT, DEADLINE);
        uint256 id = escrow.createEscrow(beneficiary, AMOUNT, "Test escrow", DEADLINE);

        assertEq(id, 0);
        assertEq(escrow.getEscrowCount(), 1);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(e.depositor, depositor);
        assertEq(e.beneficiary, beneficiary);
        assertEq(e.arbiter, owner);
        assertEq(e.amount, AMOUNT);
        assertEq(keccak256(bytes(e.description)), keccak256(bytes("Test escrow")));
        assertEq(e.deadline, DEADLINE);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Active));
        assertEq(e.createdAt, 1000);

        // Check USDC was transferred
        assertEq(usdc.balanceOf(address(escrow)), AMOUNT);
    }

    function test_createEscrow_multipleEscrows() public {
        vm.startPrank(depositor);
        uint256 id1 = escrow.createEscrow(beneficiary, AMOUNT, "First", DEADLINE);
        uint256 id2 = escrow.createEscrow(beneficiary, AMOUNT, "Second", DEADLINE);
        vm.stopPrank();

        assertEq(id1, 0);
        assertEq(id2, 1);
        assertEq(escrow.getEscrowCount(), 2);
    }

    function test_createEscrow_failZeroAmount() public {
        vm.prank(depositor);
        vm.expectRevert("Amount must be greater than 0");
        escrow.createEscrow(beneficiary, 0, "Test", DEADLINE);
    }

    function test_createEscrow_failZeroBeneficiary() public {
        vm.prank(depositor);
        vm.expectRevert("Beneficiary cannot be zero address");
        escrow.createEscrow(address(0), AMOUNT, "Test", DEADLINE);
    }

    function test_createEscrow_failPastDeadline() public {
        vm.prank(depositor);
        vm.expectRevert("Deadline must be in the future");
        escrow.createEscrow(beneficiary, AMOUNT, "Test", 500); // before current timestamp of 1000
    }

    function test_createEscrow_failInsufficientAllowance() public {
        vm.prank(stranger); // stranger has no USDC
        vm.expectRevert("Insufficient balance");
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);
    }

    // ========== release tests ==========

    function test_release_byDepositor() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        uint256 balBefore = usdc.balanceOf(beneficiary);

        vm.prank(depositor);
        vm.expectEmit(true, true, false, true);
        emit EscrowReleased(0, beneficiary, AMOUNT);
        escrow.release(0);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Released));
        assertEq(usdc.balanceOf(beneficiary), balBefore + AMOUNT);
    }

    function test_release_byArbiter() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // owner is the arbiter
        escrow.release(0);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Released));
        assertEq(usdc.balanceOf(beneficiary), AMOUNT);
    }

    function test_release_failByNonAuthorized() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(stranger);
        vm.expectRevert("Only depositor or arbiter can release");
        escrow.release(0);
    }

    function test_release_failNotActive() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // Release once
        vm.prank(depositor);
        escrow.release(0);

        // Try to release again
        vm.prank(depositor);
        vm.expectRevert("Escrow is not active");
        escrow.release(0);
    }

    // ========== dispute tests ==========

    function test_dispute_byDepositor() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        vm.expectEmit(true, true, false, false);
        emit EscrowDisputed(0, depositor);
        escrow.dispute(0);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Disputed));
    }

    function test_dispute_byBeneficiary() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(beneficiary);
        vm.expectEmit(true, true, false, false);
        emit EscrowDisputed(0, beneficiary);
        escrow.dispute(0);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Disputed));
    }

    function test_dispute_failByNonAuthorized() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(stranger);
        vm.expectRevert("Only depositor or beneficiary can dispute");
        escrow.dispute(0);
    }

    function test_dispute_failNotActive() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.release(0);

        vm.prank(depositor);
        vm.expectRevert("Escrow is not active");
        escrow.dispute(0);
    }

    // ========== resolveDispute tests ==========

    function test_resolveDispute_releaseToBeneficiary() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        uint256 balBefore = usdc.balanceOf(beneficiary);

        // owner is arbiter
        vm.expectEmit(true, false, false, true);
        emit EscrowResolved(0, true, AMOUNT);
        escrow.resolveDispute(0, true);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Released));
        assertEq(usdc.balanceOf(beneficiary), balBefore + AMOUNT);
    }

    function test_resolveDispute_refundToDepositor() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        uint256 balBefore = usdc.balanceOf(depositor);

        vm.expectEmit(true, false, false, true);
        emit EscrowResolved(0, false, AMOUNT);
        escrow.resolveDispute(0, false);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Refunded));
        assertEq(usdc.balanceOf(depositor), balBefore + AMOUNT);
    }

    function test_resolveDispute_failByNonArbiter() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        vm.prank(stranger);
        vm.expectRevert("Only arbiter can resolve disputes");
        escrow.resolveDispute(0, true);
    }

    function test_resolveDispute_failNotDisputed() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.expectRevert("Escrow is not disputed");
        escrow.resolveDispute(0, true);
    }

    // ========== claimExpired tests ==========

    function test_claimExpired_success() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // Warp past deadline
        vm.warp(DEADLINE + 1);

        uint256 balBefore = usdc.balanceOf(depositor);

        vm.expectEmit(true, true, false, true);
        emit EscrowExpired(0, depositor, AMOUNT);
        escrow.claimExpired(0);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Expired));
        assertEq(usdc.balanceOf(depositor), balBefore + AMOUNT);
    }

    function test_claimExpired_failBeforeDeadline() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.expectRevert("Escrow has not expired");
        escrow.claimExpired(0);
    }

    function test_claimExpired_failNotActive() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.release(0);

        vm.warp(DEADLINE + 1);

        vm.expectRevert("Escrow is not active");
        escrow.claimExpired(0);
    }
}

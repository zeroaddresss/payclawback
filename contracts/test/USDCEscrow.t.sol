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

    // ========== edge case tests ==========

    function test_createEscrow_depositorIsBeneficiary() public {
        // Contract does not prevent depositor == beneficiary
        vm.prank(depositor);
        uint256 id = escrow.createEscrow(depositor, AMOUNT, "Self escrow", DEADLINE);

        USDCEscrow.Escrow memory e = escrow.getEscrow(id);
        assertEq(e.depositor, depositor);
        assertEq(e.beneficiary, depositor);
    }

    function test_release_byBeneficiary_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(beneficiary);
        vm.expectRevert("Only depositor or arbiter can release");
        escrow.release(0);
    }

    function test_claimExpired_exactDeadline() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // Warp to exactly the deadline (not past it)
        vm.warp(DEADLINE);

        // Should revert because require is block.timestamp > deadline (strict >)
        vm.expectRevert("Escrow has not expired");
        escrow.claimExpired(0);
    }

    function test_getEscrow_nonexistent() public view {
        // Reading a non-existent escrow returns zeroed struct
        USDCEscrow.Escrow memory e = escrow.getEscrow(999);
        assertEq(e.id, 0);
        assertEq(e.depositor, address(0));
        assertEq(e.beneficiary, address(0));
        assertEq(e.arbiter, address(0));
        assertEq(e.amount, 0);
        assertEq(e.deadline, 0);
        assertEq(uint256(e.state), uint256(USDCEscrow.EscrowState.Active));
    }

    function test_createEscrow_veryLargeAmount() public {
        uint256 largeAmount = 1e12 * 1e6; // 1 trillion USDC (1e18)
        usdc.mint(depositor, largeAmount);

        vm.prank(depositor);
        usdc.approve(address(escrow), largeAmount);

        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, largeAmount, "Whale escrow", DEADLINE);

        USDCEscrow.Escrow memory e = escrow.getEscrow(id);
        assertEq(e.amount, largeAmount);
        assertEq(usdc.balanceOf(address(escrow)), largeAmount);
    }

    // ========== state transition matrix tests (audit prep) ==========

    function test_dispute_afterDisputed_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        // Already disputed - should revert
        vm.prank(depositor);
        vm.expectRevert("Escrow is not active");
        escrow.dispute(0);
    }

    function test_release_afterDisputed_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        // Cannot release a disputed escrow
        vm.prank(depositor);
        vm.expectRevert("Escrow is not active");
        escrow.release(0);
    }

    function test_claimExpired_afterDisputed_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        vm.warp(DEADLINE + 1);

        // Cannot claim expired on a disputed escrow
        vm.expectRevert("Escrow is not active");
        escrow.claimExpired(0);
    }

    function test_resolveDispute_afterResolved_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        escrow.resolveDispute(0, true);

        // Already resolved
        vm.expectRevert("Escrow is not disputed");
        escrow.resolveDispute(0, false);
    }

    function test_claimExpired_afterExpired_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.warp(DEADLINE + 1);
        escrow.claimExpired(0);

        // Already expired
        vm.expectRevert("Escrow is not active");
        escrow.claimExpired(0);
    }

    function test_release_afterRefunded_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        escrow.resolveDispute(0, false); // refund

        vm.prank(depositor);
        vm.expectRevert("Escrow is not active");
        escrow.release(0);
    }

    function test_claimExpired_afterRefunded_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        escrow.resolveDispute(0, false); // refund

        vm.warp(DEADLINE + 1);

        vm.expectRevert("Escrow is not active");
        escrow.claimExpired(0);
    }

    // ========== access control matrix tests (audit prep) ==========

    function test_resolveDispute_byDepositor_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        vm.prank(depositor);
        vm.expectRevert("Only arbiter can resolve disputes");
        escrow.resolveDispute(0, true);
    }

    function test_resolveDispute_byBeneficiary_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(beneficiary);
        escrow.dispute(0);

        vm.prank(beneficiary);
        vm.expectRevert("Only arbiter can resolve disputes");
        escrow.resolveDispute(0, true);
    }

    function test_dispute_byArbiter_fails() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // arbiter (owner) should NOT be able to dispute
        vm.expectRevert("Only depositor or beneficiary can dispute");
        escrow.dispute(0);
    }

    function test_claimExpired_anyoneCanCall() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.warp(DEADLINE + 1);

        uint256 depositorBefore = usdc.balanceOf(depositor);

        // stranger can call claimExpired - funds still go to depositor
        vm.prank(stranger);
        escrow.claimExpired(0);

        assertEq(usdc.balanceOf(depositor), depositorBefore + AMOUNT);
    }

    // ========== deadline boundary tests (audit prep) ==========

    function test_createEscrow_deadlineExactlyBlockTimestamp_fails() public {
        vm.prank(depositor);
        vm.expectRevert("Deadline must be in the future");
        escrow.createEscrow(beneficiary, AMOUNT, "Test", block.timestamp);
    }

    function test_createEscrow_deadlineBlockTimestampPlusOne_succeeds() public {
        vm.prank(depositor);
        uint256 id = escrow.createEscrow(beneficiary, AMOUNT, "Test", block.timestamp + 1);
        assertEq(id, 0);
    }

    // ========== conservation of value test (PBT property) ==========

    function test_fullLifecycle_conservationOfValue_release() public {
        uint256 totalBefore = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));

        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.release(0);

        uint256 totalAfter = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalAfter);
    }

    function test_fullLifecycle_conservationOfValue_refund() public {
        uint256 totalBefore = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));

        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        escrow.resolveDispute(0, false);

        uint256 totalAfter = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalAfter);
    }

    function test_fullLifecycle_conservationOfValue_expire() public {
        uint256 totalBefore = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));

        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.warp(DEADLINE + 1);
        escrow.claimExpired(0);

        uint256 totalAfter = usdc.balanceOf(depositor) + usdc.balanceOf(beneficiary) + usdc.balanceOf(address(escrow));
        assertEq(totalBefore, totalAfter);
    }

    // ========== owner/arbiter immutability test ==========

    function test_arbiterIsOwner() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        USDCEscrow.Escrow memory e = escrow.getEscrow(0);
        assertEq(e.arbiter, escrow.owner());
    }
}

// ========== False-returning ERC20 tests (audit prep: malicious token) ==========

contract FalseReturningERC20 is IERC20 {
    // Returns false instead of reverting - tests the require() guards in USDCEscrow
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    bool public shouldFail;

    function setShouldFail(bool _fail) external { shouldFail = _fail; }
    function mint(address to, uint256 amount) external { _balances[to] += amount; }

    function totalSupply() external pure override returns (uint256) { return 0; }
    function balanceOf(address account) external view override returns (uint256) { return _balances[account]; }

    function transfer(address to, uint256 amount) external override returns (bool) {
        if (shouldFail) return false;
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
        if (shouldFail) return false;
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        return true;
    }
}

contract USDCEscrowFalseTokenTest is Test {
    USDCEscrow public escrow;
    FalseReturningERC20 public token;

    address public depositor = address(0x1);
    address public beneficiary = address(0x2);
    uint256 public constant AMOUNT = 1000 * 1e6;
    uint256 public constant DEADLINE = 1000000;

    function setUp() public {
        token = new FalseReturningERC20();
        escrow = new USDCEscrow(address(token));
        vm.warp(1000);

        token.mint(depositor, AMOUNT * 10);
        vm.prank(depositor);
        token.approve(address(escrow), type(uint256).max);
    }

    function test_createEscrow_failsOnFalseTransferFrom() public {
        token.setShouldFail(true);

        vm.prank(depositor);
        vm.expectRevert("USDC transfer failed");
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);
    }

    function test_release_failsOnFalseTransfer() public {
        // Create escrow normally
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        // Now make transfer return false
        token.setShouldFail(true);

        vm.prank(depositor);
        vm.expectRevert("USDC transfer failed");
        escrow.release(0);
    }

    function test_resolveDispute_failsOnFalseTransfer() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.prank(depositor);
        escrow.dispute(0);

        token.setShouldFail(true);

        vm.expectRevert("USDC transfer failed");
        escrow.resolveDispute(0, true);
    }

    function test_claimExpired_failsOnFalseTransfer() public {
        vm.prank(depositor);
        escrow.createEscrow(beneficiary, AMOUNT, "Test", DEADLINE);

        vm.warp(DEADLINE + 1);

        token.setShouldFail(true);

        vm.expectRevert("USDC transfer failed");
        escrow.claimExpired(0);
    }
}

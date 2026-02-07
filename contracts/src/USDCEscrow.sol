// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract USDCEscrow {
    enum EscrowState { Active, Released, Disputed, Refunded, Expired }

    struct Escrow {
        uint256 id;
        address depositor;
        address beneficiary;
        address arbiter;
        uint256 amount;
        string description;
        uint256 deadline;
        EscrowState state;
        uint256 createdAt;
    }

    address public owner;
    IERC20 public usdcToken;
    uint256 public escrowCounter;
    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 indexed id, address indexed depositor, address indexed beneficiary, uint256 amount, uint256 deadline);
    event EscrowReleased(uint256 indexed id, address indexed beneficiary, uint256 amount);
    event EscrowDisputed(uint256 indexed id, address indexed disputedBy);
    event EscrowResolved(uint256 indexed id, bool releasedToBeneficiary, uint256 amount);
    event EscrowExpired(uint256 indexed id, address indexed depositor, uint256 amount);

    constructor(address _usdcToken) {
        owner = msg.sender;
        usdcToken = IERC20(_usdcToken);
    }

    function createEscrow(
        address beneficiary,
        uint256 amount,
        string calldata description,
        uint256 deadlineTimestamp
    ) external returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(beneficiary != address(0), "Beneficiary cannot be zero address");
        require(deadlineTimestamp > block.timestamp, "Deadline must be in the future");

        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        uint256 id = escrowCounter;
        escrowCounter++;

        escrows[id] = Escrow({
            id: id,
            depositor: msg.sender,
            beneficiary: beneficiary,
            arbiter: owner,
            amount: amount,
            description: description,
            deadline: deadlineTimestamp,
            state: EscrowState.Active,
            createdAt: block.timestamp
        });

        emit EscrowCreated(id, msg.sender, beneficiary, amount, deadlineTimestamp);
        return id;
    }

    function release(uint256 id) external {
        Escrow storage escrow = escrows[id];
        require(escrow.state == EscrowState.Active, "Escrow is not active");
        require(
            msg.sender == escrow.depositor || msg.sender == escrow.arbiter,
            "Only depositor or arbiter can release"
        );

        escrow.state = EscrowState.Released;
        require(usdcToken.transfer(escrow.beneficiary, escrow.amount), "USDC transfer failed");

        emit EscrowReleased(id, escrow.beneficiary, escrow.amount);
    }

    function dispute(uint256 id) external {
        Escrow storage escrow = escrows[id];
        require(escrow.state == EscrowState.Active, "Escrow is not active");
        require(
            msg.sender == escrow.depositor || msg.sender == escrow.beneficiary,
            "Only depositor or beneficiary can dispute"
        );

        escrow.state = EscrowState.Disputed;

        emit EscrowDisputed(id, msg.sender);
    }

    function resolveDispute(uint256 id, bool releaseToBeneficiary) external {
        Escrow storage escrow = escrows[id];
        require(escrow.state == EscrowState.Disputed, "Escrow is not disputed");
        require(msg.sender == escrow.arbiter, "Only arbiter can resolve disputes");

        if (releaseToBeneficiary) {
            escrow.state = EscrowState.Released;
            require(usdcToken.transfer(escrow.beneficiary, escrow.amount), "USDC transfer failed");
        } else {
            escrow.state = EscrowState.Refunded;
            require(usdcToken.transfer(escrow.depositor, escrow.amount), "USDC transfer failed");
        }

        emit EscrowResolved(id, releaseToBeneficiary, escrow.amount);
    }

    function claimExpired(uint256 id) external {
        Escrow storage escrow = escrows[id];
        require(escrow.state == EscrowState.Active, "Escrow is not active");
        require(block.timestamp > escrow.deadline, "Escrow has not expired");

        escrow.state = EscrowState.Expired;
        require(usdcToken.transfer(escrow.depositor, escrow.amount), "USDC transfer failed");

        emit EscrowExpired(id, escrow.depositor, escrow.amount);
    }

    function getEscrow(uint256 id) external view returns (Escrow memory) {
        return escrows[id];
    }

    function getEscrowCount() external view returns (uint256) {
        return escrowCounter;
    }
}

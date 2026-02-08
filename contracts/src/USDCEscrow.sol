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

/// @notice USDC-based escrow contract with dispute resolution and expiry on Base Sepolia
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

    /// @notice Emitted when a new escrow is created
    event EscrowCreated(uint256 indexed id, address indexed depositor, address indexed beneficiary, uint256 amount, uint256 deadline);
    /// @notice Emitted when an escrow is released to the beneficiary
    event EscrowReleased(uint256 indexed id, address indexed beneficiary, uint256 amount);
    /// @notice Emitted when an escrow is disputed by the depositor or beneficiary
    event EscrowDisputed(uint256 indexed id, address indexed disputedBy);
    /// @notice Emitted when an arbiter resolves a disputed escrow
    event EscrowResolved(uint256 indexed id, bool releasedToBeneficiary, uint256 amount);
    /// @notice Emitted when an expired escrow is claimed back by the depositor
    event EscrowExpired(uint256 indexed id, address indexed depositor, uint256 amount);

    /// @notice Initializes the escrow contract with a USDC token address
    /// @param _usdcToken Address of the USDC token contract
    constructor(address _usdcToken) {
        owner = msg.sender;
        usdcToken = IERC20(_usdcToken);
    }

    /// @notice Creates a new escrow by transferring USDC from the caller
    /// @param beneficiary Address that will receive funds upon release
    /// @param amount Amount of USDC (6 decimals) to escrow
    /// @param description Human-readable description of the escrow terms
    /// @param deadlineTimestamp Unix timestamp after which the depositor can reclaim funds
    /// @return The ID of the newly created escrow
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

    /// @notice Releases escrowed USDC to the beneficiary
    /// @param id The escrow ID to release
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

    /// @notice Marks an active escrow as disputed, requiring arbiter resolution
    /// @param id The escrow ID to dispute
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

    /// @notice Resolves a disputed escrow by sending funds to the beneficiary or depositor
    /// @param id The disputed escrow ID to resolve
    /// @param releaseToBeneficiary If true, funds go to beneficiary; if false, refunded to depositor
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

    /// @notice Refunds USDC to the depositor after the escrow deadline has passed
    /// @param id The expired escrow ID to claim
    function claimExpired(uint256 id) external {
        Escrow storage escrow = escrows[id];
        require(escrow.state == EscrowState.Active, "Escrow is not active");
        require(block.timestamp > escrow.deadline, "Escrow has not expired");

        escrow.state = EscrowState.Expired;
        require(usdcToken.transfer(escrow.depositor, escrow.amount), "USDC transfer failed");

        emit EscrowExpired(id, escrow.depositor, escrow.amount);
    }

    /// @notice Returns the full escrow struct for a given ID
    /// @param id The escrow ID to look up
    /// @return The Escrow struct containing all escrow details
    function getEscrow(uint256 id) external view returns (Escrow memory) {
        return escrows[id];
    }

    /// @notice Returns the total number of escrows ever created
    /// @return The current escrow counter value
    function getEscrowCount() external view returns (uint256) {
        return escrowCounter;
    }
}

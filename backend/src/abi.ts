export const ESCROW_ABI = [
  // Constructor
  "constructor(address _usdcToken)",

  // Functions
  "function createEscrow(address beneficiary, uint256 amount, string description, uint256 deadlineTimestamp) returns (uint256)",
  "function release(uint256 id)",
  "function dispute(uint256 id)",
  "function resolveDispute(uint256 id, bool releaseToBeneficiary)",
  "function claimExpired(uint256 id)",
  "function getEscrow(uint256 id) view returns (tuple(uint256 id, address depositor, address beneficiary, address arbiter, uint256 amount, string description, uint256 deadline, uint8 state, uint256 createdAt))",
  "function getEscrowCount() view returns (uint256)",
  "function owner() view returns (address)",
  "function usdcToken() view returns (address)",

  // Events
  "event EscrowCreated(uint256 indexed id, address indexed depositor, address indexed beneficiary, uint256 amount, uint256 deadline)",
  "event EscrowReleased(uint256 indexed id, address indexed beneficiary, uint256 amount)",
  "event EscrowDisputed(uint256 indexed id, address indexed disputedBy)",
  "event EscrowResolved(uint256 indexed id, bool releasedToBeneficiary, uint256 amount)",
  "event EscrowExpired(uint256 indexed id, address indexed depositor, uint256 amount)",
] as const;

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
] as const;

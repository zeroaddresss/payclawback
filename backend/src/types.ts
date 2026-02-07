export enum EscrowState {
  Active = 0,
  Released = 1,
  Disputed = 2,
  Refunded = 3,
  Expired = 4,
}

export interface EscrowData {
  id: number;
  depositor: string;
  beneficiary: string;
  arbiter: string;
  amount: string; // formatted USDC
  amountRaw: string; // raw wei
  description: string;
  deadline: string; // ISO date
  deadlineTimestamp: number;
  state: EscrowState;
  stateName: string;
  createdAt: string; // ISO date
}

export interface CreateEscrowRequest {
  beneficiary: string;
  amount: number; // USDC amount (e.g. 10.5)
  description: string;
  deadline_hours: number;
}

export interface EscrowEvent {
  type: string;
  escrowId: number;
  timestamp: string;
  data: Record<string, any>;
  txHash: string;
}

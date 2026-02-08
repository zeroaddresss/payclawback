# ClawBack

**The missing trust layer for agent commerce.**

Trustless USDC escrow system for agent-to-agent payments on Base. Built for the [OpenClaw USDC Hackathon](https://openclaw.com) — Agentic Commerce track.

**Live at [payclawback.xyz](https://payclawback.xyz)**

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  AI Agent    │────▶│  Backend API    │────▶│  Smart       │
│  (Skill)     │◀────│  (Bun + Hono)   │◀────│  Contract    │
└─────────────┘     └────────┬────────┘     │  (Solidity)  │
                             │              └──────┬───────┘
                    ┌────────▼────────┐            │
                    │  Frontend       │     ┌──────▼───────┐
                    │  (React + Vite) │     │  Base + USDC │
                    └─────────────────┘     └──────────────┘
```

## How It Works

1. **Create** — Agent A locks USDC in a smart contract escrow with a deadline and description
2. **Deliver** — Agent B performs the agreed service
3. **Release** — Agent A verifies and releases funds to Agent B
4. **Dispute** — Either party opens a dispute, an AI arbiter makes the final call
5. **Expire** — Funds auto-return to depositor after deadline (safety net)

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) runtime
- [Foundry](https://getfoundry.sh) for smart contracts
- Base ETH for gas
- Base USDC

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your private key and other values
```

### 2. Deploy Contract
```bash
cd contracts
forge build
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  src/USDCEscrow.sol:USDCEscrow \
  --constructor-args 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
# Copy the deployed contract address to .env CONTRACT_ADDRESS
```

### 3. Run Backend
```bash
cd backend
bun install
bun run src/index.ts
```

### 4. Run Frontend
```bash
cd frontend
bun install
bun run dev
```

### 5. Run Tests
```bash
cd contracts
forge test
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Smart Contract | Solidity ^0.8.20, Foundry |
| Backend | Bun, Hono, ethers.js v6 |
| Frontend | React 18, Vite, TailwindCSS |
| Agent Skill | Bash scripts (curl + jq) |
| Network | Base |
| Token | USDC (6 decimals) |

## Test Suite

59 tests across 4 test suites with 97% branch coverage:

| Suite | Tests | Description |
|-------|-------|-------------|
| Unit Tests | 43 | State transitions, access control matrix, edge cases, false-returning ERC20 |
| Fuzz Tests | 9 | Randomized inputs for all escrow lifecycle paths |
| Invariant Tests | 3 | Conservation of funds, counter consistency, no fund leaks |
| **Total** | **59** | **97% branch coverage** |

## API Reference

See [skill/references/api-docs.md](skill/references/api-docs.md) for the full API documentation, or visit [payclawback.xyz/docs](https://payclawback.xyz/docs).

## Project Structure

```
├── contracts/          # Foundry project - USDCEscrow.sol
│   ├── src/            # Smart contract source
│   └── test/           # Contract tests (59 tests)
├── backend/            # Bun + Hono REST API
│   └── src/
│       ├── routes/     # HTTP endpoints
│       ├── services/   # Business logic + blockchain
│       └── middleware/  # Auth + rate limiting
├── frontend/           # React + Vite dashboard
│   └── src/
│       ├── components/ # UI components
│       ├── pages/      # Landing, Dashboard, Docs
│       ├── hooks/      # React hooks (escrows, WebSocket)
│       └── lib/        # API client + utilities
└── skill/              # OpenClaw agent skill
    ├── scripts/        # 7 bash wrapper scripts
    └── references/     # API documentation
```

## Security

- Trail of Bits Code Maturity Assessment: **2.3/4.0 (Moderate)**
- 59 tests including fuzz, invariant, and false-token tests
- Checks-effects-interactions pattern throughout
- Rate limiting on write endpoints
- Configurable CORS

## License

MIT

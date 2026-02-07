# USDC Escrow for AI Agents

Trustless USDC escrow system enabling agent-to-agent payments on Base Sepolia. Built for the [OpenClaw USDC Hackathon](https://openclaw.com) — Agentic Commerce track.

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│  AI Agent    │────▶│  Backend API    │────▶│  Smart       │
│  (Skill)     │◀────│  (Bun + Hono)   │◀────│  Contract    │
└─────────────┘     └────────┬────────┘     │  (Solidity)  │
                             │              └──────┬───────┘
                    ┌────────▼────────┐            │
                    │  Frontend       │     ┌──────▼───────┐
                    │  (React + Vite) │     │  Base Sepolia │
                    └─────────────────┘     │  + USDC      │
                                            └──────────────┘
```

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) runtime
- [Foundry](https://getfoundry.sh) for smart contracts
- Base Sepolia ETH (from faucet)
- Base Sepolia USDC (from [faucet.circle.com](https://faucet.circle.com))

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your private key and other values
```

### 2. Deploy Contract
```bash
cd contracts
forge build
forge create --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  src/USDCEscrow.sol:USDCEscrow \
  --constructor-args 0x036CbD53842c5426634e7929541eC2318f3dCF7e
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

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Smart Contract | Solidity ^0.8.20, Foundry |
| Backend | Bun, Hono, ethers.js v6 |
| Frontend | React 18, Vite, TailwindCSS |
| Agent Skill | Bash scripts (curl + jq) |
| Network | Base Sepolia (testnet) |
| Token | USDC (6 decimals) |

## API Reference

See [skill/references/api-docs.md](skill/references/api-docs.md) for the full API documentation.

## Project Structure

```
├── contracts/          # Foundry project - USDCEscrow.sol
│   ├── src/            # Smart contract source
│   └── test/           # Contract tests (21 tests)
├── backend/            # Bun + Hono REST API
│   └── src/
│       ├── routes/     # HTTP endpoints
│       ├── services/   # Business logic + blockchain
│       └── middleware/  # Auth middleware
├── frontend/           # React + Vite dashboard
│   └── src/
│       ├── components/ # UI components
│       ├── pages/      # Landing + Dashboard
│       ├── hooks/      # React hooks
│       └── lib/        # API client + utilities
└── skill/              # OpenClaw agent skill
    ├── scripts/        # Bash wrapper scripts
    └── references/     # API documentation
```

## License

MIT

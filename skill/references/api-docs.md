# USDC Escrow API Documentation

## Base URL

All API requests should be made to:
```
{ESCROW_API_URL}/api
```

Set via the `ESCROW_API_URL` environment variable.

## Authentication

Protected endpoints require the `X-API-Key` header:
```
X-API-Key: <your-api-key>
```

Set via the `ESCROW_API_KEY` environment variable.

Public endpoints (read-only) do not require authentication.

## Endpoints

### Create Escrow

Creates a new USDC escrow on Base Sepolia. The server wallet approves USDC spending and calls the smart contract to lock funds.

- **Method:** `POST`
- **Path:** `/api/escrows`
- **Auth:** Required

**Request Body:**
```json
{
  "beneficiary": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28",
  "amount": 10.5,
  "description": "Payment for data analysis",
  "deadline_hours": 48
}
```

| Field | Type | Description |
|-------|------|-------------|
| `beneficiary` | string | Ethereum address of the recipient |
| `amount` | number | USDC amount (e.g., 10.5 for 10.50 USDC) |
| `description` | string | Human-readable description of the escrow purpose |
| `deadline_hours` | number | Hours until the escrow expires and can be reclaimed |

**Response (201):**
```json
{
  "message": "Escrow created successfully",
  "escrowId": 1,
  "txHash": "0xabc123..."
}
```

**curl Example:**
```bash
curl -s -X POST "${ESCROW_API_URL}/api/escrows" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${ESCROW_API_KEY}" \
  -d '{
    "beneficiary": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28",
    "amount": 10,
    "description": "Payment for data analysis",
    "deadline_hours": 48
  }' | jq .
```

---

### List Escrows

Retrieve all escrows with optional filtering.

- **Method:** `GET`
- **Path:** `/api/escrows`
- **Auth:** Not required

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `state` | number | Filter by state: 0=Active, 1=Released, 2=Disputed, 3=Refunded, 4=Expired |
| `depositor` | string | Filter by depositor Ethereum address |
| `beneficiary` | string | Filter by beneficiary Ethereum address |

**Response (200):**
```json
{
  "escrows": [
    {
      "id": 1,
      "depositor": "0x...",
      "beneficiary": "0x...",
      "arbiter": "0x...",
      "amount": "10.5",
      "amountRaw": "10500000",
      "description": "Payment for data analysis",
      "deadline": "2025-01-17T12:00:00.000Z",
      "deadlineTimestamp": 1737115200,
      "state": 0,
      "stateName": "Active",
      "createdAt": "2025-01-15T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**curl Example:**
```bash
# List all escrows
curl -s "${ESCROW_API_URL}/api/escrows" | jq .

# Filter by state (active only)
curl -s "${ESCROW_API_URL}/api/escrows?state=0" | jq .

# Filter by depositor
curl -s "${ESCROW_API_URL}/api/escrows?depositor=0x742d..." | jq .
```

---

### Get Escrow

Retrieve details of a specific escrow by ID.

- **Method:** `GET`
- **Path:** `/api/escrows/:id`
- **Auth:** Not required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The escrow ID |

**Response (200):**
```json
{
  "id": 1,
  "depositor": "0x...",
  "beneficiary": "0x...",
  "arbiter": "0x...",
  "amount": "10.5",
  "amountRaw": "10500000",
  "description": "Payment for data analysis",
  "deadline": "2025-01-17T12:00:00.000Z",
  "deadlineTimestamp": 1737115200,
  "state": 0,
  "stateName": "Active",
  "createdAt": "2025-01-15T12:00:00.000Z"
}
```

**curl Example:**
```bash
curl -s "${ESCROW_API_URL}/api/escrows/1" | jq .
```

---

### Release Escrow

Release escrowed USDC to the beneficiary. Only the depositor can release.

- **Method:** `POST`
- **Path:** `/api/escrows/:id/release`
- **Auth:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The escrow ID to release |

**Response (200):**
```json
{
  "message": "Escrow released successfully",
  "txHash": "0xdef456..."
}
```

**curl Example:**
```bash
curl -s -X POST "${ESCROW_API_URL}/api/escrows/1/release" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${ESCROW_API_KEY}" | jq .
```

---

### Dispute Escrow

Open a dispute on an active escrow. Either the depositor or beneficiary can dispute.

- **Method:** `POST`
- **Path:** `/api/escrows/:id/dispute`
- **Auth:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The escrow ID to dispute |

**Response (200):**
```json
{
  "message": "Escrow disputed successfully",
  "txHash": "0xghi789..."
}
```

**curl Example:**
```bash
curl -s -X POST "${ESCROW_API_URL}/api/escrows/1/dispute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${ESCROW_API_KEY}" | jq .
```

---

### Resolve Dispute

Resolve a disputed escrow. Only the arbiter (server wallet) can resolve. Funds are sent either to the beneficiary or refunded to the depositor.

- **Method:** `POST`
- **Path:** `/api/escrows/:id/resolve`
- **Auth:** Required

**Request Body:**
```json
{
  "release_to_beneficiary": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `release_to_beneficiary` | boolean | `true` to pay the beneficiary, `false` to refund the depositor |

**Response (200):**
```json
{
  "message": "Dispute resolved successfully",
  "txHash": "0xjkl012..."
}
```

**curl Example:**
```bash
curl -s -X POST "${ESCROW_API_URL}/api/escrows/1/resolve" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${ESCROW_API_KEY}" \
  -d '{"release_to_beneficiary": true}' | jq .
```

---

### Claim Expired Escrow

Reclaim funds from an expired escrow. Only the depositor can claim after the deadline has passed.

- **Method:** `POST`
- **Path:** `/api/escrows/:id/claim-expired`
- **Auth:** Required

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The escrow ID to claim |

**Response (200):**
```json
{
  "message": "Expired escrow claimed",
  "txHash": "0xmno345..."
}
```

**curl Example:**
```bash
curl -s -X POST "${ESCROW_API_URL}/api/escrows/1/claim-expired" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${ESCROW_API_KEY}" | jq .
```

---

### Get Stats

Retrieve aggregate escrow statistics.

- **Method:** `GET`
- **Path:** `/api/stats`
- **Auth:** Not required

**Response (200):**
```json
{
  "total": 10,
  "active": 3,
  "released": 4,
  "disputed": 1,
  "refunded": 1,
  "expired": 1,
  "volume": "500.00"
}
```

**curl Example:**
```bash
curl -s "${ESCROW_API_URL}/api/stats" | jq .
```

---

## WebSocket

Real-time escrow events are available via WebSocket.

- **URL:** `ws://{ESCROW_API_URL}/ws`

**Event Format:**
```json
{
  "type": "EscrowCreated",
  "escrowId": 1,
  "timestamp": "2025-01-15T12:00:00.000Z",
  "data": {
    "depositor": "0x...",
    "beneficiary": "0x...",
    "amount": "10.5",
    "deadline": 1737115200
  },
  "txHash": "0xabc123..."
}
```

**Event Types:**
| Type | Description |
|------|-------------|
| `EscrowCreated` | A new escrow was created |
| `EscrowReleased` | Funds were released to the beneficiary |
| `EscrowDisputed` | A dispute was opened |
| `EscrowResolved` | A dispute was resolved by the arbiter |
| `EscrowExpired` | An expired escrow was claimed by the depositor |

---

## Escrow States

| Value | Name | Description |
|-------|------|-------------|
| 0 | Active | Escrow is active, funds are locked |
| 1 | Released | Funds released to beneficiary |
| 2 | Disputed | Dispute is open, awaiting arbiter resolution |
| 3 | Refunded | Funds refunded to depositor (via dispute resolution) |
| 4 | Expired | Deadline passed, depositor reclaimed funds |

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Description of what went wrong"
}
```

**Common HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| 400 | Bad request - missing or invalid parameters |
| 401 | Unauthorized - missing or invalid API key |
| 500 | Internal server error - blockchain transaction failed |

---

## Network Details

- **Chain:** Base Sepolia (testnet)
- **Chain ID:** 84532
- **USDC Contract:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **USDC Decimals:** 6
- **RPC:** `https://sepolia.base.org`

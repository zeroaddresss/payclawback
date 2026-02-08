if (!process.env.API_KEY) {
  console.warn("WARNING: API_KEY not set. Authentication will reject all requests.");
}

export const config = {
  port: parseInt(process.env.PORT || "3001"),
  privateKey: process.env.PRIVATE_KEY || "",
  rpcUrl: process.env.RPC_URL || "",
  apiKey: process.env.API_KEY || "",
  usdcAddress: process.env.USDC_ADDRESS || "",
  contractAddress: process.env.CONTRACT_ADDRESS || "",
  networkName: process.env.NETWORK_NAME || "base-sepolia",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

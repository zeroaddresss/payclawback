export const config = {
  port: parseInt(process.env.PORT || "3001"),
  privateKey: process.env.PRIVATE_KEY || "",
  rpcUrl: process.env.RPC_URL || "https://sepolia.base.org",
  apiKey: process.env.API_KEY || "test-api-key",
  usdcAddress:
    process.env.USDC_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  contractAddress: process.env.CONTRACT_ADDRESS || "",
};

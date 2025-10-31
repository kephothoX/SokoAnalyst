import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Solana Balance Tool
export const SolanaGetBalanceTool = createTool({
  id: "solana-get-balance",
  description: "Get SOL balance for a Solana wallet address",
  inputSchema: z.object({
    address: z.string().describe("Solana wallet address"),
  }),
  outputSchema: z.object({
    address: z.string(),
    balance: z.number(),
    balanceSOL: z.number(),
    network: z.string(),
  }),
  execute: async ({ context }) => {
    return await getSolanaBalance(context.address);
  },
});

const getSolanaBalance = async (address: string) => {
  try {
    // In a real implementation, you would connect to Solana RPC
    // For now, we'll simulate the response
    const mockBalance = Math.random() * 100; // Random balance between 0-100 SOL
    const lamports = mockBalance * 1000000000; // Convert SOL to lamports

    return {
      address,
      balance: lamports,
      balanceSOL: mockBalance,
      network: "mainnet-beta",
    };
  } catch (error) {
    throw new Error(`Failed to get balance for address ${address}: ${error}`);
  }
};

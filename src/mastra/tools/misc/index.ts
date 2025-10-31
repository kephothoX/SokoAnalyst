import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Get Name Tool
export const getNameTool = createTool({
  id: "get-name",
  description: "Get information about a name",
  inputSchema: z.object({
    name: z.string().describe("Name to get information about"),
  }),
  outputSchema: z.object({
    name: z.string(),
    origin: z.string(),
    meaning: z.string(),
    popularity: z.string(),
  }),
  execute: async ({ context }) => {
    return await getNameInfo(context.name);
  },
});

const getNameInfo = async (name: string) => {
  // Mock name information - in a real implementation, you might use a names API
  const origins = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Greek",
    "Latin",
    "Hebrew",
    "Arabic",
  ];
  const meanings = [
    "noble",
    "brave",
    "wise",
    "strong",
    "beautiful",
    "peaceful",
    "joyful",
    "blessed",
  ];
  const popularities = [
    "Very Popular",
    "Popular",
    "Moderately Popular",
    "Uncommon",
    "Rare",
  ];

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
    origin: origins[Math.floor(Math.random() * origins.length)],
    meaning: meanings[Math.floor(Math.random() * meanings.length)],
    popularity: popularities[Math.floor(Math.random() * popularities.length)],
  };
};

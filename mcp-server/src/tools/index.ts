import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMathTools } from "./math.js";

export function registerAllTools(server: McpServer): void {
  registerMathTools(server);
  // Add future tool groups here:
  // registerTextTools(server);
  // registerCodeTools(server);
}

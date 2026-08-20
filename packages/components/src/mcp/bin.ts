#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createBrilliantUiMcpServer } from "./server.js";

serveStdio(createBrilliantUiMcpServer, {
  onerror: (error) => {
    console.error("Brilliant UI MCP server failed:", error);
    process.exitCode = 1;
  },
});

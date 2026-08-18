#!/usr/bin/env node
import { addItems, initProject, updateItems } from "./commands.js";

const HELP = `Brilliant UI CLI

Usage:
  brilliant-ui init [--force]
  brilliant-ui add <item...> [--force]
  brilliant-ui update [item...] 
  brilliant-ui --help
`;

async function main(argv: readonly string[]): Promise<void> {
  const force = argv.includes("--force");
  const positional = argv.filter((argument) => !argument.startsWith("--"));
  const [command, ...names] = positional;
  const context = { cwd: process.cwd(), force, log: console.log };

  switch (command) {
    case "init":
      await initProject(context);
      break;
    case "add":
      await addItems(names, context);
      break;
    case "update":
      await updateItems(names, context);
      break;
    case "help":
    case undefined:
      console.log(HELP);
      break;
    default:
      throw new Error(`Unknown command "${command}".\n\n${HELP}`);
  }
}

main(process.argv.slice(2)).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`error: ${message}`);
  process.exitCode = 1;
});

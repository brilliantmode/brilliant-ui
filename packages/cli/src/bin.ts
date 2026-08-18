#!/usr/bin/env node
import { addItems, initProject, updateItems } from "./commands.js";

const HELP = `Brilliant UI CLI

Usage:
  brilliant-ui init [--cwd <path>] [--force] [--dry-run] [--yes] [--silent]
  brilliant-ui add <item...> [--cwd <path>] [--force] [--dry-run] [--yes] [--silent]
  brilliant-ui update [item...] [--cwd <path>] [--dry-run] [--yes] [--silent]
  brilliant-ui --help
`;

interface ParsedArgv {
  readonly command: string | undefined;
  readonly names: readonly string[];
  readonly cwd: string;
  readonly dryRun: boolean;
  readonly force: boolean;
  readonly silent: boolean;
}

function parseArgv(argv: readonly string[]): ParsedArgv {
  let cwd = process.cwd();
  const positional: string[] = [];
  let dryRun = false;
  let force = false;
  let silent = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--cwd": {
        const value = argv[index + 1];
        if (!value) throw new Error("--cwd requires a path.");
        cwd = value;
        index += 1;
        break;
      }
      case "--dry-run":
        dryRun = true;
        break;
      case "--force":
      case "--yes":
        force = true;
        break;
      case "--silent":
        silent = true;
        break;
      default:
        if (argument?.startsWith("--")) throw new Error(`Unknown flag "${argument}".`);
        if (argument) positional.push(argument);
        break;
    }
  }

  const [command, ...names] = positional;
  return { command, cwd, dryRun, force, names, silent };
}

async function main(argv: readonly string[]): Promise<void> {
  const { command, cwd, dryRun, force, names, silent } = parseArgv(argv);
  const context = {
    cwd,
    dryRun,
    force,
    log: silent ? () => undefined : console.log,
  };

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

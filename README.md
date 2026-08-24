# MCP Server built with mcp-use

Can Doom run in Claude? The answer is yes.

- The iframe version doesn't work (blocked by Claude host)
- The CSS version does render weirdly (I mean, it's DOOM in CSS in the first place, I didn't expect it to work perfectly)
- The [WASM version](https://github.com/cloudflare/doom-wasm) DOES work!

The project includes [freedoom1.wad](https://freedoom.github.io/downloads.html), which is a free and open-source alternative to the original Doom shareware.

If you want the real Doom, this project requires the "doom1.wad" file to be present at the exact location `public/doom-wasm/doom1.wad`. The .wad file is shareware and cannot be distributed. You need to obtain the file by buying classic Doom on Steam or GoG.

🇫🇷 Situé en France ? Retrouvez ma formation [« Créer une application MCP pour l'IA agentique »](https://www.lbke.fr/formations/ia/mcp) pour les développeurs et développeuses web.

## mcp-use

This is an MCP server project bootstrapped with [`create-mcp-use-app`](https://mcp-use.com/docs/typescript/getting-started/quickstart).

Special thanks to [Andrew Khadder](https://github.com/khandrew1) for fixing the asset loading issue.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/mcp/inspector](http://localhost:3000/mcp/inspector) with your browser to test your server.

You can start building by editing the entry file. Add tools, resources, and prompts — the server auto-reloads as you edit.

Run `npm run typecheck` to refresh MCP view types and check the project with its local TypeScript compiler. Statically declared tools used by views must be assigned to exported constants.

## Learn More

To learn more about mcp-use and MCP:

- [mcp-use Documentation](https://mcp-use.com/docs/typescript/getting-started/quickstart) — guides, API reference, and tutorials

## Deploy on Manufact Cloud

```bash
npm run deploy
```

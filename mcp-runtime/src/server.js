import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { filesystemTools, WorkspaceGuard } from './tools/filesystem.js';

const server = new Server(
  {
    name: 'mira-workstation-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tool Discovery
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'filesystem_write',
        description: 'Securely writes a file inside the sandboxed workspace. Returns file path and SHA-256 digest.',
        inputSchema: {
          type: 'object',
          properties: {
            filename: {
              type: 'string',
              description: 'Relative file path inside the workspace sandbox',
            },
            content: {
              type: 'string',
              description: 'Text content to write to the file',
            },
          },
          required: ['filename', 'content'],
        },
      },
      {
        name: 'filesystem_read',
        description: 'Reads content and SHA-256 digest of a sandboxed workspace file.',
        inputSchema: {
          type: 'object',
          properties: {
            filename: {
              type: 'string',
              description: 'Relative path of file to read',
            },
          },
          required: ['filename'],
        },
      },
      {
        name: 'filesystem_list',
        description: 'Lists files and folders inside the workspace directory.',
        inputSchema: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'Relative directory path to list (defaults to root)',
              default: '.',
            },
          },
        },
      },
    ],
  };
});

// Handle Tool Invocations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'filesystem_write': {
        const result = await filesystemTools.writeFile(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        };
      }
      case 'filesystem_read': {
        const result = await filesystemTools.readFile(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        };
      }
      case 'filesystem_list': {
        const result = await filesystemTools.listFiles(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        };
      }
      default:
        throw new Error(`Unknown or unpermitted tool: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }),
        },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`[INFO] MIRA MCP Server connected to stdio. Workspace: ${WorkspaceGuard.getRoot()}\n`);
}

run().catch((err) => {
  process.stderr.write(`[FATAL] MCP Server error: ${err.message}\n`);
  process.exit(1);
});

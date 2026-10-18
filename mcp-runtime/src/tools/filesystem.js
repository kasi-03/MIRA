import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_WORKSPACE = path.resolve(process.env.WINDOWS_WORKSPACE_ROOT || path.join(process.cwd(), '..', 'storage', 'workspace'));

export class WorkspaceGuard {
  static getRoot() {
    const root = process.env.WINDOWS_WORKSPACE_ROOT ? path.resolve(process.env.WINDOWS_WORKSPACE_ROOT) : DEFAULT_WORKSPACE;
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }
    return root;
  }

  static resolveSecurePath(relPath) {
    const root = this.getRoot();
    if (!relPath || typeof relPath !== 'string') {
      throw new Error('Invalid path argument: must be a non-empty string');
    }

    // Strip leading drive letters or root slashes
    const cleanRel = relPath.replace(/^[a-zA-Z]:[/\\]+/, '').replace(/^[/\\]+/, '');
    const resolved = path.resolve(root, cleanRel);

    const relative = path.relative(root, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`Security policy violation: Path traversal escape detected for '${relPath}'`);
    }

    return resolved;
  }
}

export const filesystemTools = {
  writeFile: async ({ filename, content }) => {
    const targetPath = WorkspaceGuard.resolveSecurePath(filename);
    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const buffer = Buffer.from(content || '', 'utf-8');
    fs.writeFileSync(targetPath, buffer);

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return {
      success: true,
      filename: path.basename(targetPath),
      path: targetPath,
      size: buffer.length,
      sha256: hash
    };
  },

  readFile: async ({ filename }) => {
    const targetPath = WorkspaceGuard.resolveSecurePath(filename);
    if (!fs.existsSync(targetPath)) {
      throw new Error(`File not found: ${filename}`);
    }
    const stat = fs.statSync(targetPath);
    if (stat.size > 5 * 1024 * 1024) {
      throw new Error(`File exceeds maximum permitted size (5 MB)`);
    }
    const content = fs.readFileSync(targetPath, 'utf-8');
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return {
      success: true,
      filename: path.basename(targetPath),
      path: targetPath,
      size: stat.size,
      sha256: hash,
      content
    };
  },

  listFiles: async ({ directory = '.' }) => {
    const targetDir = WorkspaceGuard.resolveSecurePath(directory);
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
      return { success: true, files: [] };
    }
    const entries = fs.readdirSync(targetDir, { withFileTypes: true });
    const files = entries.map(e => ({
      name: e.name,
      isDirectory: e.isDirectory(),
      size: e.isFile() ? fs.statSync(path.join(targetDir, e.name)).size : 0
    }));
    return {
      success: true,
      directory: path.relative(WorkspaceGuard.getRoot(), targetDir) || '.',
      count: files.length,
      files
    };
  }
};

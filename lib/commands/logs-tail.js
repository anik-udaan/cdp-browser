#!/usr/bin/env node

import { closeSync, existsSync, openSync, readSync, readdirSync, statSync, watch } from "node:fs";
import { join } from "node:path";
import { getLogRootDir } from "../paths.js";

const LOG_ROOT = getLogRootDir();

function findLatestFile() {
  if (!existsSync(LOG_ROOT)) return null;
  const dirs = readdirSync(LOG_ROOT)
    .filter((name) => /^\d{4}-\d{2}-\d{2}$/.test(name))
    .map((name) => join(LOG_ROOT, name))
    .filter((path) => statSafe(path)?.isDirectory())
    .sort();
  if (dirs.length === 0) return null;
  const latestDir = dirs[dirs.length - 1];
  const files = readdirSync(latestDir)
    .filter((name) => name.endsWith(".jsonl"))
    .map((name) => join(latestDir, name))
    .map((path) => ({ path, mtime: statSafe(path)?.mtimeMs || 0 }))
    .sort((a, b) => b.mtime - a.mtime);
  return files[0]?.path || null;
}

function statSafe(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

const argIndex = process.argv.indexOf("--file");
const filePath = argIndex !== -1 ? process.argv[argIndex + 1] : findLatestFile();
const follow = process.argv.includes("--follow");

if (!filePath) {
  console.error("✗ No log file found");
  process.exit(1);
}

function readFromOffset(currentOffset = 0) {
  const stats = statSafe(filePath);
  if (!stats || !stats.isFile()) {
    return currentOffset;
  }

  const start = Math.min(currentOffset, stats.size);
  const bytesToRead = stats.size - start;

  if (bytesToRead <= 0) {
    return stats.size;
  }

  const fd = openSync(filePath, "r");
  try {
    const buffer = Buffer.allocUnsafe(64 * 1024);
    let position = start;
    let remaining = bytesToRead;

    while (remaining > 0) {
      const size = Math.min(buffer.length, remaining);
      const bytesRead = readSync(fd, buffer, 0, size, position);
      if (bytesRead <= 0) {
        break;
      }

      process.stdout.write(buffer.subarray(0, bytesRead));
      position += bytesRead;
      remaining -= bytesRead;
    }

    return position;
  } finally {
    closeSync(fd);
  }
}

let offset = 0;

try {
  offset = readFromOffset(0);
  if (!follow) process.exit(0);
  watch(filePath, { persistent: true }, () => {
    offset = readFromOffset(offset);
  });
  console.log(`✓ tailing ${filePath}`);
} catch (e) {
  console.error("✗ tail failed:", e.message);
  process.exit(1);
}

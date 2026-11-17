#!/usr/bin/env bun
// PreToolUse hook for read_file: a binary file read as text puts NUL and invalid UTF-8 bytes into the conversation,
// and the model API then rejects every later request of that conversation with INVALID_ARGUMENT (400), the
// summarization call included. The read is not blocked: its path is redirected to a short text note that names the
// real file, its size and its type, so the agent carries on and picks a tool that can open it.
import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { allowPreTool, detectHarness, extractFilePath, extractToolArgs, readHookEvent } from "./lib.ts";

const SAMPLE = 64 * 1024;

const MAGIC: [string, number[]][] = [
  ["PDF", [0x25, 0x50, 0x44, 0x46]],
  ["PNG image", [0x89, 0x50, 0x4e, 0x47]],
  ["JPEG image", [0xff, 0xd8, 0xff]],
  ["GIF image", [0x47, 0x49, 0x46, 0x38]],
  ["ZIP archive", [0x50, 0x4b, 0x03, 0x04]],
  ["gzip", [0x1f, 0x8b]],
  ["Windows executable", [0x4d, 0x5a]],
  ["ELF executable", [0x7f, 0x45, 0x4c, 0x46]],
  ["SQLite database", [0x53, 0x51, 0x4c, 0x69]],
  ["WebAssembly", [0x00, 0x61, 0x73, 0x6d]],
];

/** The kind of binary the bytes are, or undefined when they are text. */
export function binaryKind(bytes: Uint8Array, truncated = false): string | undefined {
  for (const [kind, magic] of MAGIC) if (magic.every((byte, index) => bytes[index] === byte)) return kind;
  if (bytes.includes(0)) return "binary data";
  // A sample cut inside a multi-byte character is not invalid: drop at most three trailing bytes before decoding.
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (let cut = 0; cut <= (truncated ? 3 : 0); cut++) {
    try {
      decoder.decode(bytes.subarray(0, bytes.length - cut));
      return undefined;
    } catch {}
  }
  return "data that is not valid UTF-8";
}

export function note(path: string, kind: string, size: number): string {
  return [
    `This file was not read: it is ${kind} (${size} bytes), and its bytes are not text.`,
    `Reading it as text would put NUL and invalid UTF-8 bytes into the conversation, and the model API then rejects every request of it with INVALID_ARGUMENT (400).`,
    `File: ${path}`,
    `Extract its text with a tool made for the format (a PDF or document converter, an image viewer, \`file\`, \`strings\`) and read the result.`,
    "",
  ].join("\n");
}

/** The replacement path for a binary file, or undefined when the file should be read as it is. */
export function redirect(path: string, cacheDir = join(homedir(), ".cache", "agy-binary-read")): string | undefined {
  if (!path || !existsSync(path)) return undefined;
  const info = statSync(path);
  if (!info.isFile() || info.size === 0) return undefined;
  const descriptor = openSync(path, "r");
  const bytes = new Uint8Array(Math.min(info.size, SAMPLE));
  try {
    readSync(descriptor, bytes, 0, bytes.length, 0);
  } finally {
    closeSync(descriptor);
  }
  const kind = binaryKind(bytes, info.size > SAMPLE);
  if (!kind) return undefined;
  mkdirSync(cacheDir, { recursive: true });
  const stub = join(cacheDir, `${createHash("sha1").update(path).digest("hex").slice(0, 16)}.txt`);
  writeFileSync(stub, note(path, kind, info.size));
  return stub;
}

if (import.meta.main) {
  const harness = detectHarness(Bun.argv[2]);
  const event = await readHookEvent();
  let overwrite: Record<string, unknown> | undefined;
  try {
    const path = event ? extractFilePath(event) : "";
    const target = redirect(path);
    if (target && event) {
      const args = extractToolArgs(event);
      const key = ["file_path", "Path", "AbsolutePath", "path"].find((name) => typeof args[name] === "string") ?? "Path";
      overwrite = { [key]: target };
    }
  } catch {}
  allowPreTool(harness, overwrite);
}

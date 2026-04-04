"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
}

function getFilename(path: unknown): string {
  if (typeof path !== "string" || !path) return "";
  return path.split("/").pop() ?? path;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const filename = getFilename(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "undo_edit":
        return `Undoing changes to ${filename}`;
      case "view":
        return `Reading ${filename}`;
      default:
        return filename ? `Processing ${filename}` : toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": {
        const newFilename = getFilename(args.new_path);
        return `Renaming ${filename}${newFilename ? ` to ${newFilename}` : ""}`;
      }
      case "delete":
        return `Deleting ${filename}`;
      default:
        return filename ? `Processing ${filename}` : toolName;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const done = state === "result";
  const label = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

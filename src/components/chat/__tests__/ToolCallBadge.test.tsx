import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// str_replace_editor

test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/components/Card.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor str_replace command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/App.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace_editor insert command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "src/index.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Editing index.tsx")).toBeDefined();
});

test("shows 'Undoing changes' label for str_replace_editor undo_edit command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "src/Button.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Undoing changes to Button.jsx")).toBeDefined();
});

test("shows 'Reading' label for str_replace_editor view command", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "src/utils.ts" }}
      state="result"
    />
  );
  expect(screen.getByText("Reading utils.ts")).toBeDefined();
});

// file_manager

test("shows 'Renaming' label for file_manager rename command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "src/Old.jsx", new_path: "src/New.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Renaming Old.jsx to New.jsx")).toBeDefined();
});

test("shows 'Deleting' label for file_manager delete command", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "src/Unused.jsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Deleting Unused.jsx")).toBeDefined();
});

// State (done vs loading)

test("shows green dot when state is 'result'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows loading spinner when state is not 'result'", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

// Edge cases

test("uses only filename from nested path", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/components/ui/Button.tsx" }}
      state="result"
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("falls back to tool name for unknown tool", () => {
  render(
    <ToolCallBadge
      toolName="unknown_tool"
      args={{}}
      state="result"
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

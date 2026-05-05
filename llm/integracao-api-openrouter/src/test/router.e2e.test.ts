import test from "node:test";
import assert from "node:assert";
import { createServer } from "../server";
const dotenv = await import("dotenv");
dotenv.config();

console.assert(
  process.env.OPENROUTER_API_KEY,
  "OPENROUTER_API_KEY is not defined in environment variables",
);

test.todo("should generate a response from the model");
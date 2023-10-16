import { name } from "./package.json";
import { defineProject } from "vitest/config";

export default defineProject({ test: { name } });

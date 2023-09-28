import react from "@vitejs/plugin-react";
import houdini from "houdini/vite";
import { defineConfig } from "vite";
import adapter from "houdini-adapter-cloudflare";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [houdini({ adapter }), react({ fastRefresh: false })],
});

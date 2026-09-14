import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3005,
  },
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
	  autoInstall: true,
    }),
  ],
});

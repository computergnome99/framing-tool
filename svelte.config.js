import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Using adapter-vercel directly (instead of adapter-auto) so the Node.js
    // runtime is pinned explicitly rather than inferred from the build
    // environment's Node version.
    // See https://svelte.dev/docs/kit/adapter-vercel for more information.
    adapter: adapter({
      runtime: "nodejs20.x",
    }),
  },
};

export default config;

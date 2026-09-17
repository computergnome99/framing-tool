import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Using adapter-vercel directly (instead of adapter-auto). The runtime is
    // left unset so it's inferred from the Node.js version configured in the
    // Vercel project settings, instead of being pinned to a version that will
    // eventually be deprecated.
    // See https://svelte.dev/docs/kit/adapter-vercel for more information.
    adapter: adapter(),
  },
};

export default config;

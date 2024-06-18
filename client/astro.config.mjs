import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    host: true,
    open: true
  },
  adapter: netlify(),
  integrations: [tailwind(), react()]
});
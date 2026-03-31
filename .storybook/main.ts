import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../entrypoints/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  viteFinal(config) {
    config.plugins?.push(tailwindcss());
    return config;
  },
};

export default config;

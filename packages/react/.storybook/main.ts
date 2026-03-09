import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  viteFinal(config) {
    config.server ??= {};
    config.server.proxy = {
      "/sdk": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    };
    return config;
  },
};

export default config;

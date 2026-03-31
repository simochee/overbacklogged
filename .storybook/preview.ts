import type { Preview } from "@storybook/react";
import theme from "./theme";

import "../entrypoints/popup/style.css";

const preview: Preview = {
  parameters: {
    docs: {
      theme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

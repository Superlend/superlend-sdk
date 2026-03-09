import { definePreview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import React from "react";

const containerStyle: CSSProperties = {
  background: "#0e0e1a",
  padding: "32px",
  minHeight: "200px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
};

const innerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "400px",
};

export default definePreview({
  decorators: [
    (Story: React.FC) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <div style={containerStyle}>
            <div style={innerStyle}>
              <Story />
            </div>
          </div>
        </QueryClientProvider>
      );
    },
  ],
});

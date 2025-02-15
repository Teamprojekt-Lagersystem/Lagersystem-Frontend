import { defineConfig, presetAttributify, presetUno } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        "src/**/*.ts",
        "src/**/*.stories.ts",
      ],
    },
  },
  variants: [
    (matcher) => {
      if (matcher.startsWith("loading:")) {
        return {
          matcher: matcher.slice(8), // Remove "loading:" prefix
          selector: s => `${s}[data-loading="true"]`,
          sort: 1001,
        };
      }
    },
  ],
  extendTheme: (theme: any) => {
    return {
      ...theme,
      breakpoints: {
        ...theme.breakpoints,
        "xlp": "1320px",
        "2xlp": "1570px",
        "3xl": "1940px",
        "4xl": "2200px",
      },
      fontSize: {
        "sm": ["12px", "20px"],
        "base": ["14px", "22px"],
        "lg": ["16px", "24px"],
        "xl": ["20px", "28px"],
        "2xl": ["24px", "32px"],
      },
      animation: {
        keyframes: {
          "pulse-ring": "{0%,100%{box-shadow:0 0 10px 5px #3B82F6}50%{box-shadow:0 0 15px 8px #1E40AF}}",
        },
        durations: {
          "pulse-ring": "2s",
        },
        counts: {
          "pulse-ring": "infinite",
        },
      },
    };
  },
});

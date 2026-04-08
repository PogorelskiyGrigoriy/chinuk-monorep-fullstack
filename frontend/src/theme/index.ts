/**
 * @module ThemeConfig
 * Визуальная система Chinook Explorer.
 * Используем сплошные оттенки Zinc для высокой производительности и контрастности.
 */
import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  globalCss: {
    ":root": {
      colorScheme: "dark !important",
    },
    // Исправление для выпадающих списков (Select) в темной теме
    "select option": {
      backgroundColor: "#18181b !important", 
      color: "#ffffff !important",
    },
  },

  theme: {
    tokens: {
      colors: {
        // Наша основная палитра (Indigo)
        brand: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          200: { value: "#c7d2fe" },
          500: { value: "#6366f1" }, // Основной акцент
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
        },
      },
      radii: {
        xl: { value: "12px" },
        "2xl": { value: "16px" },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.zinc.950}" }, // Глубокий темный фон
          panel: { value: "#18181b" },           // Фон карточек и панелей
          muted: { value: "{colors.zinc.800}" },  // Второстепенные элементы
          subtle: { value: "#27272a" },          
        },
        fg: {
          default: { value: "#f4f4f5" },         // Основной текст
          muted: { value: "{colors.zinc.400}" },  // Вспомогательный текст
          emphasized: { value: "#ffffff" },       // Яркие заголовки
          info: { value: "{colors.brand.500}" },
        },
        border: {
          subtle: { value: "#27272a" },
          emphasized: { value: "#3f3f46" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
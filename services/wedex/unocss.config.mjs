import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from "unocss";

export default defineConfig({
  rules: [],
  presets: [presetAttributify(), presetUno(), presetIcons()],
});
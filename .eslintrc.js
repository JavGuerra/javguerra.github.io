module.exports = {
  extends: [
    "plugin:astro/recommended",
  ],
  overrides: [
    {
      // Define la configuración para los archivos `.astro`
      files: ["*.astro"],
      // Permite parsear componentes de Astro
      parser: "astro-eslint-parser",
      // Parsea los scripts dentro de los componentes .astro como TypeScript
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      processor: "astro/client-side-ts",
      rules: {
        // Añade o invalida reglas específicas aquí si lo necesitas
        // "astro/no-set-html-directive": "error"
      },
    },
  ],
};
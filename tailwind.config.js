/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
// This is a Tailwind CSS configuration file for a Remix application.
// It specifies the paths to the content files where Tailwind CSS classes will be used,
// extends the default theme, and includes no additional plugins.
// The content paths ensure that Tailwind CSS purges unused styles in production builds.
// The file is written in CommonJS format, which is compatible with Node.js environments.
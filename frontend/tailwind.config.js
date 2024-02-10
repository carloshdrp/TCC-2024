/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3F51B5",
        secondary: "#FF4081",
        background: "#F5F5F5",
        text: "#333",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

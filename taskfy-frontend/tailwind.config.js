/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#75a99c",
        secondary: "#e9a626",
      },
    },
  },
  plugins: [],
};

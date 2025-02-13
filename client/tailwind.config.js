/** @type {import('tailwindcss').Config} */
import flowbitePlugin from "flowbite/plugin";
import scrollbar from "tailwind-scrollbar";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGray: "#a3a3a3", 
        blue: "#2563eb",
      },
    },
  },
  plugins: [
    flowbitePlugin, 
    scrollbar,
  ],
};

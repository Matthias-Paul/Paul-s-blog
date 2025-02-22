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
      fontFamily:{
        jakarta:["Jakarta Sans", "sans-serif"],
        serif:["Source Serif Pro", "sans-serif"],
        work:["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    flowbitePlugin, 
    scrollbar,
   
  ],  
};

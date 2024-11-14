
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    " node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        lightGray: "gray-500",
        blue:"blue-600",
         

      }
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}


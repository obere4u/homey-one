/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    // Animation
    keyframes: {
      slideLeft: {
        "0%": { transform: "translateX(100px)" },
        "100%": { transform: "translateX(0px)" },
      },
    },
    extend: {
      animation: {
        slideLeft: "slideLeft 0.8s ease-in-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

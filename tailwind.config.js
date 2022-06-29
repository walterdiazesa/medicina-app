module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "teal-contrast": "#2A4152",
      },
      transitionDelay: {
        2000: "2000ms",
      },
      animation: {
        fade: "fadeIn 0.7s ease-in-out",
        fadeorb: "fadeIn 1s ease-in-out",
      },
      keyframes: (theme) => ({
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }),
      opacity: {
        15: "0.15",
      },
      width: {
        a4: "21cm",
        68: "17rem",
      },
      height: {
        a4: "29.7cm",
      },
      minHeight: {
        "4-25": "100px",
        "screen-navbar": "calc(100vh - 4rem)",
      },
      minWidth: {
        screen: "100vw",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
      },
    },
  },
  plugins: [],
};

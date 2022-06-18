module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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

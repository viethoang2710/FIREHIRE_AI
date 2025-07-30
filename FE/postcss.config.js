module.exports = {
  plugins: {
    tailwindcss: {},
    'postcss-color-functional-notation': {
      preserve: false
    },
    autoprefixer: {
      overrideBrowserslist: [
        "> 1%",
        "last 3 versions",
        "not dead",
        "not ie <= 11"
      ],
      grid: true,
    },
  },
}
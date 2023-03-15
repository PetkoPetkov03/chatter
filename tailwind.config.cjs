/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        discordDark: '#2f3136',
        discordLighter: '#36393f'
      },
      textColor: {
        primary: '#dcddde'
      }
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        discordDark: '#2f3136',
        discordLighter: '#36393f',
        discordPurple: '#5B209A',
        discordLightPurple: '#9656CE'
      },
      textColor: {
        primary: '#dcddde'
      }
    },
  },
  plugins: [],
};

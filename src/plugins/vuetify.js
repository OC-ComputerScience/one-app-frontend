// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

import { loadFonts } from "./webfontloader";
loadFonts();

const baseTheme = {
  dark: false,
  colors: {
    primary: "#1976D2",
    secondary: "#575757",
    accent: "#FF0000",
    success: "#47121D",
    error: "#EE5044",
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "baseTheme",
    themes: {
      baseTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
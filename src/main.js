import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

import JsonCSV from "vue-json-csv"; // @ts-ignore

loadFonts();

const app = createApp(App)
app.component("downloadCsv", JsonCSV);
app.use(vuetify).use(router).mount("#app")



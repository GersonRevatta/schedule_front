import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import VueAxios from 'vue-axios';


import './assets/main.css'
// Primefaces
import PrimeVue from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


import App from './App.vue'
// Router settings
import axios from './axios';
import routes from './router';
import auth from './auth';
import store from './store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
const app = createApp(App);

app.use(store)
app.router = router;
const moment = 'vue-moment'
app.use(router);

app.use(VueAxios, axios);
app.use(PrimeVue, { ripple: true });
app.use('vue-moment', {moment})
auth(app);


app.config.globalProperties.$filters = {
  truncate(text, length, suffix) {
    if (text.length > length) return (text.substring(0, length) + suffix);
    return text;
  },
};

app.mount('#app');

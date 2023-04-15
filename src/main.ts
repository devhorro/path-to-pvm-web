import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'; // Import the CSS file here
import './assets/main.css'

const app = createApp(App).use(router).mount('#app')
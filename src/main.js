/* eslint-disable import/order */
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import store from "@core/store"
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()


// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(store)

// Mount vue app
app.mount('#app')

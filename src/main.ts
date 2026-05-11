import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './utils/plugin' // 注册自定义菜单（必须在编辑器创建之前）

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')



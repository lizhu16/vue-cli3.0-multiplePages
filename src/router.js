import Vue from 'vue'
import Router from 'vue-router'
import Page1 from './modules/index/Index.vue'
import Page2 from './modules/home/Home.vue'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/page1',
            name: 'page1',
            component: Page1
        },
        {
            path: '/page2',
            name: 'page2',
            component: Page2
        }
    ]
})

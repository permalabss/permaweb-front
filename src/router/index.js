import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const constantRouterMap = [
    { path: '/', component: () => import('@/components/Welcome'), hidden: true },
    { path: '/dashboard', component: () => import('@/components/DashBoard'), hidden: true }
]
export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
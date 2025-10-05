import { createRouter, createWebHistory } from 'vue-router';
import Login from './pages/Login.vue';
import Task from './pages/Tasks.vue';

// simple auth guard pakai localStorage
const requiredAuth = (to, from, next) => {
    const token = localStorage.getItem('token');
    if(!token && to.path !== '/login'){
        next('/login');
    } else {
        next();
    }
};

const routes = [
    { path: '/login', component: Login},
    { path: '/tasks', component: Task, beforeEnter: requiredAuth },
    { path: '/', redirect: '/tasks' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
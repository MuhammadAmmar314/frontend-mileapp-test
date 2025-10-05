<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
            <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
            <form @submit.prevent="login" class="space-y-4">
                <input class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" v-model="username" placeholder="Username" required />
                <input class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300" v-model="password" type="password" placeholder="Password" required />
                <button class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" type="submit">Login</button>
            </form>
        </div>
    </div>
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import API from '../api';

const username = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
    loading.value = true;
    try {
        const res = await API.post("/login", { username: username.value, password: password.value });
        localStorage.setItem('token', res.data.token);
        router.push('/tasks');
    } catch (error) {
        alert("Invalid Login");
    } finally {
        loading.value = false;
    }
};
</script>
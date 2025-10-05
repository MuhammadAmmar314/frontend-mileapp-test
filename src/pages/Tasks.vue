<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <div class="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-xl font-bold">Tasks</h1>
                <button @click="logout" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Logout</button>
            </div>

            <form @submit.prevent="addTask" class="flex flex-col sm:flex-row gap-2 mb-6">
                <input v-model="newTask" placeholder="New Task..." class="flex-1 border px-3 py-1 rounded-lg">

                <select v-model="newStatus" class="border px-3 py-1 rounded-lg">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <button type="submit" class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">Add</button>
            </form>

            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                <input v-model="search" @input="fetchTask" placeholder="Search Task..." class="border px-3 py-1 rounded-lg w-full sm:w-1/3">
                <div class="flex items-center gap-2">
                    <select v-model="sort" @change="fetchTask" class="border px-3 py-1 rounded-lg w-full sm:w-40">
                        <option value="id">Sort By Id</option>
                        <option value="title">Sort By Title</option>
                        <option value="status">Sort By Status</option>
                    </select>
                    <button @click="toggleOrder" class="ml-2 px-3 py-1 border rounded-lg hover:bg-gray-100">{{ order === 'asc' ? "ASC" : "DESC" }}</button>
                </div>
            </div>
            
            <ul class="space-y-3">
                <li v-for="task in tasks" :key="task.id" class="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-100 px-4 py-3 rounded-lg gap-2">
                    <span class="text-gray-800">{{ task.title }} - <span class="italic" :class="{'text-yellow-600' : task.status === 'pending', 'text-blue-600': task.status === 'in-progress', 'text-green-600' : task.status === 'done'}">{{ task.status }}</span></span>
                    <div class="flex space-x-2">
                        <button @click="openEditModal(task)" class="bg-yellow-400 text-sm px-3 py-1 rounded-lg hover:bg-yellow-500 transition">Edit</button>
                        <button @click="deleteTask(task.id)" class="bg-red-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-600 transition">Delete</button>
                    </div>
                </li>
            </ul>

            <div v-if="meta.total > meta.limit" class="flex justify-center mt-6 space-x-2">
                <button @click="changePage(meta.page - 1)" :disabled="meta.page === 1" class="px-3 py-1 border rounded-lg disabled:opacity-50">Prev</button>
                <span class="px-3 py-1">Page {{ meta.page }} of {{ totalPages }}</span>
                <button @click="changePage(meta.page + 1)" :disabled="meta.page === totalPages" class="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                    <h2 class="text-lg font-bold mb-4">Edit Task</h2>
                    <form @submit.prevent="updateTask" class="space-y-4">
                        <input v-model="editTask.title" placeholder="Task Title" class="w-full border px-3 py-1 rounded-lg">
                        <select v-model="editTask.status" class="w-full border px-3 py-1 rounded-lg">
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                        <div class="flex justify-end space-x-2">
                            <button @click="closeModal" type="button" class="px-4 py-1 border rounded-lg">Cancel</button>
                            <button type="submit" class="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import API from '../api';
    import { useRouter } from 'vue-router';

    const tasks = ref([]);
    const newTask = ref("");
    const newStatus = ref("pending");
    const meta = ref({ page: 1, limit: 5, total: 0 });
    const router = useRouter();
    const showModal = ref(false);
    const editTask = ref({ id: null, title: "", status: "pending" });
    const search = ref("");
    const sort = ref("id");
    const order = ref('asc');
    const loading = ref(false);


    const openEditModal = (task) => {
        editTask.value = { ...task };
        showModal.value = true;
    }

    const closeModal = () => {
        showModal.value = false;
        editTask.value = { id: null, title: '', status: 'pending' };
    }

    const toggleOrder = () => {
        order.value = order.value === "asc" ? "desc" : "asc";
        fetchTask();
    }

    const totalPages = computed(() => Math.ceil(meta.value.total / meta.value.limit));

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            meta.value.page = page;
            fetchTask();
        }
    }

    const fetchTask = async () => {
        loading.value = true;
        try {
            const res = await API.get('/tasks', {
                params: { 
                    page: meta.value.page, 
                    limit: meta.value.limit,
                    search: search.value,
                    order: order.value,
                    sort: sort.value
                },
            });
            tasks.value = res.data.data;
            meta.value = res.data.meta;
        } catch (error) {
            console.error(error);
        } finally {
            loading.value = false;
        }
    }

    const addTask = async () => {
        if (!newTask.value.trim()) return;
        await API.post('/tasks', { title: newTask.value, status: newStatus.value });
        newTask.value = "";
        newStatus.value = "pending";
        fetchTask();
    }

    const updateTask = async () => {
        await API.put(`/tasks/${editTask.value.id}`, {
            title: editTask.value.title,
            status: editTask.value.status
        });
        closeModal();
        fetchTask();
    }

    const deleteTask = async (id) => {
        await API.delete(`/tasks/${id}`);
        fetchTask();
    }

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    }

    onMounted(fetchTask);
</script>
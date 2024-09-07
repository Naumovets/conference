<template>
    <nav id="header" class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">call.naumgo <span class="text-muted fs-6 fw-lighter">by Naumovets
                    D.</span></RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <form class="d-relative d-lg-flex justify-content-end collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Главная</RouterLink>
                    </li>
                    <li class="nav-item">
                        <button type="button" class="btn btn-secondary" @click="Exit">Выход</button>
                    </li>
                </ul>
            </form>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function Exit() {
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('timeout_access_token'); 
    localStorage.removeItem('timeout_refresh_token'); 
    localStorage.removeItem('timeout_refresh_start'); 
    localStorage.removeItem('refresh_token'); 
    router.push('/login')
    return;
}
</script>
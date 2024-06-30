<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav id="header" class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">call.naumgo <span class="text-muted fs-6 fw-lighter">by Naumovets D.</span></RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <form class="d-relative d-lg-flex justify-content-end collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Главная</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">Вход</RouterLink>
          </li>
          <li class="nav-item d-none d-lg-block">
            <span class="nav-link">/</span>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
          </li>
        </ul>
      </form>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped></style>

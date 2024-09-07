<script setup>;

import Header from '../components/header.vue'
import { check_token } from '@/modules/auth';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onBeforeMount(()=>{
    // Вызываем проверку токена при первом монтировании 
    if (router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register') {
      check_token();
    }
})


</script>

<template>

  <Header />

  <div class="container mt-5">
    <h1 class="text-center mb-4">Конференции</h1>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Создать новую конференцию</h5>
            <form class="light">
              <div class="form-group">
                <label for="conferenceName">Название конференции</label>
                <input type="text" class="form-control" id="conferenceName" placeholder="Введите название">
              </div>
              <div class="form-group mt-1">
                <label for="conferencePassword">Пароль (необязательно)</label>
                <input type="password" class="form-control" id="conferencePassword" placeholder="Введите пароль">
              </div>
              <RouterLink type="submit" class="btn btn-primary mt-3" to="/conference">Создать</RouterLink>
              <!-- <button type="submit" class="btn btn-primary mt-3">Создать</button> -->
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Присоединиться к конференции</h5>
            <form>
              <div class="form-group">
                <label for="conferenceCode">Код конференции</label>
                <input type="text" class="form-control" id="conferenceCode" placeholder="Введите код">
              </div>
              <button type="submit" class="btn btn-primary mt-3">Присоединиться</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

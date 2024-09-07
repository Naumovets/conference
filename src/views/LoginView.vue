<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form class="col-10 col-md-6 col-lg-4 p-5 rounded" @submit.prevent="handleSubmit">
            <h1>Вход</h1>
            <div class="mb-3">
                <label for="InputUsername" class="form-label">Username</label>
                <input type="text" class="form-control" id="InputUsername" v-model="formData.username">
            </div>
            <div class="mb-3">
                <label for="InputPassword" class="form-label">Пароль</label>
                <input type="password" class="form-control" id="InputPassword" v-model="formData.password">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="Check">
                <label class="form-check-label" for="Check">Запомнить меня</label>
            </div>
            <div class="d-flex">
                <button type="submit" class="btn btn-primary">Войти</button>
                <RouterLink class="nav-link" to="/register">Регистрация</RouterLink>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const refresh_token = ref('');
        const access_token = ref('');
        const router = useRouter();

        watch(refresh_token, (val) => {
            localStorage.setItem("refresh_token", val);
            localStorage.setItem("timeout_refresh_token", JSON.parse(atob(val.split('.')[1])).exp);
            localStorage.setItem("timeout_refresh_start", parseInt(+new Date() / 1000));
            get_access_token();
        });

        watch(access_token, (val) => {
            localStorage.setItem("access_token", val);
            localStorage.setItem("timeout_access_token", JSON.parse(atob(val.split('.')[1])).exp);

            router.push('/');
        });

        const formData = ref({
            username: '',
            password: '',
        });

        const handleSubmit = async () => {
            try {
                const response = await fetch('http://localhost:8081/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.value.username,
                        password: formData.value.password
                    }),
                });

                if (response.ok) {
                    // Обработка успешного ответа
                    const token = (await response.json()).refreshToken;

                    refresh_token.value = token;

                } else {
                    // Обработка ошибки
                    const errorData = await response.json(); // Получаем данные ошибки от сервера
                    console.error('Ошибка входа:', errorData);
                    alert("Ошибка входа")
                }
            } catch (error) {
                console.error('Ошибка при отправке запроса:', error);
            }
        };

        const get_access_token = async () => {
            try {
                const response = await fetch('http://localhost:8081/v1/auth/access', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refresh_token: refresh_token.value,
                    }),
                });

                if (response.ok) {
                    // Обработка успешного ответа
                    const token = (await response.json()).accessToken;

                    access_token.value = token;

                } else {
                    // Обработка ошибки
                    const errorData = await response.json(); // Получаем данные ошибки от сервера
                    console.log(errorData)
                    // console.error('Ошибка регистрации:', errorData);
                    alert("Ошибка авторизации")
                }
            } catch (error) {
                console.error('Ошибка при отправке запроса:', error);
            }
        }

        return {
            formData,
            handleSubmit,
        };
    },
};
</script>

<style scoped></style>
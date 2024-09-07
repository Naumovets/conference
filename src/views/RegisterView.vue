<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form class="col-10 col-md-6 col-lg-4 p-5 rounded" @submit.prevent="handleSubmit">
            <h1>Регистрация</h1>
            <div class="mb-3">
                <label for="InputUsername" class="form-label">Имя пользователя</label>
                <input type="text" class="form-control" id="InputUsername" v-model="formData.username">
            </div>
            <div class="mb-3">
                <label for="InputPassword" class="form-label">Пароль</label>
                <input type="password" class="form-control" id="InputPassword" v-model="formData.password">
            </div>
            <div class="mb-3">
                <label for="InputRepeatPassword" class="form-label">Повторите пароль</label>
                <input type="password" class="form-control" id="InputRepeatPassword" v-model="repeatPassword">
            </div>
            <div class="d-flex">
                <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                <RouterLink class="nav-link" to="/login">Войти в аккаунт</RouterLink>
            </div>
            
            <div class="mt-3">
                <p class="te4 * 30 xt-muted fs-6 fw-lighter">Нажимая "Зарегистрироваться", вы принимаете пользовательское
                    соглашение и политику конфиденциальности </p>
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
            localStorage.setItem("refresh_token", refresh_token.value);
            get_access_token();
        });

        watch(access_token, (val) => {
            localStorage.setItem("access_token", access_token.value);
            router.push('/');
        });

        const formData = ref({
            username: '',
            password: '',
        });

        const repeatPassword = ref('');

        const handleSubmit = async () => {
            if (formData.value.password !== repeatPassword.value) {
                alert('Пароли не совпадают!');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/v1/auth/register', {
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
                    // console.error('Ошибка регистрации:', errorData);
                    if (errorData.code == 6) {
                        alert("Ошибка регистрации, такой пользователь уже существует!")
                    } else {
                        alert("Ошибка регистрации")
                    }
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
            repeatPassword,
        };
    },
};
</script>

<style scoped></style>
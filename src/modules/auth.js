import { useRouter } from 'vue-router';

export function check_token() {

    const router = useRouter();
    const refreshToken = localStorage.getItem('refresh_token');

    const now = parseInt(+new Date() / 1000);
    const timeout_refresh = localStorage.getItem('timeout_refresh_token');
    const timeout_refresh_start = localStorage.getItem('timeout_refresh_start');

    if (timeout_refresh < now) {
        router.push('/login')
        return;
    }

    if ( (timeout_refresh - now) / (timeout_refresh - timeout_refresh_start) < 0.25) {
        get_refresh_token(refreshToken);
    }


    const accessToken = localStorage.getItem('access_token');
    const timeout_access = localStorage.getItem('timeout_access_token');

    if (!accessToken) {
        router.push('/login');
        return;
    }

    if (timeout_access < now) {
        get_access_token(refreshToken);
    }
}


export const get_access_token = async (refreshToken) => {

    const router = useRouter();

    try {
        const response = await fetch('http://localhost:8081/v1/auth/access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (response.ok) {
            // Обработка успешного ответа
            const token = (await response.json()).accessToken;

            localStorage.setItem('access_token', token)
            localStorage.setItem("timeout_access_token", JSON.parse(atob(token.split('.')[1])).exp);

            router.push('/');
            return;

        } else {
            // Обработка ошибки
            const errorData = await response.json(); // Получаем данные ошибки от сервера
            console.log(errorData)
            alert("Ошибка авторизации")
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

export const get_refresh_token = async (refreshToken) => {
    try {
        const response = await fetch('http://localhost:8081/v1/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (response.ok) {
            // Обработка успешного ответа
            const token = (await response.json()).refreshToken;

            localStorage.setItem('refresh_token', token)
            localStorage.setItem("timeout_refresh_token", JSON.parse(atob(token.split('.')[1])).exp);
            localStorage.setItem("timeout_refresh_start", parseInt(+new Date() / 1000));
            alert('Обновили refresh_token');
            get_access_token(token);

        } else {
            // Обработка ошибки
            const errorData = await response.json(); // Получаем данные ошибки от сервера
            console.log(errorData)
            alert("Ошибка авторизации")
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

export const isAuth = () => {
    const router = useRouter();
    const now = parseInt(+new Date() / 1000);
    const timeout_refresh = localStorage.getItem('timeout_refresh_token');

    if (timeout_refresh > now) {
        router.push({ name: 'home'})
        return;
    }

    if (timeout_refresh > now) {
        router.push({ name: 'home'})
        return;
    }
}
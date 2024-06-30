<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form class="col-10 col-md-6 col-lg-4 p-5 rounded">
            <h1>Вход</h1>
            <div class="mb-3">
                <label for="InputEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="InputEmail">
            </div>
            <div class="mb-3">
                <label for="InputPassword" class="form-label">Пароль</label>
                <input type="password" class="form-control" id="InputPassword">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="Check">
                <label class="form-check-label" for="Check">Запомнить меня</label>
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
        </form>
    </div>
</template>

<style scoped></style>
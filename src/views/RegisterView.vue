<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <form class="col-10 col-md-6 col-lg-4 p-5 rounded">
            <h1>Регистрация</h1>
            <div class="mb-3">
                <label for="InputEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="InputEmail">
            </div>
            <div class="mb-3">
                <label for="InputUsername" class="form-label">Имя пользователя</label>
                <input type="text" class="form-control" id="InputUsername">
            </div>
            <div class="mb-3">
                <label for="InputPassword" class="form-label">Пароль</label>
                <input type="password" class="form-control" id="InputPassword">
            </div>
            <div class="mb-3">
                <label for="InputRepeatPassword" class="form-label">Повторите пароль</label>
                <input type="password" class="form-control" id="InputRepeatPassword">
            </div>
            <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
            <div class="mt-3">
                <p class="text-muted fs-6 fw-lighter">Нажимая "Зарегистрироваться", вы принимаете пользовательское
                    соглашение и политику конфиденциальности </p>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
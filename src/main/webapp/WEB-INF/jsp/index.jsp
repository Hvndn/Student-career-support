<!DOCTYPE html>
<html lang="vi" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Trang chủ</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="#">Student System</a>
    </div>
</nav>

<div class="container mt-5">

    <h1 class="text-center">Xin chào!</h1>

    <p class="text-center">
        Chào <b th:text="${username}"></b>
    </p>

    <div class="text-center mt-4">
        <a href="/dashboard" class="btn btn-primary">Vào Dashboard</a>
    </div>

</div>

</body>
</html>

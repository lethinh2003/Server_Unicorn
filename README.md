# Unicorn API

**Version: 1.0.0**
<br>
**ENDPOINT: http://localhost:8084**
<br>
**HEADER FOR AUTHENTICATION:**

```
{
    X-client-id: {{userId}},
    authorization: Bearer {{ACCESS_TOKEN}}
}
```

<br>

<br>
**TEMPLATE RESPONSE:**
<br>
Success:

```
{
    "statusCode": 200, //200 or 201
    "status": "ok",
    "message": "success messsage",
    "data": {},
    "metadata": {}
}
```

Error:

```
{
    "statusCode": 400, //401, 404, 500
    "status": "Bad request",
    "message": "error message"
}
```

## Khởi tạo

Sau khi clone source về, gõ lệnh:

```bash
npm install
```

## Chạy ứng dụng

Trước khi chạy ứng dụng, vui lòng đổi tên file _config.env.a_ thành _config.env_ để áp dụng các biến môi trường vào project.
<br>
Để chạy ứng dụng trên môi trường development, gõ lệnh:

```bash
npm run dev
```

Sau đó truy cập vào http://localhost:8084

## Users

### Create user

```
http://localhost:8084/api/v1/users
```

**Method:** POST
<br>
**Request body**:

```
{
    "email": "nhuthz10@gmail.com",
    "password": "nhut12345",
    "name": "Nhựt"
}
```

**Response:**

```
{
    "statusCode": 201,
    "status": "created",
    "message": "Đăng ký tài khoản thành công",
    "data": {
        "email": "nhuthz11@gmail.com",
        "name": "Nhựt"
    },
    "metadata": {}
}
```

```
{
    "statusCode": 400,
    "status": "Bad request",
    "message": "Email đã tồn tại"
}
```

### Login user

```
http://localhost:8084/api/v1/users/login
```

**Method:** POST
<br>
**Request body**:

```
{
    "email": "muradvn2003@gmail.com",
    "password": "thinh123"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Đăng nhập thành công",
    "data": {
        "user": {
            "_id": "650d3f4f421ed24dc41454bb",
            "email": "muradvn2003@gmail.com",
            "role": "user"
        },
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5NzA3ODIyNH0.S4JFJpuR98CLXRY_H0I9AQ3l3jp3Rp-YV3tixRaOq6c",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQyMjQsImV4cCI6MTY5ODgwNjIyNH0.x-qbhvQ1xMUhB88G7P9xnWS0UDrHpLtUApfa2QHrcDU",
            "expireAccessToken": 1697078224424
        }
    },
    "metadata": {}
}
```

### Refresh token

```
http://localhost:8084/api/v1/users/refresh-token
```

**Method:** POST
<br>
**Request body**:

```
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQzNTcsImV4cCI6MTY5ODgwNjM1N30.Kkbp5VEF4NGI17v4kdlbVjtLP9gOWZWq6d3ALd5DyFE"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success",
    "data": {
        "tokens": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQ1MzQsImV4cCI6MTY5NzA3ODUzNH0.NVoAZIilPH5yrpJnpqTmiffOGMnxPpkgOuXgaL08XKg",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQ1MzQsImV4cCI6MTY5ODgwNjUzNH0.ISvdaPUIGI8jrkH0G0RYGx3v6LXWrBkDWtiS3vdEX78",
            "expireAccessToken": 1697078534948
        }
    },
    "metadata": {}
}
```

### Logout (Authentication)

```
http://localhost:8084/api/v1/users/logout
```

**Method:** POST
<br>
**Request body**:

```
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmFkdm4yMDAzQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWQiOiI2NTBkM2Y0ZjQyMWVkMjRkYzQxNDU0YmIiLCJpYXQiOjE2OTYyMTQzNTcsImV4cCI6MTY5ODgwNjM1N30.Kkbp5VEF4NGI17v4kdlbVjtLP9gOWZWq6d3ALd5DyFE"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Đăng xuất thành công",
    "data": {},
    "metadata": {}
}
```

### Send reset password otp

```
http://localhost:8084/api/v1/users/send-reset-password-otp
```

**Method:** POST
<br>
**Request body**:

```
{
    "email": "nhuthz10@gmail.com"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Gửi mã OTP thành công",
    "data": null,
    "metadata": {}
}
```

### Reset password

```
http://localhost:8084/api/v1/users/reset-password
```

**Method:** POST
<br>
**Request body**:

```
{
    "email": "nhuthz10@gmail.com",
    "otp": "472689"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Reset mật khẩu thành công",
    "data": {
        "password": "a8e1ce9d0c2eb7b5"
    },
    "metadata": {}
}
```

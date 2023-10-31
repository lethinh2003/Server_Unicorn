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

Sau đó truy cập vào http://localhost:8084/api-docs để tiến hành test API

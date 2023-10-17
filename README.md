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

### Update Information User (Authentication)

```
http://localhost:8084/api/v1/users/update
```

**Method:** POST
<br>
**Request body**:

```
{
    "birthday": "2003-10-22",
    "gender": "male", // male | female | others
    "name": "LeThinh",
    "phone_number": "0369084341"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Cập nhật thông tin thành công",
    "data": null,
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
    "message": "Reset mật khẩu thành công, mật khẩu mới đã được gửi về email của bạn",
    "data": null,
    "metadata": {}
}
```

### Get detail information (Authentication)

```
http://localhost:8084/api/v1/users
```

**Method:** GET
<br>
**Query params**:

```

```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success",
    "data": {
        "email": "muradvn2003@gmail.com",
        "name": "Lê Thịnh",
        "birthday": "2023-10-12T03:44:35.377Z",
        "gender": "male",
        "phone_number": "0767644854"
    },
    "metadata": {}
}
```

### Get user addresses (Authentication)

```
http://localhost:8084/api/v1/users/addresses
```

**Method:** GET
<br>
**Query params**:

```
page={page}
itemsOfPage={itemsOfPage}
Example: http://localhost:8084/api/v1/users/addresses?page=1&itemsOfPage=10 //Get 10 items of page 1
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success",
    "data": [
        {
            "_id": "65150cd24dc0a768743d975d",
            "default": true,
            "status": true,
            "user_id": "650d3f4f421ed24dc41454bb",
            "provine": "TPHCM",
            "district": "Quận 12",
            "ward": "Phường 1",
            "full_name": "Lê Văn Thịnh",
            "phone_number": "0369084341",
            "detail_address": "130/20",
            "createdAt": "2023-09-28T05:19:14.666Z",
            "updatedAt": "2023-09-28T05:19:14.666Z",
            "__v": 0
        },
        {
            "_id": "652c7b6de1c8890a9ca4338a",
            "default": false,
            "status": true,
            "user_id": "650d3f4f421ed24dc41454bb",
            "provine": "TPHCM",
            "district": "Quận 1",
            "ward": "Phường 12",
            "full_name": "Lê Văn Thịnh",
            "phone_number": "0369084341",
            "detail_address": "130/20",
            "createdAt": "2023-10-15T23:53:17.235Z",
            "updatedAt": "2023-10-15T23:53:17.235Z",
            "__v": 0
        }
    ],
    "metadata": {
        "page": 1,
        "limit": 10,
        "userId": "650d3f4f421ed24dc41454bb",
        "results": 2
    }
}
```

### Create user address (Authentication)

```
http://localhost:8084/api/v1/users/addresses
```

**Method:** POST
<br>
**Request body**:

```
{
    "provine": "TPHCM",
    "district": "Quận 1",
    "ward": "Phường 12",
    "fullName": "Lê Văn Thịnh",
    "phoneNumber": "0369084341",
    "detailAddress": "130/20"
}
```

**Response:**

```
{
    "statusCode": 201,
    "status": "created",
    "message": "Thêm địa chỉ thành công",
    "data": null,
    "metadata": {}
}
```

### Update user address (Authentication)

```
http://localhost:8084/api/v1/users/addresses/update
```

**Method:** POST
<br>
**Request body**:

```
{
    "addressId": "65150cd24dc0a768743d975d",
    "provine": "TPHCM",
    "district": "Quận 11",
    "ward": "Phường 1",
    "fullName": "Lê Văn Thịnh",
    "phoneNumber": "036908431",
    "detailAddress": "130/2" ,
    "isDefault": true // true | false
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Cập nhật địa chỉ thành công",
    "data": null,
    "metadata": {}
}
```

### Delete user address (Authentication)

```
http://localhost:8084/api/v1/users/addresses/delete
```

**Method:** POST
<br>
**Request body**:

```
{
    "addressId": "652c7b6de1c8890a9ca4338a"
}
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Xóa địa chỉ thành công",
    "data": null,
    "metadata": {}
}
```

### Create user voucher (Authentication - Admin role only)

```
http://localhost:8084/api/v1/vouchers
```

**Method:** POST
<br>
**Request body**:

```
{

    "userId": "650d3f4f421ed24dc41454bb",
    "code": "LETHINHVOUCHER2",
    "discount": 50,
    "description": "Voucher 2",
    "minOrderQuantity": 1,
    "minOrderAmount": 0,
    "expiredDate": "2023-09-30 07:26:00",
    "type": "free_ship" //free_ship | amount
}
```

**Response:**

```
{
    "statusCode": 201,
    "status": "created",
    "message": "Tạo voucher thành công",
    "data": null,
    "metadata": {}
}
```

### Get user vouchers (Authentication)

```
http://localhost:8084/api/v1/vouchers
```

**Method:** GET
<br>
**Query params**:

```
page={page}
itemsOfPage={itemsOfPage}
Example: http://localhost:8084/api/v1/vouchers?page=1&itemsOfPage=10 //Get 10 items of page 1
```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success",
    "data": [
        {
            "_id": "652c7f7ab81bc4625081c7e9",
            "discount": 50,
            "min_order_quantity": 1,
            "min_order_amount": 0,
            "type": "free_ship",
            "status": true,
            "user": "650d3f4f421ed24dc41454bb",
            "code": "LETHINHVOUCHER2",
            "description": "Voucher 2",
            "expired_date": "2023-09-30T00:26:00.000Z",
            "createdAt": "2023-10-16T00:10:34.906Z",
            "updatedAt": "2023-10-16T00:10:34.906Z",
            "__v": 0
        }
    ],
    "metadata": {
        "page": 1,
        "limit": 10,
        "userId": "650d3f4f421ed24dc41454bb",
        "results": 1
    }
}
```

## Products

### Create new product (Authentication - Admin role only)

```
http://localhost:8084/api/v1/products
```

**Method:** POST
<br>
**Request body**:

```
    {
        "parentProductId": null,
        "productName": "Áo Thun Supima Cotton Cổ Tròn Ngắn Tay" ,
        "productColor": "650eb01246193f4ddcf7862c",
        "productSizes": [{
            "size_type": "650ea84a828567aff85ca68f"
        },
        {
            "size_type": "650ea87a828567aff85ca690"
        }, {
            "size_type": "650ea88a828567aff85ca691"
        }, {
            "size_type": "650ea893828567aff85ca692"
        }, {
            "size_type": "650ea8a4828567aff85ca693"
        }, {
            "size_type": "650ea8ae828567aff85ca694"
        }
        ],
        "productCategories": ["650ebe49baa58c5aece0d7ed", "650ebeb5baa58c5aece0d7ef"],
        "productImages": [
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/455365/item/vngoods_00_455365.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/455365/sub/vngoods_455365_sub7.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455365/sub/goods_455365_sub13.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455365/sub/goods_455365_sub14.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/455365/sub/goods_455365_sub17.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/455365/sub/vngoods_455365_sub23.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/455365/sub/vngoods_455365_sub24.jpg?width=750"
        ],
        "productGender": "men",
        "productOriginalPrice": 391000,
        "productDescription": "100% bông SUPIMA® với kết cấu cao cấp. Được thiết kế tỉ mỉ đến từng chi tiết."
    }
```

**Response:**

```
{
    "statusCode": 201,
    "status": "created",
    "message": "Tạo sản phẩm thành công",
    "data": null,
    "metadata": {}
}
```

### Get detail product

```
http://localhost:8084/api/v1/products/:productId
```

**Method:** GET
<br>
**Query params**:

```

```

**Response:**

```
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success",
    "data": {
        "_id": "65118dbdeb6baf6ff0fa1756",
        "product_categories": [
            {
                "_id": "650ebe49baa58c5aece0d7ed",
                "status": true,
                "product_category_name": "Áo",
                "product_category_keyword": "tops",
                "createdAt": "2023-09-23T10:30:33.702Z",
                "updatedAt": "2023-09-23T10:30:33.702Z",
                "__v": 0,
                "product_category_gender": "unisex"
            },
            {
                "_id": "650ebeb5baa58c5aece0d7ef",
                "status": true,
                "product_category_parent_id": "650ebe49baa58c5aece0d7ed",
                "product_category_name": "Áo Thun",
                "product_category_keyword": "t-shirts",
                "createdAt": "2023-09-23T10:32:21.726Z",
                "updatedAt": "2023-09-23T10:32:21.726Z",
                "__v": 0,
                "product_category_gender": "unisex"
            }
        ],
        "product_images": [
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_00_422992.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub13.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub14.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub17.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub18.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub19.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub28.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub29.jpg?width=750",
            "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub30.jpg?width=750"
        ],
        "product_gender": "men",
        "product_original_price": 293000,
        "status": true,
        "product_name": "Áo Thun Cổ Tròn Ngắn Tay",
        "product_color": {
            "_id": "650eb01246193f4ddcf7862c",
            "status": true,
            "product_color_name": "Trắng",
            "product_color_code": "#fff",
            "createdAt": "2023-09-23T09:29:54.327Z",
            "updatedAt": "2023-09-23T09:29:54.327Z",
            "__v": 0
        },
        "product_sizes": [
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa1757",
                "size_type": {
                    "_id": "650ea84a828567aff85ca68f",
                    "product_size_name": "XS"
                }
            },
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa1758",
                "size_type": {
                    "_id": "650ea87a828567aff85ca690",
                    "product_size_name": "S"
                }
            },
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa1759",
                "size_type": {
                    "_id": "650ea88a828567aff85ca691",
                    "product_size_name": "M"
                }
            },
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa175a",
                "size_type": {
                    "_id": "650ea893828567aff85ca692",
                    "product_size_name": "L"
                }
            },
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa175b",
                "size_type": {
                    "_id": "650ea8a4828567aff85ca693",
                    "product_size_name": "XL"
                }
            },
            {
                "size_quantities": 1,
                "_id": "65118dbdeb6baf6ff0fa175c",
                "size_type": {
                    "_id": "650ea8ae828567aff85ca694",
                    "product_size_name": "XXL"
                }
            }
        ],
        "product_description": [
            {
                "_id": "652c9eb051cbb30f7002b089",
                "type": "overview",
                "content": "Áo thun cổ tròn đơn giản bằng vải jersey dày dặn.- Vải jersey khô được dệt chặt có độ bền cao và vẫn giữ chất lượng cao sau mỗi lần giặt. - Thiết kế cổ tròn có dây buộc lấy cảm hứng từ đường viền cổ áo thun quân đội cổ điển. - Dây buộc giúp cổ áo giữ được hình dạng.- Kiểu dáng rộng rãi phù hợp với cả nam và nữ."
            }
        ],
        "createdAt": "2023-09-25T13:40:13.757Z",
        "updatedAt": "2023-10-16T02:23:44.761Z",
        "__v": 0,
        "child_products": [
            {
                "_id": "65118ec85700f56d346034e7",
                "product_categories": [
                    {
                        "_id": "650ebe49baa58c5aece0d7ed",
                        "status": true,
                        "product_category_name": "Áo",
                        "product_category_keyword": "tops",
                        "createdAt": "2023-09-23T10:30:33.702Z",
                        "updatedAt": "2023-09-23T10:30:33.702Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    },
                    {
                        "_id": "650ebeb5baa58c5aece0d7ef",
                        "status": true,
                        "product_category_parent_id": "650ebe49baa58c5aece0d7ed",
                        "product_category_name": "Áo Thun",
                        "product_category_keyword": "t-shirts",
                        "createdAt": "2023-09-23T10:32:21.726Z",
                        "updatedAt": "2023-09-23T10:32:21.726Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    }
                ],
                "product_images": [
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_07_422992.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub13.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub14.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub17.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub18.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub19.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub28.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub29.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub30.jpg?width=750"
                ],
                "product_gender": "men",
                "product_original_price": 293000,
                "status": true,
                "parent_product_id": "65118dbdeb6baf6ff0fa1756",
                "product_name": "Áo Thun Cổ Tròn Ngắn Tay",
                "product_color": {
                    "_id": "650eb0d6b30a24284036ead1",
                    "status": true,
                    "product_color_name": "Xám",
                    "product_color_code": "#dedede",
                    "createdAt": "2023-09-23T09:33:10.260Z",
                    "updatedAt": "2023-09-23T09:33:10.260Z",
                    "__v": 0
                },
                "product_sizes": [
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034e8",
                        "size_type": {
                            "_id": "650ea84a828567aff85ca68f",
                            "product_size_name": "XS"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034e9",
                        "size_type": {
                            "_id": "650ea87a828567aff85ca690",
                            "product_size_name": "S"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034ea",
                        "size_type": {
                            "_id": "650ea88a828567aff85ca691",
                            "product_size_name": "M"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034eb",
                        "size_type": {
                            "_id": "650ea893828567aff85ca692",
                            "product_size_name": "L"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034ec",
                        "size_type": {
                            "_id": "650ea8a4828567aff85ca693",
                            "product_size_name": "XL"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118ec85700f56d346034ed",
                        "size_type": {
                            "_id": "650ea8ae828567aff85ca694",
                            "product_size_name": "XXL"
                        }
                    }
                ],
                "product_description": [
                    {
                        "_id": "652c9eb051cbb30f7002b08b",
                        "type": "overview",
                        "content": "Áo thun cổ tròn đơn giản bằng vải jersey dày dặn.- Vải jersey khô được dệt chặt có độ bền cao và vẫn giữ chất lượng cao sau mỗi lần giặt. - Thiết kế cổ tròn có dây buộc lấy cảm hứng từ đường viền cổ áo thun quân đội cổ điển. - Dây buộc giúp cổ áo giữ được hình dạng.- Kiểu dáng rộng rãi phù hợp với cả nam và nữ."
                    }
                ],
                "createdAt": "2023-09-25T13:44:40.055Z",
                "updatedAt": "2023-10-16T02:23:44.822Z",
                "__v": 0
            },
            {
                "_id": "65118f075700f56d346034ef",
                "product_categories": [
                    {
                        "_id": "650ebe49baa58c5aece0d7ed",
                        "status": true,
                        "product_category_name": "Áo",
                        "product_category_keyword": "tops",
                        "createdAt": "2023-09-23T10:30:33.702Z",
                        "updatedAt": "2023-09-23T10:30:33.702Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    },
                    {
                        "_id": "650ebeb5baa58c5aece0d7ef",
                        "status": true,
                        "product_category_parent_id": "650ebe49baa58c5aece0d7ed",
                        "product_category_name": "Áo Thun",
                        "product_category_keyword": "t-shirts",
                        "createdAt": "2023-09-23T10:32:21.726Z",
                        "updatedAt": "2023-09-23T10:32:21.726Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    }
                ],
                "product_images": [
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_09_422992.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub13.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub14.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub17.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub18.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub19.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub28.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub29.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub30.jpg?width=750"
                ],
                "product_gender": "men",
                "product_original_price": 293000,
                "status": true,
                "parent_product_id": "65118dbdeb6baf6ff0fa1756",
                "product_name": "Áo Thun Cổ Tròn Ngắn Tay",
                "product_color": {
                    "_id": "650eb0e8b30a24284036ead7",
                    "status": true,
                    "product_color_name": "Đen",
                    "product_color_code": "#3d3d3d",
                    "createdAt": "2023-09-23T09:33:28.915Z",
                    "updatedAt": "2023-09-23T09:33:28.915Z",
                    "__v": 0
                },
                "product_sizes": [
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f0",
                        "size_type": {
                            "_id": "650ea84a828567aff85ca68f",
                            "product_size_name": "XS"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f1",
                        "size_type": {
                            "_id": "650ea87a828567aff85ca690",
                            "product_size_name": "S"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f2",
                        "size_type": {
                            "_id": "650ea88a828567aff85ca691",
                            "product_size_name": "M"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f3",
                        "size_type": {
                            "_id": "650ea893828567aff85ca692",
                            "product_size_name": "L"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f4",
                        "size_type": {
                            "_id": "650ea8a4828567aff85ca693",
                            "product_size_name": "XL"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f075700f56d346034f5",
                        "size_type": {
                            "_id": "650ea8ae828567aff85ca694",
                            "product_size_name": "XXL"
                        }
                    }
                ],
                "product_description": [
                    {
                        "_id": "652c9eb051cbb30f7002b08d",
                        "type": "overview",
                        "content": "Áo thun cổ tròn đơn giản bằng vải jersey dày dặn.- Vải jersey khô được dệt chặt có độ bền cao và vẫn giữ chất lượng cao sau mỗi lần giặt. - Thiết kế cổ tròn có dây buộc lấy cảm hứng từ đường viền cổ áo thun quân đội cổ điển. - Dây buộc giúp cổ áo giữ được hình dạng.- Kiểu dáng rộng rãi phù hợp với cả nam và nữ."
                    }
                ],
                "createdAt": "2023-09-25T13:45:43.585Z",
                "updatedAt": "2023-10-16T02:23:44.868Z",
                "__v": 0
            },
            {
                "_id": "65118f205700f56d346034f7",
                "product_categories": [
                    {
                        "_id": "650ebe49baa58c5aece0d7ed",
                        "status": true,
                        "product_category_name": "Áo",
                        "product_category_keyword": "tops",
                        "createdAt": "2023-09-23T10:30:33.702Z",
                        "updatedAt": "2023-09-23T10:30:33.702Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    },
                    {
                        "_id": "650ebeb5baa58c5aece0d7ef",
                        "status": true,
                        "product_category_parent_id": "650ebe49baa58c5aece0d7ed",
                        "product_category_name": "Áo Thun",
                        "product_category_keyword": "t-shirts",
                        "createdAt": "2023-09-23T10:32:21.726Z",
                        "updatedAt": "2023-09-23T10:32:21.726Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    }
                ],
                "product_images": [
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_13_422992.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub13.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub14.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub17.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub18.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub19.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub28.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub29.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub30.jpg?width=750"
                ],
                "product_gender": "men",
                "product_original_price": 293000,
                "status": true,
                "parent_product_id": "65118dbdeb6baf6ff0fa1756",
                "product_name": "Áo Thun Cổ Tròn Ngắn Tay",
                "product_color": {
                    "_id": "650eb110b30a24284036eadb",
                    "status": true,
                    "product_color_name": "Đỏ",
                    "product_color_code": "#eb3417",
                    "createdAt": "2023-09-23T09:34:08.925Z",
                    "updatedAt": "2023-09-23T09:34:08.925Z",
                    "__v": 0
                },
                "product_sizes": [
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034f8",
                        "size_type": {
                            "_id": "650ea84a828567aff85ca68f",
                            "product_size_name": "XS"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034f9",
                        "size_type": {
                            "_id": "650ea87a828567aff85ca690",
                            "product_size_name": "S"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034fa",
                        "size_type": {
                            "_id": "650ea88a828567aff85ca691",
                            "product_size_name": "M"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034fb",
                        "size_type": {
                            "_id": "650ea893828567aff85ca692",
                            "product_size_name": "L"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034fc",
                        "size_type": {
                            "_id": "650ea8a4828567aff85ca693",
                            "product_size_name": "XL"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f205700f56d346034fd",
                        "size_type": {
                            "_id": "650ea8ae828567aff85ca694",
                            "product_size_name": "XXL"
                        }
                    }
                ],
                "product_description": [
                    {
                        "_id": "652c9eb051cbb30f7002b08f",
                        "type": "overview",
                        "content": "Áo thun cổ tròn đơn giản bằng vải jersey dày dặn.- Vải jersey khô được dệt chặt có độ bền cao và vẫn giữ chất lượng cao sau mỗi lần giặt. - Thiết kế cổ tròn có dây buộc lấy cảm hứng từ đường viền cổ áo thun quân đội cổ điển. - Dây buộc giúp cổ áo giữ được hình dạng.- Kiểu dáng rộng rãi phù hợp với cả nam và nữ."
                    }
                ],
                "createdAt": "2023-09-25T13:46:08.421Z",
                "updatedAt": "2023-10-16T02:23:44.932Z",
                "__v": 0
            },
            {
                "_id": "65118f365700f56d346034ff",
                "product_categories": [
                    {
                        "_id": "650ebe49baa58c5aece0d7ed",
                        "status": true,
                        "product_category_name": "Áo",
                        "product_category_keyword": "tops",
                        "createdAt": "2023-09-23T10:30:33.702Z",
                        "updatedAt": "2023-09-23T10:30:33.702Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    },
                    {
                        "_id": "650ebeb5baa58c5aece0d7ef",
                        "status": true,
                        "product_category_parent_id": "650ebe49baa58c5aece0d7ed",
                        "product_category_name": "Áo Thun",
                        "product_category_keyword": "t-shirts",
                        "createdAt": "2023-09-23T10:32:21.726Z",
                        "updatedAt": "2023-09-23T10:32:21.726Z",
                        "__v": 0,
                        "product_category_gender": "unisex"
                    }
                ],
                "product_images": [
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/item/vngoods_22_422992.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub13.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub14.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub17.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub18.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422992/sub/goods_422992_sub19.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub28.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub29.jpg?width=750",
                    "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/422992/sub/vngoods_422992_sub30.jpg?width=750"
                ],
                "product_gender": "men",
                "product_original_price": 293000,
                "status": true,
                "parent_product_id": "65118dbdeb6baf6ff0fa1756",
                "product_name": "Áo Thun Cổ Tròn Ngắn Tay",
                "product_color": {
                    "_id": "650eb11db30a24284036eadd",
                    "status": true,
                    "product_color_name": "Cam",
                    "product_color_code": "#f3a72c",
                    "createdAt": "2023-09-23T09:34:21.838Z",
                    "updatedAt": "2023-09-23T09:34:21.838Z",
                    "__v": 0
                },
                "product_sizes": [
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603500",
                        "size_type": {
                            "_id": "650ea84a828567aff85ca68f",
                            "product_size_name": "XS"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603501",
                        "size_type": {
                            "_id": "650ea87a828567aff85ca690",
                            "product_size_name": "S"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603502",
                        "size_type": {
                            "_id": "650ea88a828567aff85ca691",
                            "product_size_name": "M"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603503",
                        "size_type": {
                            "_id": "650ea893828567aff85ca692",
                            "product_size_name": "L"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603504",
                        "size_type": {
                            "_id": "650ea8a4828567aff85ca693",
                            "product_size_name": "XL"
                        }
                    },
                    {
                        "size_quantities": 1,
                        "_id": "65118f365700f56d34603505",
                        "size_type": {
                            "_id": "650ea8ae828567aff85ca694",
                            "product_size_name": "XXL"
                        }
                    }
                ],
                "product_description": [
                    {
                        "_id": "652c9eb051cbb30f7002b091",
                        "type": "overview",
                        "content": "Áo thun cổ tròn đơn giản bằng vải jersey dày dặn.- Vải jersey khô được dệt chặt có độ bền cao và vẫn giữ chất lượng cao sau mỗi lần giặt. - Thiết kế cổ tròn có dây buộc lấy cảm hứng từ đường viền cổ áo thun quân đội cổ điển. - Dây buộc giúp cổ áo giữ được hình dạng.- Kiểu dáng rộng rãi phù hợp với cả nam và nữ."
                    }
                ],
                "createdAt": "2023-09-25T13:46:30.931Z",
                "updatedAt": "2023-10-16T02:23:44.974Z",
                "__v": 0
            }
        ]
    },
    "metadata": {}
}
```

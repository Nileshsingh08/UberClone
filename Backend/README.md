# UberClone Backend API Documentation

## Endpoints

### 1. User Registration

#### Endpoint: `POST /users/register`

#### Description

This endpoint allows new users to register for the UberClone application. It validates the input data, hashes the password, and stores the user in the database. Upon successful registration, it returns an authentication token.

---

#### Request Body

The request must include the following JSON data:

```json
{
  "fullname": {
    "firstname": "string (required, minimum 3 characters)",
    "lastname": "string (optional)"
  },
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Request Example

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Response Status Codes

| Status Code | Description                                  |
| ----------- | -------------------------------------------- |
| **201**     | User registered successfully                 |
| **400**     | Validation error (missing or invalid fields) |
| **500**     | Server error                                 |

---

#### Success Response (201)

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketid": null
  },
  "token": "jwt_token_here"
}
```

---

#### Validation Error Response (400)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "fullname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

#### Server Error Response (500)

```json
{
  "message": "Error message describing what went wrong"
}
```

---

#### Field Validation Rules

| Field                | Type   | Required | Validation                         |
| -------------------- | ------ | -------- | ---------------------------------- |
| `fullname.firstname` | String | Yes      | Minimum 3 characters               |
| `fullname.lastname`  | String | No       | None                               |
| `email`              | String | Yes      | Valid email format, must be unique |
| `password`           | String | Yes      | Minimum 6 characters               |

---

#### Notes

- Passwords are hashed using bcrypt before storage
- Email addresses must be unique in the database
- A JWT authentication token is returned upon successful registration
- All fields are case-sensitive

---

### 2. User Login

#### Endpoint: `POST /users/login`

#### Description

This endpoint allows registered users to log in to the UberClone application. It validates the email and password, compares them against stored credentials, and returns an authentication token if valid.

---

#### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email format)",
  "password": "string (required)"
}
```

#### Request Example

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Response Status Codes

| Status Code | Description                                  |
| ----------- | -------------------------------------------- |
| **200**     | Login successful                             |
| **400**     | Validation error (missing or invalid fields) |
| **401**     | User not found or invalid credentials        |
| **500**     | Server error                                 |

---

#### Success Response (200)

```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketid": null
  },
  "token": "jwt_token_here"
}
```

---

#### Validation Error Response (400)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

#### User Not Found / Invalid Credentials Response (401)

```json
{
  "message": "User not found"
}
```

OR

```json
{
  "message": "Invalid credentials"
}
```

---

#### Server Error Response (500)

```json
{
  "message": "Error message describing what went wrong"
}
```

---

#### Field Validation Rules

| Field      | Type   | Required | Validation                     |
| ---------- | ------ | -------- | ------------------------------ |
| `email`    | String | Yes      | Valid email format             |
| `password` | String | Yes      | Must match registered password |

---

#### Notes

- Passwords are compared using bcrypt for security
- A JWT authentication token is returned upon successful login
- Email must be registered in the system
- Password comparison is case-sensitive
- Token can be used for authenticated requests

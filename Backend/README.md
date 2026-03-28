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

---

### 3. Get User Profile

#### Endpoint: `GET /users/profile`

#### Description

This endpoint retrieves the authenticated user's profile information. It requires a valid JWT authentication token and returns the user's details excluding the password field for security.

---

#### Authentication

This is a **protected endpoint**. You must provide a valid JWT token in one of the following ways:

1. **Cookie**: `token=your_jwt_token_here`
2. **Authorization Header**: `Bearer your_jwt_token_here`

---

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

OR use cookies:

```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Request Example

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer jwt_token_here"
```

---

#### Response Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| **200**     | Profile retrieved successfully          |
| **401**     | Unauthorized (missing or invalid token) |
| **500**     | Server error                            |

---

#### Success Response (200)

```json
{
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketid": null
  }
}
```

---

#### Unauthorized Response (401)

```json
{
  "message": "No token provided"
}
```

OR

```json
{
  "message": "Invalid token"
}
```

OR

```json
{
  "message": "User not found"
}
```

OR

```json
{
  "message": "Unauthorized"
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

#### Notes

- The password field is never returned for security reasons
- Token must be valid and not expired (24-hour expiration)
- Token must not be blacklisted (from logout)
- This endpoint requires the user to be authenticated

---

### 4. User Logout

#### Endpoint: `GET /users/logout`

#### Description

This endpoint logs out the authenticated user by blacklisting their JWT token and clearing the authentication cookie. After logout, the token can no longer be used for authenticated requests.

---

#### Authentication

This is a **protected endpoint**. You must provide a valid JWT token in one of the following ways:

1. **Cookie**: `token=your_jwt_token_here`
2. **Authorization Header**: `Bearer your_jwt_token_here`

---

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

OR use cookies:

```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Request Example

```bash
curl -X GET http://localhost:4000/users/logout \
  -H "Authorization: Bearer jwt_token_here"
```

---

#### Response Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| **200**     | Logout successful                       |
| **401**     | Unauthorized (missing or invalid token) |
| **500**     | Server error                            |

---

#### Success Response (200)

```json
{
  "message": "Logout successful"
}
```

---

#### Unauthorized Response (401)

```json
{
  "message": "No token provided"
}
```

OR

```json
{
  "message": "Invalid token"
}
```

OR

```json
{
  "message": "User not found"
}
```

OR

```json
{
  "message": "Unauthorized"
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

#### Notes

- The token is added to the blacklist with a 24-hour TTL (Time To Live)
- The authentication cookie is cleared from the client
- After logout, the token will be rejected for all authenticated requests
- Blacklisted tokens are automatically removed from the database after 24 hours
- Users can log out from multiple devices by calling this endpoint with each active token

---

### 5. Captain Registration

#### Endpoint: `POST /captains/register`

#### Description

This endpoint allows new captains to register for the UberClone application. It validates the input data, hashes the password, and stores the captain with vehicle information in the database. Upon successful registration, it returns an authentication token.

---

#### Request Body

The request must include the following JSON data:

```json
{
  "fullName": {
    "FirstName": "string (required, minimum 3 characters)",
    "LastName": "string (optional)"
  },
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)",
  "vehicle": {
    "color": "string (required, minimum 3 characters)",
    "plate": "string (required, must be unique)",
    "capacity": "number (required, minimum 1)",
    "vehicleType": "string (required, must be: 'car', 'bike', or 'auto')"
  },
  "location": {
    "lat": "number (optional)",
    "long": "number (optional)"
  }
}
```

#### Request Example

```bash
curl -X POST http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": {
      "FirstName": "Raj",
      "LastName": "Kumar"
    },
    "email": "raj.kumar@uber.com",
    "password": "password123",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": 28.7041,
      "long": 77.1025
    }
  }'
```

---

#### Response Status Codes

| Status Code | Description                                  |
| ----------- | -------------------------------------------- |
| **201**     | Captain registered successfully              |
| **400**     | Validation error (missing or invalid fields) |
| **500**     | Server error                                 |

---

#### Success Response (201)

```json
{
  "message": "Captain registered successfully",
  "captain": {
    "_id": "captain_id",
    "fullName": {
      "FirstName": "Raj",
      "LastName": "Kumar"
    },
    "email": "raj.kumar@uber.com",
    "socketid": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": 28.7041,
      "long": 77.1025
    }
  },
  "token": "jwt_token_here"
}
```

---

#### Validation Error Response (400)

```json
{
  "error": "Captain with this email already exists"
}
```

OR

```json
{
  "error": "All fields are required"
}
```

OR

```json
{
  "error": "Captain with this plate already exists"
}
```

---

#### Server Error Response (500)

```json
{
  "error": "Error message describing what went wrong"
}
```

---

#### Field Validation Rules

| Field                 | Type   | Required | Validation                         |
| --------------------- | ------ | -------- | ---------------------------------- |
| `fullName.FirstName`  | String | Yes      | Minimum 3 characters               |
| `fullName.LastName`   | String | No       | None                               |
| `email`               | String | Yes      | Valid email format, must be unique |
| `password`            | String | Yes      | Minimum 6 characters               |
| `vehicle.color`       | String | Yes      | Minimum 3 characters               |
| `vehicle.plate`       | String | Yes      | Must be unique                     |
| `vehicle.capacity`    | Number | Yes      | Minimum 1                          |
| `vehicle.vehicleType` | String | Yes      | Must be 'car', 'bike', or 'auto'   |
| `location.lat`        | Number | No       | Valid latitude coordinate          |
| `location.long`       | Number | No       | Valid longitude coordinate         |

---

#### Notes

- Passwords are hashed using bcrypt before storage
- Email addresses must be unique in the database
- Vehicle plate numbers must be unique across all captains
- A JWT authentication token is returned upon successful registration
- The status field defaults to 'inactive' on registration
- All fields are case-sensitive
- Location coordinates are optional and can be updated later

---

### 6. Captain Login

#### Endpoint: `POST /captains/login`

#### Description

This endpoint allows registered captains to log in to the UberClone application. It validates the email and password, compares them against stored credentials, and returns an authentication token if valid.

---

#### Request Body

The request must include the following JSON data:

```json
{
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Request Example

```bash
curl -X POST http://localhost:4000/captains/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj.kumar@uber.com",
    "password": "password123"
  }'
```

---

#### Response Status Codes

| Status Code | Description                                  |
| ----------- | -------------------------------------------- |
| **200**     | Login successful                             |
| **400**     | Validation error (missing or invalid fields) |
| **401**     | Captain not found or invalid credentials     |
| **500**     | Server error                                 |

---

#### Success Response (200)

```json
{
  "message": "Login successful",
  "captain": {
    "_id": "captain_id",
    "fullName": {
      "FirstName": "Raj",
      "LastName": "Kumar"
    },
    "email": "raj.kumar@uber.com",
    "socketid": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": 28.7041,
      "long": 77.1025
    }
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
      "value": "invalid-email",
      "msg": "Please provide a valid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

#### Captain Not Found / Invalid Credentials Response (401)

```json
{
  "message": "Captain not found"
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
  "error": "Error message describing what went wrong"
}
```

---

#### Field Validation Rules

| Field      | Type   | Required | Validation           |
| ---------- | ------ | -------- | -------------------- |
| `email`    | String | Yes      | Valid email format   |
| `password` | String | Yes      | Minimum 6 characters |

---

#### Notes

- Passwords are compared using bcrypt for security
- A JWT authentication token is returned upon successful login
- Email must be registered in the system
- Password comparison is case-sensitive
- Token can be used for authenticated requests
- Token is also set as an HTTP cookie for convenience

---

### 7. Captain Profile

#### Endpoint: `GET /captains/profile`

#### Description

This endpoint retrieves the authenticated captain's profile information. It requires a valid JWT authentication token and returns the captain's details excluding the password field for security.

---

#### Authentication

This is a **protected endpoint**. You must provide a valid JWT token in one of the following ways:

1. **Cookie**: `token=your_jwt_token_here`
2. **Authorization Header**: `Bearer your_jwt_token_here`

---

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

OR use cookies:

```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Request Example

```bash
curl -X GET http://localhost:4000/captains/profile \
  -H "Authorization: Bearer jwt_token_here"
```

---

#### Response Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| **200**     | Profile retrieved successfully          |
| **401**     | Unauthorized (missing or invalid token) |
| **500**     | Server error                            |

---

#### Success Response (200)

```json
{
  "captain": {
    "_id": "captain_id",
    "fullName": {
      "FirstName": "Raj",
      "LastName": "Kumar"
    },
    "email": "raj.kumar@uber.com",
    "socketid": null,
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": 28.7041,
      "long": 77.1025
    }
  }
}
```

---

#### Unauthorized Response (401)

```json
{
  "message": "No token provided"
}
```

OR

```json
{
  "message": "Invalid token"
}
```

OR

```json
{
  "message": "Captain not found"
}
```

OR

```json
{
  "message": "Unauthorized"
}
```

---

#### Server Error Response (500)

```json
{
  "error": "Error message describing what went wrong"
}
```

---

#### Notes

- The password field is never returned for security reasons
- Token must be valid and not expired (24-hour expiration)
- Token must not be blacklisted (from logout)
- This endpoint requires the captain to be authenticated

---

### 8. Captain Logout

#### Endpoint: `GET /captains/logout`

#### Description

This endpoint logs out the authenticated captain by blacklisting their JWT token and clearing the authentication cookie. After logout, the token can no longer be used for authenticated requests.

---

#### Authentication

This is a **protected endpoint**. You must provide a valid JWT token in one of the following ways:

1. **Cookie**: `token=your_jwt_token_here`
2. **Authorization Header**: `Bearer your_jwt_token_here`

---

#### Request Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

OR use cookies:

```
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Request Example

```bash
curl -X GET http://localhost:4000/captains/logout \
  -H "Authorization: Bearer jwt_token_here"
```

---

#### Response Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| **200**     | Logout successful                       |
| **401**     | Unauthorized (missing or invalid token) |
| **500**     | Server error                            |

---

#### Success Response (200)

```json
{
  "message": "Logout successful"
}
```

---

#### Unauthorized Response (401)

```json
{
  "message": "No token provided"
}
```

OR

```json
{
  "message": "Invalid token"
}
```

OR

```json
{
  "message": "Captain not found"
}
```

OR

```json
{
  "message": "Unauthorized"
}
```

---

#### Server Error Response (500)

```json
{
  "error": "Error message describing what went wrong"
}
```

---

#### Notes

- The token is added to the blacklist with a 24-hour TTL (Time To Live)
- The authentication cookie is cleared from the client
- After logout, the token will be rejected for all authenticated requests
- Blacklisted tokens are automatically removed from the database after 24 hours
- Captains can log out from multiple devices by calling this endpoint with each active token

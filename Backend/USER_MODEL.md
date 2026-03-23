# User Model Documentation

## Model: User

#### Description

The User model represents a registered user in the UberClone application. It handles user data storage, password hashing, and authentication token generation.

---

## Schema Structure

```javascript
{
  fullname: {
    firstname: String,
    lastname: String
  },
  email: String,
  password: String,
  socketid: String
}
```

---

## Fields

| Field                | Type   | Required | Validation               | Description                                          |
| -------------------- | ------ | -------- | ------------------------ | ---------------------------------------------------- |
| `fullname.firstname` | String | Yes      | Min 3 characters         | User's first name                                    |
| `fullname.lastname`  | String | No       | None                     | User's last name                                     |
| `email`              | String | Yes      | Unique, Min 5 characters | User's email address (must be unique)                |
| `password`           | String | Yes      | None                     | Hashed password (not selected by default in queries) |
| `socketid`           | String | No       | None                     | Socket.io connection ID for real-time features       |

---

## Methods

### 1. `generateAuthToken()`

**Type:** Instance Method

**Description:** Generates a JWT authentication token for the user.

**Returns:** String (JWT Token)

**Usage:**

```javascript
const user = new User({ ... });
const token = user.generateAuthToken();
```

**Note:** Requires `JWT_SECRET_KEY` environment variable to be set.

---

### 2. `comparePassword(enteredPassword)`

**Type:** Instance Method

**Description:** Compares an entered password with the stored hashed password.

**Parameters:**

- `enteredPassword` (String): Plain text password to verify

**Returns:** Promise<Boolean>

**Usage:**

```javascript
const user = await User.findOne({ email });
const isPasswordCorrect = await user.comparePassword(enteredPassword);
```

---

### 3. `hashPassword(password)`

**Type:** Static Method

**Description:** Hashes a plain text password using bcrypt.

**Parameters:**

- `password` (String): Plain text password to hash

**Returns:** Promise<String> (Hashed password)

**Usage:**

```javascript
const hashedPassword = await User.hashPassword(plainPassword);
```

**Note:** Uses bcrypt with 10 salt rounds for security.

---

## Data Types

- **String:** Text data
- **Boolean:** True/False values
- **ObjectId:** MongoDB auto-generated unique identifier (assigned as `_id`)

---

## Indexes

- **email:** Unique index (prevents duplicate email registrations)

---

## Default Behavior

- **Password Selection:** The `password` field is not selected by default in query results for security. To include it, use `.select('+password')` in queries.
- **Timestamps:** The model includes MongoDB default timestamps (`createdAt`, `updatedAt`)

---

## Example Usage

### Creating a User

```javascript
const userService = require("../services/user.service");

const userData = {
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  password: hashedPassword,
};

const newUser = await userService.createUser(userData);
```

### Finding and Authenticating a User

```javascript
const user = await User.findOne({ email }).select("+password");
const isValid = await user.comparePassword(enteredPassword);

if (isValid) {
  const token = user.generateAuthToken();
}
```

### Generating Token After Login

```javascript
const user = await User.findById(userId);
const token = user.generateAuthToken();
res.json({ token });
```

---

## Security Notes

1. **Password Hashing:** Always hash passwords before storing using `User.hashPassword()`
2. **Select Password:** Use `.select('+password')` only when comparing passwords
3. **JWT Token:** Keep `JWT_SECRET_KEY` environment variable secure
4. **Email Uniqueness:** Database enforces unique email constraint
5. **Socket ID:** Used for real-time communication, updates when user connects

---

## Error Handling

| Error               | Cause                                  | Solution                                      |
| ------------------- | -------------------------------------- | --------------------------------------------- |
| ValidationError     | Missing required field or invalid data | Check firstname, email, password are provided |
| MongoError (E11000) | Duplicate email                        | Ensure email doesn't already exist            |
| JWT Error           | Missing JWT_SECRET_KEY                 | Set JWT_SECRET_KEY in .env file               |

---

## Related Files

- **Service:** `/services/user.service.js` - User business logic
- **Controller:** `/controllers/user.controller.js` - Request handling
- **Routes:** `/routes/user.routes.js` - Endpoint definitions

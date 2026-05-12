# API Documentation

> Generated from `dokument api service.pdf`

## Base URL

```txt
https://backend-api-services-291631508657.asia-southeast2.run.app
```

---

# Authentication

## Login

### POST `/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Response

```json
{
  "token": "jwt_token"
}
```

---

## Logout

### POST `/auth/logout`

### Headers

```http
Authorization: Bearer <token>
```

---

## Register User

### POST `/auth/register`

### Request Body

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "plateNumber": "string"
}
```

---

# Super Admin - Admin Management

## Create Admin

### POST `/superAdmin/admins`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

---

## Get All Admins

### GET `/superAdmin/admins`

### Headers

```http
Authorization: Bearer <token>
```

---

## Get Admin By ID

### GET `/superAdmin/admins/{adminId}`

### Headers

```http
Authorization: Bearer <token>
```

---

## Update Admin

### PUT `/superAdmin/admins/{adminId}`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "string",
  "password": "string"
}
```

---

## Delete Admin

### DELETE `/superAdmin/admins/{adminId}`

### Headers

```http
Authorization: Bearer <token>
```

---

# User Management

## Get All Users

### GET `/users`

### Headers

```http
Authorization: Bearer <token>
```

---

## Get User By ID

### GET `/users/{userId}`

### Headers

```http
Authorization: Bearer <token>
```

---

## Delete User

### DELETE `/users/{userId}`

### Headers

```http
Authorization: Bearer <token>
```

---

# Profile

## Get Profile

### GET `/users/profile`

### Headers

```http
Authorization: Bearer <token>
```

---

## Update Profile

### PUT `/users/profile`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "string",
  "phoneNumber": "string"
}
```

---

## Upload Profile Photo

### POST `/users/profile/photo`

### Headers

```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Form Data

| Key   | Type |
| ----- | ---- |
| image | file |

---

# Vehicle Management

## Add Vehicle

### POST `/users/vehicles`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "plateNumber": "B 1234 XX",
  "vehicleType": "mobil"
}
```

---

## Delete Vehicle

### DELETE `/users/vehicles/{plateNumber}`

### Headers

```http
Authorization: Bearer <token>
```

---

# Parking Area Management

## Add Parking Area

### POST `/areas`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "string",
  "location": "string",
  "slot": 100
}
```

---

## Get All Parking Areas

### GET `/areas`

---

## Get Area By ID

### GET `/areas/{areaId}`

---

## Update Parking Area

### PUT `/areas/{areaId}`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "string",
  "location": "string"
}
```

---

## Delete Parking Area

### DELETE `/areas/{areaId}`

### Headers

```http
Authorization: Bearer <token>
```

---

# Parking Slot Management

## Add Parking Slot

### POST `/areas/slots`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "areaId": "string",
  "slotNumber": "A-01",
  "vehicleType": "mobil"
}
```

---

## Update Parking Slot

### PUT `/areas/slots/{slotId}`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "slotNumber": "A-01",
  "status": "available"
}
```

---

## Delete Parking Slot

### DELETE `/areas/slots/{slotId}`

### Headers

```http
Authorization: Bearer <token>
```

---

## Get Slot By ID

### GET `/areas/slots/{slotId}`

---

## Get All Slots In Area

### GET `/areas/{areaId}/slots`

---

# Access & Ticket

## Verify Ticket (User)

### POST `/access/verify`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "ticketId": "string"
}
```

---

## Active Ticket (User)

### GET `/access/activeTicket`

### Headers

```http
Authorization: Bearer <token>
```

---

## Cancel Ticket (User)

### POST `/access/cancelTicket`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "ticketId": "string"
}
```

---

# Guest Access

## Verify Ticket (Guest)

### POST `/access/verify`

### Request Body

```json
{
  "ticketId": "string"
}
```

---

## Active Ticket (Guest)

### GET `/access/activeTicket?guestSessionId={guestSessionId}`

---

## Cancel Ticket (Guest)

### POST `/access/cancelTicket`

### Request Body

```json
{
  "guestSessionId": "string"
}
```

---

# Guest Reservation (Normal Parking)

## Reservation Booking (Guest)

### POST `/reservations`

### Request Body

```json
{
  "slotId": "string",
  "ticketId": "string",
  "name": "string",
  "plateNumber": "string"
}
```

---

## Arrive In Slot (Guest)

### PATCH `/reservations/{reservationId}/arrive`

---

## Complete Park (Guest)

### PATCH `/reservations/{reservationId}/complete`

---

## Change Slot (Guest)

### PATCH `/reservations/{reservationId}/swap`

### Request Body

```json
{
  "newSlotId": "string"
}
```

---

## Cek Status Ticket (Guest)

### GET `/reservations/{reservationId}/status`

---

## Cancel Reservation (Guest)

### PATCH `/reservations/{reservationId}/cancel`

---

# System

## Download App

### GET `/system/app/download`

---

# Notes

* Semua endpoint protected menggunakan Bearer Token (Kecuali Guest & System).
* Beberapa struktur request/response disesuaikan dari screenshot Postman pada PDF dan screenshot terbaru.
* Role endpoint terdiri dari:

  * superAdmin
  * admin
  * user
  * guest


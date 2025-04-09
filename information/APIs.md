# API Endpoints & Controllers

For each model, you can design RESTful endpoints. Here’s an overview of some suggested endpoints:

## User Endpoints

POST /api/users/register
POST /api/users/login
POST /api/users/resend-verification-email
POST /api/users/forgot-password
POST /api/users/reset-password/:resetToken
GET /api/users/
GET /api/users/:username
GET /api/users/profile
PATCH /api/users/change-password
PATCH /api/users/edit - ONE PATCH FOR EVERY UPDATE EXCEPT PASSWORD
PATCH /api/users/upload-profile-picture
DELETE /api/users/delete
DELETE /api/users/remove-profile-picture

## Item Endpoints

POST /api/items – Create a new donation listing.
GET /api/items – Retrieve all available donation listings (with filtering by location or category).
GET /api/items/:id – Fetch a single donation item’s details.
PUT /api/items/:id – Update an item (donor may modify details if needed).
DELETE /api/items/:id – Remove a listing (if the donation is canceled).

## Donation Request Endpoints

POST /api/requests – Create a new donation request for an item. # This endpoint would verify that the requestor is not trying to request their own item.
GET /api/requests – Retrieve requests for the current user (depending on role: donor vs. receiver).
PUT /api/requests/:id – Update a donation request status (accept/reject).

When a donor accepts a request, you might trigger logic to initiate a chat.

## Chat Endpoints & Real-Time Integration

GET /api/chats/:chatID – Retrieve a specific chat thread.
POST /api/chats – Create a new chat (often triggered when a donation request is accepted).
POST /api/chats/:chatID/messages – Add a message to a chat thread.

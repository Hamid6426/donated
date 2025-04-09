# Data Flow & Relationships

User and Items
Relationship: Users (donors) create Items.

Flow:

A donor creates an item listing with all necessary details (title, category, photos, etc.).

The item document stores a reference (donor) to the User model.

Donation Requests
Relationship: Donation requests are linked to both Items and Requesters (Users).

Flow:

A receiver browses items and submits a request for one.

A request document gets created with references to both the item and the requester.

Optionally, if the donor accepts the request, the model may store a reference to a Chat document to track subsequent conversations.

Chat Interaction
Relationship: Chats provide a communication thread between the donor and requester.

Flow:

Upon acceptance of a donation request, a new Chat document is created with participants (donor and requester).

The Request document gets updated with the chat reference.

Through a chat endpoint and/or real-time system (like Socket.IO), the messages are exchanged and appended to the Chat model.

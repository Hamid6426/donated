// Example of how to call the refresh token route on the frontend
async function refreshAccessToken() {
  try {
    const response = await fetch("/refresh-token", {
      method: "POST",
      credentials: "include", // Important: to send cookies with the request
    });

    if (response.ok) {
      console.log("Access token refreshed successfully");
    } else {
      console.error("Failed to refresh access token");
    }
  } catch (err) {
    console.error("Error refreshing access token:", err);
  }
}

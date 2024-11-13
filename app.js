// Register form handler
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();  // Prevent the default form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  alert(result.message);  // Display the response message

  if (response.ok) {
    window.location.href = '/login';  // Redirect to login page after successful registration
  }
});
// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();  // Prevent the default form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    // If the server responds with HTML (like an error page or redirect), handle it
    if (!response.ok) {
      // If the response is not successful, check if it’s HTML or JSON
      const textResponse = await response.text();  // Get the raw response text
      if (textResponse.startsWith('<!DOCTYPE html>')) {
        console.error('Received HTML instead of JSON. This might be an error page.');
        // Handle HTML response, maybe redirect to an error page or show a message
      } else {
        const result = JSON.parse(textResponse);
        alert(result.message);  // Show error message if the response is JSON
      }
    } else {
      // If login is successful, redirect to the dashboard
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
});

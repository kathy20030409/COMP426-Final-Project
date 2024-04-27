async function registerUser() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    // Create a user object with username and password
    const user = {
        username: username,
        password: password
    };

    // try {
    // Send a POST request to the backend API endpoint
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) // Convert user object to JSON string
    }).then(function (res) {
        console.log(res);
        return res.json();
    }).then(function (res) {
        console.log('User registered successfully:', res);
    });
    // } catch (error) {
    //     // Handle any network or unexpected errors
    //     console.error('Error registering user:', error.message);
    // }
}

document.getElementById('registerForm').addEventListener('submit', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    // Call the registerUser function when the form is submitted
    registerUser();
});

// Function to handle user login
async function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in local storage
        alert('User logged in successfully!');
    } catch (error) {
        console.error('Error logging in user:', error);
        alert('Invalid username or password. Please try again.');
    }
}

// Function to handle user logout
function logoutUser() {
    localStorage.removeItem('token'); // Remove the token from local storage
    alert('User logged out successfully!');
}

// Function to submit user selection
async function submitSelection() {
    const selection = document.getElementById('userSelection').value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to submit your selection.');
        return;
    }

    try {
        const response = await fetch('/api/selections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token // Include the token in the request headers
            },
            body: JSON.stringify({ selection })
        });

        alert('Selection submitted successfully!');
    } catch (error) {
        console.error('Error submitting selection:', error);
        alert('An error occurred while submitting your selection. Please try again.');
    }
}
async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        const data = await response.json();
        console.log('User registered:', data);
        // Optionally, you can redirect the user to another page after successful registration
    } catch (error) {
        console.error('Registration failed:', error.message);
    }
}

// Function to log in a user
async function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        const data = await response.json();
        console.log('User logged in:', data);
        // Optionally, you can redirect the user to another page after successful login
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

// Function to add location to user's cart
async function addToCart(userId, location) {
    try {
        const response = await fetch(`/api/user/${userId}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTokenFromLocalStorage()}`
            },
            body: JSON.stringify({ location })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || data.error);
        }

        const data = await response.json();
        console.log('Location added to cart:', data);
        // Optionally, you can update the UI to reflect the changes
    } catch (error) {
        console.error('Failed to add location to cart:', error.message);
    }
}

// Function to retrieve user-specific selections
async function getUserSelections(userId) {
    try {
        const response = await fetch(`/api/user/${userId}/selections`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getTokenFromLocalStorage()}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || data.error);
        }

        const data = await response.json();
        console.log('User selections:', data);
        // Optionally, you can update the UI to display user selections
    } catch (error) {
        console.error('Failed to get user selections:', error.message);
    }
}

// Helper function to get token from local storage
function getTokenFromLocalStorage() {
    return localStorage.getItem('token');
}
// import { WeatherCard } from "./weather.mjs";

async function registerUser() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const user = {
        username: username,
        password: password
    };

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user) 
    }).then(function (res) {
        console.log(res);
        return res.json();
    }).then(function (res) {
        console.log('User registered successfully:', res);
        window.location.href= 'index.html';
    });
}

async function loginUser() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in local storage
        alert('User logged in successfully!');
        // need to send the more user info?
        window.location.href = `list.html?username=${data.username}`
    } catch (error) {
        console.error('Error logging in user:', error);
        alert('Invalid username or password. Please try again.');
    }
}


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
        const response = await fetch('http://localhost:3000/selections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ selection })
        });

        alert('Selection submitted successfully!');
    } catch (error) {
        console.error('Error submitting selection:', error);
        alert('An error occurred while submitting your selection. Please try again.');
    }
}

// Function to change user password
async function changePassword() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('newPassword').value;

    const response = await fetch(`http://localhost:3000/user/${userId}/account`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to get user's cart
async function getCart() {
    const userId = document.getElementById('userId').value;

    const response = await fetch(`http://localhost:3000/user/${userId}/cart`);
    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to add location to user's list
async function addLocation() {
    // const userId = idk, need to be given;

    // should populate with weather cards here?
    

    const response = await fetch(`http://localhost:3000/user/${userId}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location })
    });

    const data = await response.json();
    console.log(data);
    
    // Handle response data as needed
}

// Function to delete location from user's list
async function deleteLocation() {
    const userId = idk // need to be given
    const location = document.getElementById('userSelection').value;

    const response = await fetch(`http://localhost:3000/user/${userId}/cart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location })
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations in descending order
async function sortDesc() {
    const userId = document.getElementById('userId').value;

    const response = await fetch(`http://localhost:3000/user/${userId}/cart/order=desc`, {
        method: 'PUT'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations in ascending order
async function sortAsc() {
    const userId = document.getElementById('userId').value;

    const response = await fetch(`http://localhost:3000/user/${userId}/cart/order=asc`, {
        method: 'PUT'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}
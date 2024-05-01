async function registerUser() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const user = {
        username: username,
        password: password
    };
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
            credentials: 'include' // Ensure credentials are included if needed
        })
        // console.log(response.headers.getSetCookie());
        const data = await response.json();
        // document.getElementById('responseDiv').innerHTML = `<p>Success: ${data}</p>`;
        console.log(data);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
        }
        console.log('User registered successfully:', response);
        // do i need to carry over user/password info from url?
        window.location.href = 'index.html';
    }
    catch (error) {
        console.error('Error logging in user:', error);
        alert('Error: ' + error.message);
    }
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
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Ensure credentials are included if needed
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
        }
        // need to send the user info somehow?
        // this is throwing an invalid error :(
        window.location.href = "list.html"
        // let user = document.getE`lementById('user')
        // user.innerHTML = `${res.`body.username}`
    } catch (error) {
        console.error('Error logging in user:', error);
        alert('Error: ' + error.message);
    }
}


function logoutUser() {
    localStorage.removeItem('token'); // Remove the token from local storage
    alert('User logged out successfully!');
}

// Function to change user password
async function changePassword() {
    const password = document.getElementById('newPassword').value;
    const response = await fetch(`http://localhost:3000/user/account`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure credentials are included if needed
        body: JSON.stringify({ password: password })
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to get user's cart
async function getCart() {
    const response = await fetch(`http://localhost:3000/user/cart`, {
        method: "GET",
        credentials: 'include'
    });
    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to add location to user's cart
async function addLocation() {
    const location = document.getElementById('newLocation').value;
    const response = await fetch(`http://localhost:3000/user/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location }),
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to delete location from user's cart
async function deleteLocation() {
    const location = document.getElementById('deleteLocation').value;
    const response = await fetch(`http://localhost:3000/user/cart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location }),
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations by name in descending order
async function sortDesc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=desc`, {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations by name in ascending order
async function sortAsc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=asc`, {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations by temperature in descending order
async function sortDesc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=desc_temp`, {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations by temperature in ascending order
async function sortAsc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=asc_temp`, {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}
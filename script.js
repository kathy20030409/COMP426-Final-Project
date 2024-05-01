// import { WeatherCard } from "./weather.mjs";

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
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }
        localStorage.setItem('token', data.token);
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

// // Function to submit user selection
// async function submitSelection() {
//     const selection = document.getElementById('userSelection').value;
//     const token = localStorage.getItem('token');

//     if (!token) {
//         alert('Please log in to submit your selection.');
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:3000/selections', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': token
//             },
//             credentials: 'include', // Ensure credentials are included if needed
//             body: JSON.stringify({ selection})
//         });

//         alert('Selection submitted successfully!');
//     } catch (error) {
//         console.error('Error submitting selection:', error);
//         alert('An error occurred while submitting your selection. Please try again.');
//     }
// }

// Function to change user password
async function changePassword() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('newPassword').value;

    const response = await fetch(`http://localhost:3000/user/account`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure credentials are included if needed
        body: JSON.stringify({ password: password, token: localStorage.getItem('token') })
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to get user's cart
async function getCart() {
    // const userId = document.getElementById('userId').value;

    const response = await fetch(`http://localhost:3000/user/cart`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure credentials are included if needed
        body: JSON.stringify({ token: localStorage.getItem('token') })
    });
    const data = await response.json();
    console.log(data);
    renderCart(data);
}

async function addLocation() {
    const location = document.getElementById('selection').value;

    try {
        const response = await fetch(`http://localhost:3000/user/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ location: location, token: localStorage.getItem('token') }),
            credentials: 'include'
        });

        const data = await response.json();
        localStorage.setItem('cartData', JSON.stringify(data));
        // localStorage.removeItem('cartData');
        // localStorage.setItem('cartData', data);
        // renderCart(data);
    } catch (error) {
        console.error('Error adding location:', error);
        alert('Error: ' + error.message);
    }
}

function getAll() {
    var retrievedData = localStorage.getItem('cartData');
    // Since the data is stored as a JSON string, parse it to convert back to an object
    var cartData = JSON.parse(retrievedData);
    console.log(cartData);
    renderCart(cartData);
}

function renderCart(data) {
    const tableBody = document.querySelector("#cartTable tbody");
    tableBody.innerHTML = ''; // Clear previous content

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        const btnCell = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.addEventListener('click', () => handleAction(index));
        btnCell.appendChild(button);
        row.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.name}</td>
    <td>${item.weather}</td>
    <td>${item.temperature}</td>
    `;
        row.appendChild(btnCell);
        tableBody.appendChild(row);
    });
}

function handleAction(index) {
    let data = document.querySelector("#cartTable tbody");
    data.splice(index, 1);
    renderCart(data);
}

// Function to delete location from user's list
async function deleteLocation() {
    const userId = idk // need to be given
    const location = document.getElementById('userSelection').value;

    const response = await fetch(`http://localhost:3000/user/cart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: location, token: localStorage.getItem('token') }),
    });

    const data = await response.json();
    console.log(data);
    // Handle response data as needed
}

// Function to sort locations in descending order
async function sortDesc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=desc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token' : localStorage.getItem('token')
        },
        credentials: 'include' // Ensure credentials are included if needed
        // body: JSON.stringify({ token: localStorage.getItem('token') })
    });

    // console.log(JSON.stringify({token:localStorage.getItem('token')}))

    const data = await response.json();
    console.log(data);
    renderCart(data);
    // localStorage.setItem('cartDataDesc', JSON.stringify(data));
    // getAllDesc()
}

// Function to sort locations in ascending order
async function sortAsc() {
    const response = await fetch(`http://localhost:3000/user/cart/order=asc`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token' : localStorage.getItem('token')
        },
        credentials: 'include', // Ensure credentials are included if needed
    });

    const data = await response.json();
    console.log(data);
    renderCart(data);
}

async function sortDescTemp() {
    const response = await fetch(`http://localhost:3000/user/cart/order=desc_temp`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token' : localStorage.getItem('token')
        },
        credentials: 'include' // Ensure credentials are included if needed
    });

    console.log(JSON.stringify({token:localStorage.getItem('token')}))

    const data = await response.json();
    console.log(data);
    renderCart(data);
}

async function sortAscTemp() {
    const response = await fetch(`http://localhost:3000/user/cart/order=asc_temp`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'token' : localStorage.getItem('token')
        },
        credentials: 'include', // Ensure credentials are included if needed
    });

    const data = await response.json();
    console.log(data);
    renderCart(data);
}
let list = [];
async function registerUser() {
  const usernameInput = document.getElementById("regUsername");
  const passwordInput = document.getElementById("regPassword");

  const username = usernameInput.value;
  const password = passwordInput.value;

  const user = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }

    console.log("User registered successfully:", data);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error registering user:", error);
    alert("Error: " + error.message);
  }
}

async function loginUser() {
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);
    window.location.href = "list.html";
  } catch (error) {
    console.error("Error logging in user:", error);
    alert("Error: " + error.message);
  }
}

function logoutUser() {
  localStorage.removeItem("token");
  alert("User logged out successfully!");
}

// // Function to submit user selection
// async function submitSelection() {
//     const selection = document.getElementById('userSelection').value;
//     const token = localStorage.getItem('token');

//     if (!token) {
//         alert('Please log in to submit your selection.');
//         return;
//     }
async function changePassword() {
  const newPasswordInput = document.getElementById("newPassword");
  const newPassword = newPasswordInput.value;

  try {
    const response = await fetch(`http://localhost:3000/user/account`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        password: newPassword,
        token: localStorage.getItem("token"),
      }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error changing password:", error);
    alert("Error: " + error.message);
  }
}

async function getCart() {
  try {
    const response = await fetch(`http://localhost:3000/user/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token: localStorage.getItem("token") }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error getting cart:", error);
    alert("Error: " + error.message);
  }
}

async function addLocation() {
  const location = document.getElementById("selection").value;

  try {
    const response = await fetch(`http://localhost:3000/user/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: location,
        token: localStorage.getItem("token"),
      }),
      credentials: "include",
    });

    const data = await response.json();
    localStorage.setItem("cartData", JSON.stringify(data));
    // localStorage.removeItem('cartData');
    // localStorage.setItem('cartData', data);
    // renderCart(data);
  } catch (error) {
    console.error("Error adding location:", error);
    alert("Error: " + error.message);
  }
}

function getAll() {
  var retrievedData = localStorage.getItem("cartData");
  // Since the data is stored as a JSON string, parse it to convert back to an object
  var cartData = JSON.parse(retrievedData);
  console.log(cartData);
  renderCart(cartData);
}

/*
function renderCart(data) {
  const tableBody = document.querySelector("#cartTable tbody");
  tableBody.innerHTML = ''; // Clear previous content

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.weather}</td>
            <td>${item.temperature}</td>
        `;
    tableBody.appendChild(row);
  });
}
*/

function renderCart(data) {
  const tableBody = document.querySelector("#cartTable tbody");
  tableBody.innerHTML = ""; // Clear previous content

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    const btnCell = document.createElement("td");
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.addEventListener("click", async () => {
      var row = button.parentNode.parentNode;
      await deleteLocation(row.cells[1].textContent);
      getAll();
    });
    btnCell.appendChild(button);
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.weather}</td>
        <td>${item.temperature}</td>
    `;
    row.appendChild(btnCell);
    tableBody.appendChild(row);
  });
}

async function deleteLocation(location_id) {
  try {
    const response = await fetch(`http://localhost:3000/user/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location_id: location_id,
        token: localStorage.getItem("token"),
      }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to delete the cart");
    }

    const data = await response.json();
    localStorage.setItem("cartData", JSON.stringify(data));
  } catch (error) {
    console.error("Error deleting location:", error);
    alert("Error: " + error.message);
  }
}

async function sortDesc() {
  const response = await fetch(`http://localhost:3000/user/cart/order=desc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    credentials: "include", // Ensure credentials are included if needed
    // body: JSON.stringify({ token: localStorage.getItem('token') })
  });

  // console.log(JSON.stringify({token:localStorage.getItem('token')}))

  const data = await response.json();
  console.log(data);
  renderCart(data);
  // localStorage.setItem('cartDataDesc', JSON.stringify(data));
  // getAllDesc()
}

async function sortAsc() {
  const response = await fetch(`http://localhost:3000/user/cart/order=asc`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    credentials: "include", // Ensure credentials are included if needed
  });

  const data = await response.json();
  console.log(data);
  renderCart(data);
}

async function sortDescTemp() {
  const response = await fetch(
    `http://localhost:3000/user/cart/order=desc_temp`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      credentials: "include", // Ensure credentials are included if needed
    }
  );

  console.log(JSON.stringify({ token: localStorage.getItem("token") }));

  const data = await response.json();
  console.log(data);
  renderCart(data);
}

async function sortAscTemp() {
  const response = await fetch(
    `http://localhost:3000/user/cart/order=asc_temp`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      credentials: "include", // Ensure credentials are included if needed
    }
  );

  const data = await response.json();
  console.log(data);
  renderCart(data);
}

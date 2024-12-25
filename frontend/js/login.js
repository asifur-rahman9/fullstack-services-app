document.addEventListener("DOMContentLoaded", function () {
  const loginFormAdmin = document.getElementById("adminLoginForm");
  const loginFormClient = document.getElementById("clientLoginForm");

  if (loginFormAdmin != null) {
    console.log("Admin login form detected.");
    adminLogin();
  } else if (loginFormClient != null) {
    console.log("Client login form detected.");
    customerLogin();
  }
});

async function adminLogin() {
  const API_URL = "http://localhost:3000/api/admins/login";

  const adminLoginForm = document.getElementById("adminLoginForm");
  if (!adminLoginForm) return;

  adminLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert("Please provide a valid email address.");
      return;
    }

    const formData = {
      email,
      password,
      accountType: "admin",
    };

    console.log("Form data:", formData);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("Login result:", result);

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("adminID", result.id);
        window.location.href = "admin-dashboard.html";
      } else {
        alert(result.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

async function customerLogin() {
  const API_URL = "http://localhost:3000/api/customers/login";

  const clientLoginForm = document.getElementById("clientLoginForm");
  if (!clientLoginForm) return;
  clientLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      alert("Please provide a valid email address.");
      return;
    }

    const formData = {
      email,
      password,
      accountType: "customer",
    };

    console.log("Form data:", formData);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Login result:", result);

      if (response.ok) {
        alert("Login successful!");

        localStorage.setItem("customerID", result.id);
        console.log(result.id);
        window.location.href = "customer-dashboard.html";
      } else {
        alert(result.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

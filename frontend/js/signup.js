document.addEventListener("DOMContentLoaded", () => {
  const adminSignupForm = document.getElementById("signupFormAdmin");
  const customerSignupForm = document.getElementById("signupFormClient");

  if (adminSignupForm) {
    handleAdminSignup(adminSignupForm);
  } else if (customerSignupForm) {
    handleCustomerSignup(customerSignupForm);
  } else {
    console.error("No signup form detected on the page.");
  }
});

function handleAdminSignup(form) {
  const API_URL = "http://localhost:3000/api/admins";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const businessName = document
        .getElementById("business-name")
        ?.value.trim();
      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value.trim();

      if (!businessName || !name || !email || !password) {
        alert("Please fill in all required fields.");
        return;
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        alert("Please provide a valid email address.");
        return;
      }

      const payload = {
        accountType: "admin",
        businessName,
        name,
        email,
        password,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        window.location.href = "../html/admin-login.html";
      } else {
        console.error("Signup failed:", result);
        alert(`Signup failed: ${result.message || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      alert(`An error occurred: ${error.message}`);
    }
  });
}

function handleCustomerSignup(form) {
  const API_URL = "http://localhost:3000/api/customers";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const name = document.getElementById("name")?.value.trim();
      const address = document.getElementById("address")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value.trim();

      if (!name || !address || !email || !password) {
        alert("Please fill in all required fields.");
        return;
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        alert("Please provide a valid email address.");
        return;
      }

      const payload = {
        accountType: "customer",
        name,
        address,
        email,
        password,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(payload);

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        alert("Signup successful!");
        window.location.href = "../html/customer-login.html";
      } else {
        console.error("Signup failed:", result);
        alert(`Signup failed: ${result.message || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      alert(`An error occurred: ${error.message}`);
    }
  });
}

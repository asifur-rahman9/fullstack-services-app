document.addEventListener("DOMContentLoaded", function () {
  const adminLogoutContainer = document.querySelector(
    ".logout-container-admin"
  );
  const customerLogoutContainer = document.querySelector(
    ".logout-container-customer"
  );

  if (adminLogoutContainer) {
    setupAdminLogout();
  } else if (customerLogoutContainer) {
    setupCustomerLogout();
  }
});

function setupAdminLogout() {
  const logoutButton = document.querySelector(
    ".logout-container-admin .btn.logout"
  );
  const cancelButton = document.querySelector(
    ".logout-container-admin .btn.cancel"
  );

  if (!logoutButton || !cancelButton) {
    console.error("Logout or cancel button not found.");
    return;
  }

  logoutButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    const adminID = localStorage.getItem("adminID");
    console.log("Admin ID retrieved from localStorage:", adminID);

    if (!adminID) {
      alert("Admin not logged in!");
      console.error("No adminID found in localStorage.");
      return;
    }

    try {
      console.log("Sending logout request...");
      const response = await fetch(
        `http://localhost:3000/api/admins/${adminID}/logout`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: adminID }),
        }
      );

      console.log("Response received:", response);

      if (response.ok) {
        alert("Logout successful!");
        localStorage.removeItem("adminID");
        console.log("Admin ID removed from localStorage.");
        window.location.href = "../html/admin-login.html";
      } else {
        const result = await response.json();
        console.error("Logout failed. Server response:", result);
        alert(result.message || "Logout failed!");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      alert("Unable to connect to the server. Please try again later.");
    }
  });

  cancelButton.addEventListener("click", function () {
    console.log("Logout canceled by the user.");
    alert("Logout canceled. Returning to your dashboard.");
    window.location.href = "../html/admin-dashboard.html";
  });
}

function setupCustomerLogout() {
  const logoutButton = document.querySelector(
    ".logout-container-customer .btn.logout"
  );
  const cancelButton = document.querySelector(
    ".logout-container-customer .btn.cancel"
  );

  if (!logoutButton || !cancelButton) {
    console.error("Logout or cancel button not found for customer.");
    return;
  }

  logoutButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    const customerID = localStorage.getItem("customerID");
    console.log("Customer ID retrieved from localStorage:", customerID);

    if (!customerID) {
      alert("Customer not logged in!");
      console.error("No customerID found in localStorage.");
      return;
    }

    try {
      console.log("Sending customer logout request...");
      const response = await fetch(
        `http://localhost:3000/api/customers/${customerID}/logout`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: customerID }),
        }
      );

      console.log("Response received:", response);

      if (response.ok) {
        alert("Customer logged out successfully!");
        localStorage.removeItem("customerID");
        console.log("Customer ID removed from localStorage.");
        window.location.href = "../html/customer-login.html";
      } else {
        const result = await response.json();
        console.error("Logout failed. Server response:", result);
        alert(result.message || "Logout failed!");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      alert("Unable to connect to the server. Please try again later.");
    }
  });

  cancelButton.addEventListener("click", function () {
    console.log("Logout canceled by the user.");
    alert("Logout canceled. Returning to your dashboard.");
    window.location.href = "../html/customer-dashboard.html";
  });
}

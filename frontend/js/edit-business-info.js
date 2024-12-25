document.addEventListener("DOMContentLoaded", () => {
  const adminForm = document.querySelector(".business-info-form");
  if (adminForm) {
    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const adminID = localStorage.getItem("adminID");
      console.log(adminID);

      const businessName = document
        .getElementById("business-name")
        .value.trim();
      const newPassword = document.getElementById("new-password").value.trim();
      const newEmail = document.getElementById("new-email").value.trim();

      const adminData = {
        businessName: businessName,
        password: newPassword,
        email: newEmail,
      };

      console.log(adminData);

      try {
        const response = await fetch(
          `http://localhost:3000/api/admins/${adminID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(adminData),
          }
        );

        if (response.ok) {
          const result = await response.json();
          alert(result.message || "Admin information updated successfully!");
        } else {
          const error = await response.json();
          alert(error.message || "Failed to update admin information.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert(
          "An error occurred while connecting to the server. Please try again later."
        );
      }
    });
  }
});

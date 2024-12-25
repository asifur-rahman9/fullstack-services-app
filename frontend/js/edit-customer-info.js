document.addEventListener("DOMContentLoaded", () => {
  const customerForm = document.querySelector(".account-info-form");
  if (customerForm) {
    customerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const customerID = localStorage.getItem("customerID");
      console.log(customerID);
      const customerName = document
        .getElementById("customer-name")
        .value.trim();
      const customerEmail = document
        .getElementById("customer-email")
        .value.trim();
      const customerPassword =
        document.getElementById("customer-password").value;
      const customerAddress = document
        .getElementById("customer-address")
        .value.trim();
      const customerData = {
        name: customerName,
        email: customerEmail,
        password: customerPassword,
        address: customerAddress,
      };

      console.log(customerData);

      try {
        const response = await fetch(
          `http://localhost:3000/api/customers/${customerID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customerData),
          }
        );

        console.log(response);

        if (response.ok) {
          const result = await response.json();
          alert(result.message || "Customer information updated successfully!");
        } else {
          const error = await response.json();
          alert(error.message || "Failed to update customer information.");
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

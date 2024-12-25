document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_CUSTOMERS_URL = "http://localhost:3000/api/customers";
  const API_BASE_APPOINTMENTS_URL = "http://localhost:3000/api/appointments";
  const API_BASE_PAYMENTS_URL = "http://localhost:3000/api/receipts";

  try {
    const customerID = localStorage.getItem("customerID");

    if (!customerID) {
      alert("Customer ID not found. Redirecting to login.");
      window.location.href = "customer-login.html";
      return;
    }

    const customerResponse = await fetch(
      `${API_BASE_CUSTOMERS_URL}/${customerID}`
    );
    if (customerResponse.ok) {
      const customerResult = await customerResponse.json();
      const customer = customerResult.data;

      if (customer) {
        document.getElementById(
          "welcomeMessage"
        ).textContent = `Welcome, ${customer.name}`;

        await updateMetrics(
          customerID,
          API_BASE_APPOINTMENTS_URL,
          API_BASE_PAYMENTS_URL
        );
      } else {
        alert("Invalid session. Please log in.");
        window.location.href = "customer-login.html";
      }
    } else {
      alert("Failed to fetch customer details. Redirecting to login.");
      window.location.href = "customer-login.html";
    }
  } catch (error) {
    console.error("Error fetching customer details:", error);
    alert("An error occurred. Redirecting to login.");
    window.location.href = "customer-login.html";
  }
});

async function updateMetrics(
  customerID,
  API_BASE_APPOINTMENTS_URL,
  API_BASE_PAYMENTS_URL
) {
  try {
    const appointmentsResponse = await fetch(
      `${API_BASE_APPOINTMENTS_URL}/customer/${customerID}`
    );
    const paymentsResponse = await fetch(
      `${API_BASE_PAYMENTS_URL}/customer/${customerID}`
    );

    if (appointmentsResponse.ok && paymentsResponse.ok) {
      const appointmentsResult = await appointmentsResponse.json();
      const paymentsResult = await paymentsResponse.json();

      const appointments = appointmentsResult.data || [];
      const receipts = paymentsResult.data || [];

      const totalServices = appointments.length;
      const upcomingServices = appointments.filter(
        (app) => app.status === "ongoing"
      ).length;
      const cancelledBookings = appointments.filter(
        (app) => app.status === "cancelled"
      ).length;
      const outstandingPayments = receipts.reduce((total, receipt) => {
        return receipt.status === "unpaid"
          ? total + receipt.transactionAmount
          : total;
      }, 0);

      document.getElementById("totalServices").textContent = totalServices;
      document.getElementById("upcomingServices").textContent =
        upcomingServices;
      document.getElementById("cancelledBookings").textContent =
        cancelledBookings;
      document.getElementById(
        "outstandingPayments"
      ).textContent = `$${outstandingPayments.toFixed(2)}`;
    } else {
      console.error("Failed to fetch metrics data.");
      if (!appointmentsResponse.ok) {
        const error = await appointmentsResponse.json();
        console.error("Appointments error:", error.message || error);
      }
      if (!paymentsResponse.ok) {
        const error = await paymentsResponse.json();
        console.error("Payments error:", error.message || error);
      }
    }
  } catch (error) {
    console.error("Error while fetching metrics data:", error);

    document.getElementById("totalServices").textContent = "Error";
    document.getElementById("upcomingServices").textContent = "Error";
    document.getElementById("cancelledBookings").textContent = "Error";
    document.getElementById("outstandingPayments").textContent = "$0.00";
  }
}

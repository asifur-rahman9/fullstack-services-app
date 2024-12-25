document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_ADMINS_URL = "http://localhost:3000/api/admins";
  const API_BASE_APPOINTMENTS_URL = "http://localhost:3000/api/appointments";
  const API_BASE_SERVICES_URL = "http://localhost:3000/api/services";
  const API_BASE_RECEIPTS_URL = "http://localhost:3000/api/receipts";

  try {
    const adminID = localStorage.getItem("adminID");

    if (!adminID) {
      alert("Admin ID not found. Redirecting to login.");
      window.location.href = "admin-login.html";
      return;
    }

    const adminResponse = await fetch(`${API_BASE_ADMINS_URL}/${adminID}`);
    if (adminResponse.ok) {
      const adminResult = await adminResponse.json();
      const admin = adminResult.data;

      if (admin && admin.loggedIn) {
        document.querySelector(
          ".admin-overview h2"
        ).textContent = `Welcome, ${admin.name}`;

        await updateMetrics(
          adminID,
          API_BASE_APPOINTMENTS_URL,
          API_BASE_SERVICES_URL,
          API_BASE_RECEIPTS_URL
        );
      } else {
        alert("Invalid session. Please log in.");
        window.location.href = "admin-login.html";
      }
    } else {
      alert("Failed to fetch admin details. Redirecting to login.");
      window.location.href = "admin-login.html";
    }
  } catch (error) {
    console.error("Error fetching admin details:", error);
    alert("An error occurred. Redirecting to login.");
    window.location.href = "admin-login.html";
  }
});

async function updateMetrics(
  adminID,
  API_BASE_APPOINTMENTS_URL,
  API_BASE_SERVICES_URL,
  API_BASE_RECEIPTS_URL
) {
  try {
    const [appointmentsResponse, servicesResponse, receiptsResponse] =
      await Promise.all([
        fetch(`${API_BASE_APPOINTMENTS_URL}/admin/${adminID}`),
        fetch(`${API_BASE_SERVICES_URL}/admin/${adminID}`),
        fetch(`${API_BASE_RECEIPTS_URL}/adminDashboard/${adminID}`),
      ]);

    if (appointmentsResponse.ok && servicesResponse.ok && receiptsResponse.ok) {
      const appointmentsResult = await appointmentsResponse.json();
      const servicesResult = await servicesResponse.json();
      const receiptsResult = await receiptsResponse.json();

      const appointments = appointmentsResult.data || [];
      const services = servicesResult.data || [];
      const receipts = receiptsResult.data || [];

      const pendingAppointments = appointments.filter(
        (app) => app.status === "pending"
      ).length;
      const upcomingAppointments = appointments.filter(
        (app) => app.status === "ongoing"
      ).length;
      const completedAppointments = appointments.filter(
        (app) => app.status === "completed"
      ).length;
      const unpaidBills = receipts.reduce((total, receipt) => {
        return receipt.status === "unpaid"
          ? total + receipt.transactionAmount
          : total;
      }, 0);

      document.querySelector(".metric-item:nth-child(1) p strong").textContent =
        pendingAppointments;
      document.querySelector(".metric-item:nth-child(2) p strong").textContent =
        upcomingAppointments;
      document.querySelector(
        ".metric-item:nth-child(3) p strong"
      ).textContent = `$${unpaidBills.toFixed(2)}`;
      document.querySelector(".metric-item:nth-child(4) p strong").textContent =
        completedAppointments;
    } else {
      console.error("Failed to fetch metrics data.");
    }
  } catch (error) {
    console.error("Error while fetching metrics data:", error);
  }
}

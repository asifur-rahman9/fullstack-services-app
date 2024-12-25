const API_BASE_URL = "http://localhost:3000/api/services";
const API_APPOINTMENTS_URL = "http://localhost:3000/api/appointments";
const API_RECEIPTS_URL = "http://localhost:3000/api/receipts";

const servicesList = document.getElementById("servicesList");

const pendingServices = document.getElementById("pendingServices");
const upcomingServices = document.getElementById("upcomingServices");
const completedServices = document.getElementById("completedServices");
const cancelledBookings = document.getElementById("cancelledBookings");

const editAppointmentModal = document.getElementById("editAppointmentModal");
const editAppointmentForm = document.getElementById("editAppointmentForm");

document.addEventListener("DOMContentLoaded", () => {
  const customerID = localStorage.getItem("customerID");

  if (!customerID) {
    alert("Customer ID not found. Please log in.");
    return;
  }

  fetchAndDisplayAppointments(customerID);

  setupModalEventListeners();
});

async function fetchAndDisplayAppointments(customerID) {
  try {
    const response = await fetch(
      `${API_APPOINTMENTS_URL}/customer/${customerID}`
    );
    if (response.ok) {
      const result = await response.json();
      const appointments = result.data || [];
      clearAppointmentSections();
      appointments.forEach(appendAppointmentToSection);
    } else {
      const error = await response.json();
      console.error("Failed to fetch appointments:", error);
      alert(
        `Failed to fetch appointments: ${error.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error while fetching appointments:", error);
    alert("An error occurred while fetching appointments. Please try again.");
  }
}

function clearAppointmentSections() {
  [
    pendingServices,
    upcomingServices,
    completedServices,
    cancelledBookings,
  ].forEach((list) => (list.innerHTML = ""));
}

async function appendAppointmentToSection(appointment) {
  const appointmentRow = document.createElement("div");
  appointmentRow.classList.add("table-row");
  appointmentRow.dataset.id = appointment._id;

  switch (appointment.status) {
    case "pending":
      appointmentRow.innerHTML = `
      <span>${appointment.serviceID?.name || "N/A"}</span>
      <span>${appointment.serviceID?.description || "N/A"}</span>
      <span>${appointment.adminID?.businessName}</span>
      <span>${appointment.date.split("T")[0]}</span>
      <span>${appointment.time}</span>
    <span>
          <button class="edit-button">Edit</button>
          <button class="cancel-button">Cancel</button>
    </span>
  `;
      pendingServices.appendChild(appointmentRow);
      break;
    case "ongoing":
      appointmentRow.innerHTML = `
      <span>${appointment.serviceID?.name || "N/A"}</span>
      <span>${appointment.serviceID?.description || "N/A"}</span>
      <span>${appointment.adminID?.businessName}</span>
      <span>${appointment.date.split("T")[0]}</span>
      <span>${appointment.time}</span>
      <span>
            <button class="cancel-button">Cancel</button>
      </span>
    `;
      upcomingServices.appendChild(appointmentRow);
      break;
    case "completed":
      appointmentRow.innerHTML = `
      <span>${appointment.serviceID?.name || "N/A"}</span>
      <span>${appointment.serviceID?.description || "N/A"}</span>
      <span>${appointment.adminID?.businessName}</span>
      <span>${appointment.date.split("T")[0]}</span>
      <span>${appointment.time}</span>
    `;
      completedServices.appendChild(appointmentRow);

      break;
    case "cancelled":
      appointmentRow.innerHTML = `
      <span>${appointment.serviceID?.name || "N/A"}</span>
      <span>${appointment.serviceID?.description || "N/A"}</span>
      <span>${appointment.adminID?.businessName}</span>
      <span>${appointment.date.split("T")[0]}</span>
      <span>${appointment.time}</span>
    `;
      cancelledBookings.appendChild(appointmentRow);
      break;
    default:
      console.warn("Unknown appointment status:", appointment.status);
  }

  const cancelButton = appointmentRow.querySelector(".cancel-button");
  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      const confirmCancel = confirm(
        "Are you sure you want to cancel this appointment?"
      );
      if (confirmCancel) {
        cancelAppointment(appointment._id);
      }
    });
  }

  const editButton = appointmentRow.querySelector(".edit-button");
  if (editButton) {
    editButton.addEventListener("click", () => {
      openEditAppointmentModal(appointment);
    });
  }
}

async function createReceiptForCompletedAppointment(appointment) {
  try {
    const receiptCreatedKey = `receiptCreated_${appointment._id}`;

    if (localStorage.getItem(receiptCreatedKey)) {
      console.log("Receipt already created for this appointment.");
      return;
    }

    console.log("Creating receipt for completed appointment:", appointment);

    const receipt = {
      businessName: appointment.adminID?.businessName,
      businessEmail: appointment.adminID?.email,
      transactionAmount: appointment.serviceID?.price,
      transactionDate: new Date().toISOString(),
      customerName: appointment.customerID?.name,
      customerID: appointment.customerID?._id,
      status: "unpaid",
      adminID: appointment.adminID?._id,
    };

    console.log("Generated receipt:", receipt);

    const response = await fetch(API_RECEIPTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receipt),
    });

    if (response.ok) {
      console.log("Receipt created successfully!");
      alert("Appointment completed, and receipt created.");

      localStorage.setItem(receiptCreatedKey, true);
    } else {
      const errorData = await response.json();
      console.error("Failed to create receipt:", errorData);
      alert(
        `Failed to create receipt: ${errorData.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error while creating receipt:", error);
    alert("An error occurred while creating the receipt. Please try again.");
  }
}

async function cancelAppointment(appointmentID) {
  try {
    const response = await fetch(`${API_APPOINTMENTS_URL}/${appointmentID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    if (response.ok) {
      alert("Appointment cancelled successfully!");
      fetchAndDisplayAppointments(localStorage.getItem("customerID"));
    } else {
      const error = await response.json();
      console.error("Failed to cancel appointment:", error);
      alert(
        `Failed to cancel appointment: ${error.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error while canceling appointment:", error);
    alert(
      "An error occurred while canceling the appointment. Please try again."
    );
  }
}

function openEditAppointmentModal(appointment) {
  if (!editAppointmentModal || !editAppointmentForm) {
    console.error("Edit modal or form not found in the DOM");
    return;
  }

  document.getElementById("editAppointmentDate").value =
    appointment.date.split("T")[0];
  document.getElementById("editAppointmentTime").value = appointment.time;

  editAppointmentModal.style.display = "block";

  editAppointmentForm.onsubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      date: document.getElementById("editAppointmentDate").value,
      time: document.getElementById("editAppointmentTime").value.trim(),
    };

    if (!updatedData.date || !updatedData.time) {
      alert("Please fill in all fields.");
      return;
    }

    await updateAppointment(appointment._id, updatedData);

    closeEditAppointmentModal();
    fetchAndDisplayAppointments(localStorage.getItem("customerID"));
  };
}

function closeEditAppointmentModal() {
  if (!editAppointmentModal || !editAppointmentForm) {
    console.error("Edit modal or form not found in the DOM");
    return;
  }

  editAppointmentForm.reset();

  editAppointmentModal.style.display = "none";
}

async function updateAppointment(appointmentID, updatedData) {
  try {
    const response = await fetch(`${API_APPOINTMENTS_URL}/${appointmentID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      alert("Appointment updated successfully!");
    } else {
      const error = await response.json();
      console.error("Failed to update appointment:", error);
      alert(
        `Failed to update appointment: ${error.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error while updating appointment:", error);
    alert(
      "An error occurred while updating the appointment. Please try again."
    );
  }
}

function setupModalEventListeners() {
  document
    .getElementById("closeEditModalButton")
    .addEventListener("click", closeEditAppointmentModal);

  window.addEventListener("click", (event) => {
    if (event.target === editAppointmentModal) {
      closeEditAppointmentModal();
    }
  });
}

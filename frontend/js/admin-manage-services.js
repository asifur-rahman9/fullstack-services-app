const API_BASE_URL = "http://localhost:3000/api/services";
const API_APPOINTMENTS_URL = "http://localhost:3000/api/appointments";
const API_RECEIPTS_URL = "http://localhost:3000/api/receipts";

const servicesList = document.getElementById("servicesList");

const pendingRequestsList = document.getElementById("pendingRequestsList");
const upcomingServicesList = document.getElementById("upcomingServicesList");
const completedServicesList = document.getElementById("completedServicesList");
const cancelledServicesList = document.getElementById("cancelledServicesList");

const addServiceModal = document.getElementById("addServiceModal");
const editServiceModal = document.getElementById("editServiceModal");
const addServiceForm = document.getElementById("addServiceForm");
const editServiceForm = document.getElementById("editServiceForm");
const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const closeEditModalButton = document.getElementById("closeEditModalButton");

document.addEventListener("DOMContentLoaded", () => {
  const adminID = localStorage.getItem("adminID");

  if (!adminID) {
    alert("Admin ID not found. Please log in.");
    return;
  }

  displayOfferedServices(adminID);
  displayPendingAppointments(adminID);

  setupModalListeners();
});

async function displayOfferedServices(adminID) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/${adminID}`);
    if (response.ok) {
      const result = await response.json();
      servicesList.innerHTML = "";
      result.data.forEach(appendServiceToList);
    } else {
      console.error("Failed to fetch services.");
    }
  } catch (error) {
    console.error("Error while fetching services:", error);
  }
}

async function displayPendingAppointments(adminID) {
  try {
    const response = await fetch(`${API_APPOINTMENTS_URL}/admin/${adminID}`);
    if (response.ok) {
      const result = await response.json();
      const appointments = result.data || [];
      clearAppointmentsSections();
      appointments.forEach(appendAppointmentToSection);
    } else {
      console.error("Failed to fetch appointments.");
    }
  } catch (error) {
    console.error("Error while fetching appointments:", error);
  }
}

function clearAppointmentsSections() {
  [
    pendingRequestsList,
    upcomingServicesList,
    completedServicesList,
    cancelledServicesList,
  ].forEach((list) => (list.innerHTML = ""));
}

function appendAppointmentToSection(appointment) {
  const appointmentRow = document.createElement("div");
  appointmentRow.classList.add("table-row");

  const commonHTML = `
    <span>${appointment.serviceID?.name || "N/A"}</span>
    <span>${appointment.customerID?.name || "N/A"}</span>
    <span>${appointment.date.split("T")[0]}</span>
    <span>${appointment.time}</span>
  `;

  appointmentRow.innerHTML = commonHTML;

  let actionButtons = "";

  switch (appointment.status) {
    case "pending":
      actionButtons = `
        <button class="approve-button">Approve</button>
        <button class="cancel-button">Cancel</button>
      `;
      pendingRequestsList.appendChild(appointmentRow);
      break;
    case "ongoing":
      actionButtons = `
        <button class="complete-button">Complete</button>
        <button class="cancel-button">Cancel</button>
      `;
      upcomingServicesList.appendChild(appointmentRow);
      break;
    case "completed":
      completedServicesList.appendChild(appointmentRow);
      break;
    case "cancelled":
      cancelledServicesList.appendChild(appointmentRow);
      break;
  }

  if (actionButtons) {
    appointmentRow.innerHTML += `<span>${actionButtons}</span>`;
  }

  setupAppointmentActionListeners(appointmentRow, appointment);
}

function setupAppointmentActionListeners(appointmentRow, appointment) {
  const approveButton = appointmentRow.querySelector(".approve-button");
  const cancelButton = appointmentRow.querySelector(".cancel-button");
  const completeButton = appointmentRow.querySelector(".complete-button");

  if (approveButton) {
    approveButton.addEventListener("click", () =>
      updateAppointmentStatus(appointment._id, "ongoing")
    );
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () =>
      updateAppointmentStatus(appointment._id, "cancelled")
    );
  }

  if (completeButton) {
    completeButton.addEventListener("click", async () => {
      try {
        await updateAppointmentStatus(appointment._id, "completed");

        const response = await fetch(
          `${API_APPOINTMENTS_URL}/${appointment._id}`
        );

        if (!response.ok) {
          console.error("Error fetching appointment details");
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          const appointmentDetails = data.data;

          const newReceipt = {
            businessName: appointmentDetails.adminID.businessName,
            businessEmail: appointmentDetails.adminID.email,
            transactionAmount: appointmentDetails.serviceID.price,
            transactionDate: new Date().toISOString(),
            customerName: appointmentDetails.customerID.name,
            customerID: appointmentDetails.customerID._id,
            status: "unpaid",
            adminID: appointmentDetails.adminID._id,
          };

          console.log(newReceipt);

          const createReceiptResponse = await fetch(API_RECEIPTS_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReceipt),
          });

          if (createReceiptResponse.ok) {
            console.log("Receipt created successfully!");
            alert("Appointment marked as completed and receipt created.");
          } else {
            const errorData = await createReceiptResponse.json();
            console.error("Failed to create receipt:", errorData);
            alert(
              `Failed to create receipt: ${
                errorData.message || "Unknown error"
              }`
            );
          }
        }
      } catch (error) {
        console.error(
          "Error completing appointment and creating receipt:",
          error
        );
        alert(
          "An error occurred while completing the appointment. Please try again."
        );
      }
    });
  }
}

async function updateAppointmentStatus(appointmentID, status) {
  try {
    const response = await fetch(`${API_APPOINTMENTS_URL}/${appointmentID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      alert(`Appointment status updated to ${status}.`);
      displayPendingAppointments(localStorage.getItem("adminID"));
    } else {
      console.error("Failed to update appointment status.");
    }
  } catch (error) {
    console.error("Error while updating appointment status:", error);
  }
}

function appendServiceToList(service) {
  const serviceRow = document.createElement("div");
  serviceRow.classList.add("table-row");
  serviceRow.dataset.id = service._id;

  serviceRow.innerHTML = `
    <span>${service.name}</span>
    <span>${service.description}</span>
    <span>$${service.price}</span>
    <span>${service.category}</span>
    <span>
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </span>
  `;

  servicesList.appendChild(serviceRow);

  const editButton = serviceRow.querySelector(".edit-button");
  const deleteButton = serviceRow.querySelector(".delete-button");

  editButton.addEventListener("click", () => openEditModal(service));
  deleteButton.addEventListener("click", () => deleteService(service._id));
}

function openEditModal(service) {
  document.getElementById("editServiceName").value = service.name || "";
  document.getElementById("editServiceDescription").value =
    service.description || "";
  document.getElementById("editServicePrice").value = service.price || "";
  document.getElementById("editServiceCategory").value = service.category || "";

  editServiceModal.style.display = "block";

  editServiceForm.onsubmit = async (event) => {
    event.preventDefault();
    const updatedService = {
      name: document.getElementById("editServiceName").value.trim(),
      description: document
        .getElementById("editServiceDescription")
        .value.trim(),
      price: parseFloat(
        document.getElementById("editServicePrice").value.trim()
      ),
      category: document.getElementById("editServiceCategory").value.trim(),
    };

    await updateService(service._id, updatedService);

    editServiceModal.style.display = "none";
    editServiceForm.reset();
    displayOfferedServices(localStorage.getItem("adminID"));
  };
}

addServiceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newService = {
    name: document.getElementById("serviceName").value.trim(),
    description: document.getElementById("serviceDescription").value.trim(),
    price: parseFloat(document.getElementById("servicePrice").value.trim()),
    category: document.getElementById("serviceCategory").value.trim(),
    adminID: localStorage.getItem("adminID"),
  };

  await createService(newService);
  addServiceModal.style.display = "none";
  displayOfferedServices(localStorage.getItem("adminID"));
});

async function createService(service) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });

    if (response.ok) {
      console.log("Service added successfully.");
    } else {
      console.error("Failed to add service.");
    }
  } catch (error) {
    console.error("Error while adding service:", error);
  }
}

async function updateService(serviceID, updatedService) {
  try {
    const response = await fetch(`${API_BASE_URL}/${serviceID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedService),
    });

    if (response.ok) {
      console.log("Service updated successfully.");
    } else {
      console.error("Failed to update service.");
    }
  } catch (error) {
    console.error("Error while updating service:", error);
  }
}

async function deleteService(serviceID) {
  try {
    const response = await fetch(`${API_BASE_URL}/${serviceID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      displayOfferedServices(localStorage.getItem("adminID"));
    } else {
      console.error("Failed to delete service.");
    }
  } catch (error) {
    console.error("Error while deleting service:", error);
  }
}

function setupModalListeners() {
  openModalButton.addEventListener("click", () => {
    addServiceModal.style.display = "block";
    addServiceForm.reset();
  });

  closeModalButton.addEventListener("click", () => {
    addServiceModal.style.display = "none";
    addServiceForm.reset();
  });

  closeEditModalButton.addEventListener("click", () => {
    editServiceModal.style.display = "none";
    editServiceForm.reset();
  });

  window.addEventListener("click", (event) => {
    if (event.target === addServiceModal) {
      addServiceModal.style.display = "none";
      addServiceForm.reset();
    }

    if (event.target === editServiceModal) {
      editServiceModal.style.display = "none";
      editServiceForm.reset();
    }
  });
}

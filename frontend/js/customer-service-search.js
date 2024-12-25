document.addEventListener("DOMContentLoaded", () => {
  const serviceSearchInput = document.getElementById("serviceSearch");
  const servicesContainer = document.getElementById("servicesContainer");
  const appointmentModal = document.getElementById("appointmentModal");
  const closeAppointmentModal = document.getElementById(
    "closeAppointmentModal"
  );
  const appointmentForm = document.getElementById("appointmentForm");

  const SERVICES_API = "http://localhost:3000/api/services";
  const APPOINTMENTS_API = "http://localhost:3000/api/appointments";

  async function fetchServices() {
    try {
      const response = await fetch(SERVICES_API);
      if (!response.ok) throw new Error("Failed to fetch services");

      const { data: services } = await response.json();
      displayServices(services);
      setupSearch(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      servicesContainer.innerHTML = `<p>Unable to load services at the moment. Please try again later.</p>`;
    }
  }

  function displayServices(services) {
    servicesContainer.innerHTML = "";

    if (services.length === 0) {
      servicesContainer.innerHTML = `<p>No services available at the moment.</p>`;
      return;
    }

    services.forEach((service) => {
      console.log(service);
      const serviceBox = document.createElement("div");
      serviceBox.classList.add("box");
      serviceBox.setAttribute("data-service", service.name.toLowerCase());

      serviceBox.innerHTML = `
          <h2>${service.adminID.businessName || "Unknown Business"}</h2>
          <h3>Service: ${service.name}</h3>
          <p>Description: ${service.description}</p>
          <p class="price">Price: $${service.price.toFixed(2)}</p>
          <button class="book-service" data-service-id="${
            service._id
          }" data-service-name="${service.name}">
            Book Service
          </button>
        `;

      servicesContainer.appendChild(serviceBox);
    });

    setupBookServiceButtons();
  }

  function setupSearch(services) {
    serviceSearchInput.addEventListener("keyup", () => {
      const query = serviceSearchInput.value.toLowerCase();
      const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(query)
      );
      displayServices(filteredServices);
    });
  }

  function setupBookServiceButtons() {
    const bookServiceButtons = document.querySelectorAll(".book-service");
    bookServiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const serviceId = button.getAttribute("data-service-id");
        const serviceName = button.getAttribute("data-service-name");
        openAppointmentModal(serviceId, serviceName);
      });
    });
  }

  function openAppointmentModal(serviceId, serviceName) {
    appointmentModal.style.display = "block";
    appointmentForm.dataset.serviceId = serviceId;
    document.getElementById(
      "appointmentFormTitle"
    ).innerText = `Book Appointment for ${serviceName}`;
  }

  closeAppointmentModal.addEventListener("click", () => {
    closeModal();
  });

  window.addEventListener("click", (event) => {
    if (event.target === appointmentModal) {
      closeModal();
    }
  });

  function closeModal() {
    appointmentModal.style.display = "none";
    appointmentForm.reset();
  }

  appointmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const serviceID = appointmentForm.dataset.serviceId;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    const customerID = localStorage.getItem("customerID");

    if (!serviceID || !date || !time || !customerID) {
      alert("Please ensure all required fields are filled out.");
      return;
    }

    const appointmentData = { serviceID, date, time, customerID };

    try {
      const response = await fetch(APPOINTMENTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to book the appointment");

      const result = await response.json();
      alert(result.message || "Appointment booked successfully!");
      closeModal();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(
        "An error occurred while booking the appointment. Please try again."
      );
    }
  });

  fetchServices();
});

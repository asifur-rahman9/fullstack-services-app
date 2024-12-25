document.addEventListener("DOMContentLoaded", async () => {
  console.log("JavaScript loaded and running.");

  const adminID = localStorage.getItem("adminID");
  console.log("Retrieved adminID:", adminID);

  try {
    console.log(`Fetching receipts for adminID: ${adminID}`);
    const response = await fetch(
      `http://localhost:3000/api/receipts/admin/${adminID}`
    );
    console.log("API response:", response);
    console.log("response in json fomrat is");
    console.log(response.json);
    const { data } = await response.json();
    console.log("data is");
    console.log(data);

    const unpaidSection = document.querySelector(".unpaid-billing-list");
    const paidSection = document.querySelector(".paid-billing-list");

    unpaidSection.innerHTML = "<h2>Unpaid Bills</h2>";
    data.unpaid.forEach((bill) => {
      const billHTML = `
      <div class="bill-item">
        <h3>Bill #${bill._id}</h3>
        <p><strong>Amount:</strong> $${bill.transactionAmount.toFixed(2)}</p>
        <p><strong>Date:</strong> ${new Date(
          bill.transactionDate
        ).toLocaleDateString()}</p>
        <button class="btn pay-button" data-id="${
          bill._id
        }">Mark as Paid</button>
      </div>`;
      unpaidSection.innerHTML += billHTML;
    });

    paidSection.innerHTML = "<h2>Paid Bills</h2>";
    data.paid.forEach((bill) => {
      const billHTML = `
      <div class="bill-item">
        <h3>Bill #${bill._id}</h3>
        <p><strong>Amount:</strong> $${bill.transactionAmount.toFixed(2)}</p>
        <p><strong>Date:</strong> ${new Date(
          bill.transactionDate
        ).toLocaleDateString()}</p>
        <span class="paid-label">PAID</span>
      </div>`;
      paidSection.innerHTML += billHTML;
    });

    document.querySelectorAll(".pay-button").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const receiptID = e.target.dataset.id;
        const response = await fetch(
          `http://localhost:3000/api/receipts/${receiptID}/mark-as-paid`,
          {
            method: "PATCH",
          }
        );

        const data = await response.json();
        if (data.success) {
          const billItem = e.target.closest(".bill-item");
          paidSection.innerHTML += billItem.outerHTML;
          unpaidSection.removeChild(billItem);
        } else {
          alert("Error marking receipt as paid.");
        }
      });
    });
  } catch (err) {
    console.error("Error fetching receipts:", err);
  }
});

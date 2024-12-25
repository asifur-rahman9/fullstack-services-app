document.addEventListener("DOMContentLoaded", async () => {
  console.log("JavaScript loaded and running.");

  const customerID = localStorage.getItem("customerID");
  console.log("Retrieved customerID:", customerID);

  try {
    const response = await fetch(
      `http://localhost:3000/api/receipts/customer/${customerID}`
    );
    const { data } = await response.json();
    console.log("Fetched data:", data);

    const billTableBody = document.getElementById("bill-table-body");
    if (!billTableBody) {
      console.error("Could not find an element with id 'bill-table-body'.");
      return;
    }

    billTableBody.innerHTML = "";

    data.forEach((receipt) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${receipt.businessName}</td>
                <td>$${receipt.transactionAmount.toFixed(2)}</td>
                <td>${new Date(
                  receipt.transactionDate
                ).toLocaleDateString()}</td>
                <td>${receipt.status.toUpperCase()}</td>
                <td class="text-end">
                    <button class="view-details-btn" data-receipt='${JSON.stringify(
                      receipt
                    )}'>View Details</button>
                </td>
            `;

      billTableBody.appendChild(row);
    });

    document.querySelectorAll(".view-details-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const receipt = JSON.parse(event.target.dataset.receipt);
        showReceiptPopup(receipt);
      });
    });
  } catch (err) {
    console.error("Error fetching receipts:", err);
  }
});

function showReceiptPopup(receipt) {
  const newWindow = window.open("", "_blank", "width=600,height=800");

  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Official Receipt</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                padding: 30px;
                margin: 0;
            }
            .receipt-container {
                max-width: 700px;
                margin: 0 auto;
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .receipt-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #ccc;
                padding-bottom: 15px;
            }
            .receipt-header h1 {
                font-size: 28px;
                color: #333;
            }
            .receipt-header p {
                font-size: 14px;
                color: #888;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: left;
            }
            th {
                background-color: #f8f8f8;
            }
            .receipt-footer {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                color: #666;
            }
            .button {
                background-color: #007BFF;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            }
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="receipt-header">
                <h1>Official Receipt</h1>
                <p>Thank you for your business!</p>
            </div>
            <table>
                <tr>
                    <th>Business Name</th>
                    <td>${receipt.businessName}</td>
                </tr>
                <tr>
                    <th>Amount</th>
                    <td>$${receipt.transactionAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Date</th>
                    <td>${new Date(
                      receipt.transactionDate
                    ).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>${receipt.status.toUpperCase()}</td>
                </tr>
            </table>
            <div class="receipt-footer">
                <button class="button" onclick="window.close()">Close</button>
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `);

  newWindow.document.close();
}

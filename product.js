document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const brandName = urlParams.get("brand");
    const productName = urlParams.get("product");

    // Update page heading
    const titleElement = document.getElementById("page-title");
    if (titleElement) {
        titleElement.textContent = `${productName} (${brandName})`;
    }

    // Google Sheet CSV link
    const sheetUrl = "YOUR_GOOGLE_SHEET_CSV_LINK"; // <-- Replace with your sheet's CSV export link

    fetch(sheetUrl)
        .then(response => response.text())
        .then(data => {
            const rows = Papa.parse(data, { header: true }).data;
            const tableBody = document.getElementById("product-table-body");

            // Filter by brand AND product
            const filteredRows = rows.filter(row =>
                row.brand?.trim() === brandName &&
                row.product?.trim() === productName
            );

            if (filteredRows.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3">No products found for ${productName}</td></tr>`;
                return;
            }

            filteredRows.forEach(row => {
                const tr = document.createElement("tr");

                // Adjust these fields based on your sheet's headers
                tr.innerHTML = `
                    <td>${row.brand || ""}</td>
                    <td>${row.product || ""}</td>
                    <td>${row.size || ""}</td>
                `;

                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });

    // Search filter
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", function () {
            const filter = searchInput.value.toLowerCase();
            const trs = document.querySelectorAll("#product-table-body tr");

            trs.forEach(tr => {
                const text = tr.textContent.toLowerCase();
                tr.style.display = text.includes(filter) ? "" : "none";
            });
        });
    }
});

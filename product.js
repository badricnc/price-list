// product.js - Debug version
console.log("✅ product.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded");

    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const product = params.get("product");

    console.log("🔍 URL Params:", { brand, product });

    if (!brand || !product) {
        console.error("❌ Missing brand or product in URL");
        document.body.innerHTML = "<h2>Error: Brand or Product not specified.</h2>";
        return;
    }

    document.getElementById("product-title").textContent = `${brand} - ${product}`;

    const tableBody = document.getElementById("product-table-body");
    const searchInput = document.getElementById("search");

    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4gOi3FoAsMGgM_3yQnfJwLAPVd0Uj-fo8qBXg9m2kWGp_AeKee_zmqb_XejPW4hs2OGAIPsccALkI/pub?output=csv";
    console.log("🌐 Fetching CSV from:", csvUrl);

    fetch(csvUrl)
        .then(response => {
            console.log("📡 Fetch status:", response.status);
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            console.log("📄 CSV Data length:", data.length);
            const rows = data.split("\n").map(row => row.split(",").map(cell => cell.trim()));
            console.log("🔍 Parsed CSV rows:", rows.length);

            const headers = rows[0];
            console.log("📋 CSV Headers:", headers);

            // Expected columns: Brand, Product, Size, Price
            const filteredRows = rows.filter((row, index) => {
                if (index === 0) return false; // skip header
                return row[0].toLowerCase() === brand.toLowerCase() &&
                       row[1].toLowerCase() === product.toLowerCase();
            });

            console.log(`✅ Filtered rows for ${brand} - ${product}:`, filteredRows);

            if (filteredRows.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="2">No data found for ${brand} - ${product}</td></tr>`;
                return;
            }

            filteredRows.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${row[2]}</td><td>${row[3]}</td>`;
                tableBody.appendChild(tr);
            });

            // Search filter
            searchInput.addEventListener("input", () => {
                const searchValue = searchInput.value.toLowerCase();
                const rows = tableBody.querySelectorAll("tr");
                rows.forEach(row => {
                    const size = row.cells[0].textContent.toLowerCase();
                    row.style.display = size.includes(searchValue) ? "" : "none";
                });
            });
        })
        .catch(error => {
            console.error("❌ Fetch error:", error);
            document.body.innerHTML = "<h2>Error loading product data.</h2>";
        });
});

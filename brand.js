const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4gOi3FoAsMGgM_3yQnfJwLAPVd0Uj-fo8qBXg9m2kWGp_AeKee_zmqb_XejPW4hs2OGAIPsccALkI/pub?output=csv";

// Get brand from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const brandName = urlParams.get("brand");

document.getElementById("brandTitle").textContent = brandName ? `${brandName} Products` : "Products";

fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").map(row => row.split(","));
        const headers = rows.shift(); // First row is header

        const brandProducts = rows.filter(row => row[0].trim().toLowerCase() === brandName.trim().toLowerCase());

        const container = document.getElementById("productCards");
        if (brandProducts.length === 0) {
            container.innerHTML = `<p>No products found for ${brandName}</p>`;
            return;
        }

        brandProducts.forEach(product => {
            const productName = product[1];
            const imagePlaceholder = "https://via.placeholder.com/150";

            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <img src="${imagePlaceholder}" alt="${productName}">
                <h3>${productName}</h3>
                <button onclick="viewProduct('${brandName}', '${productName}')">View Details</button>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => console.error("Error loading data:", error));

function viewProduct(brand, product) {
    window.location.href = `product.html?brand=${encodeURIComponent(brand)}&product=${encodeURIComponent(product)}`;

    card.addEventListener("click", () => {
    window.location.href = `product.html?brand=${encodeURIComponent(brandName)}&product=${encodeURIComponent(item.name)}`;
});

}

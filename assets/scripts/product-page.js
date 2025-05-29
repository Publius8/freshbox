window.addEventListener("DOMContentLoaded", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const params = new URLSearchParams(window.location.search);
    const titleFromUrl = params.get("title");

    if (!product && !titleFromUrl) return;

    // title
    if (titleFromUrl) {
        document.title = decodeURIComponent(titleFromUrl) + " | FreshBox";
    } else if (product?.title) {
        document.title = product.title + " | FreshBox";
    }

    // show the product
    if (product) {
        document.getElementById("put_name_here").textContent = product.title;
        document.getElementById("put_price_here").textContent = `${product.price} AZN`;

        if (product.description) {
            document.getElementById("put_description_here").textContent = product.description;
        }

        if (product.category_name) {
            document.getElementById("add_category_here").textContent = product.category_name;
        }

        const img = document.querySelector(".product-image-box img");
        img.src = `https://api.fresback.squanta.az/uploads/product/${product.image}`;
        img.alt = product.title;
    }
});

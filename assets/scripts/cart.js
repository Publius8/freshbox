document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(".purchases-list");

  let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
    return;
  }

  cart.forEach(product => {
    const productHTML = `
<div class="cart-item" data-id="${product.id}">
  <img src="https://api.fresback.squanta.az/uploads/product/${product.image}" alt="${product.title}">
  <div class="product-info">
    <h4>${product.title}</h4>
    <p>Qiymət: ${product.price} man</p>
    ${product.weight ? `<p>${product.weight} kg</p>` : ''}
    ${product.liter ? `<p>${product.liter} l</p>` : ''}
    ${product.cartQuantity ? `<p>Miqdar: ${product.cartQuantity} ədəd</p>` : ''}
  </div>
  <button class="remove-btn" data-id="${product.id}">Sil</button>
</div>

    `;
    cartContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  // Удаление товара из корзины
  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const id = e.target.getAttribute("data-id");
      let updatedCart = cart.filter(p => p.id != id);
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      e.target.closest(".cart-item").remove();

      if (updatedCart.length === 0) {
        cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
      }
    }
  });
});


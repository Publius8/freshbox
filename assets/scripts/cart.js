document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.querySelector(".purchases-list");
  const totalEl = document.getElementById("put_total_here");

  let cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

  // Функция для пересчета общей суммы
  function calculateTotal(cartArray) {
    const total = cartArray.reduce((sum, product) => {
      const quantity = product.cartQuantity || 1;
      return sum + (product.price * quantity);
    }, 0);

    totalEl.textContent = `${total.toFixed(2)} AZN`;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
    totalEl.textContent = "0 AZN";
    return;
  }

  cart.forEach(product => {
    const productHTML = `
<div class="cart-item" data-id="${product.id}">
  <img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title}">

  <div class="product-info">
    <div class="info-column">
      <h4>${product.title}</h4>
      ${product.weight ? `<p>${product.weight} kg</p>` : product.liter ? `<p>${product.liter} l</p>` : ''}
    </div>

    <div class="info-column">
      ${product.cartQuantity ? `<p>Miqdar</p><p class="price">${product.cartQuantity} ədəd</p>` : ''}
    </div>

    <div class="info-column">
      <p>Qiymət</p>
      <p class="price">${product.price} man</p>
    </div>

    <div class="info-column">
      <button class="remove-btn" data-id="${product.id}">Sil</button>
    </div>
  </div>
</div>

    `;
    cartContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  // Считаем сумму при загрузке
  calculateTotal(cart);

  // Удаление товара из корзины
  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const id = e.target.getAttribute("data-id");
      let updatedCart = cart.filter(p => p.id != id);
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      e.target.closest(".cart-item").remove();

      // Обновляем локальную переменную
      cart = updatedCart;

      if (updatedCart.length === 0) {
        cartContainer.innerHTML = "<p>Səbət boşdur.</p>";
        totalEl.textContent = "0 AZN";
      } else {
        calculateTotal(updatedCart);
      }
    }
  });
});

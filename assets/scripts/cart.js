document.addEventListener('DOMContentLoaded', () => {
  const addToCartForm = document.getElementById('add-to-cart-form');
  const quantityInput = document.getElementById('numberInput');
  const productNameEl = document.getElementById('put_name_here');
  const productId = productNameEl?.dataset?.productId;
  const productTitle = productNameEl?.textContent.trim();
  const priceEl = document.getElementById('put_price_here');
  const productPrice = priceEl?.textContent.replace('AZN', '').trim();
  const description = document.getElementById('put_description_here')?.textContent.trim();
  const imageUrl = document.querySelector('.product-image-box img')?.getAttribute('src');
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    alert('İstifadəçi sistemə daxil olmayıb.');
    return;
  }

  if (addToCartForm) {
    addToCartForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const quantity = parseInt(quantityInput.value, 10);
      if (isNaN(quantity) || quantity < 1) {
        alert('Məhsul miqdarını düzgün daxil edin.');
        return;
      }

      const productData = {
        product_id: productId,
        quantity: quantity,
        user_id: userId,
        title: productTitle,
        price: productPrice,
        description: description,
        image_url: imageUrl
      };

      try {
        const response = await fetch('https://api.fresback.squanta.az/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          throw new Error('Səbətə əlavə edilərkən xəta baş verdi');
        }

        const result = await response.json();
        alert('Məhsul səbətə əlavə olundu!');
        await loadCart();
      } catch (error) {
        console.error(error);
        alert('Məhsul əlavə edilə bilmədi');
      }
    });
  }

  // + и - кнопки
  window.changeValue = function (delta) {
    const input = document.getElementById('numberInput');
    let current = parseInt(input.value, 10);
    if (isNaN(current)) current = 1;
    current += delta;
    if (current < 1) current = 1;
    input.value = current;
  };

  // только числа
  window.validateNumber = function (input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value === '' || parseInt(input.value, 10) < 1) {
      input.value = 1;
    }
  };

  // загрузка корзины
  async function loadCart() {
    try {
      const response = await fetch(`https://api.fresback.squanta.az/api/cart?user_id=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Cart loading failed');

      const cartData = await response.json();
      const purchasesList = document.querySelector('.purchases-list');
      const totalPriceElement = document.getElementById('put_total_here');

      purchasesList.innerHTML = '';

      if (!cartData.items || cartData.items.length === 0) {
        purchasesList.innerHTML = '<p>Empty</p>';
        totalPriceElement.textContent = '0 AZN';
        return;
      }

      purchasesList.innerHTML = `
        <div class="column-name">Məhsul</div>
        <div class="column-name">Miqdarı</div>
        <div class="column-name">Qiyməti</div>
        <div></div>
      `;

      cartData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <div class="image-name-weight">
            <div class="image-box">
              <img src="${item.image_url}" alt="${item.title}">
            </div>
            <div class="text-box">
              <h3>${item.title}</h3>
              <span>${item.weight ?? ''}</span>
            </div>
          </div>

          <div class="quatity-of-products">
            <form>
              <button type="button" onclick="changeValue(this, -1)">-</button>
              <input type="text" value="${item.quantity}" oninput="validateNumber(this)">
              <button type="button" onclick="changeValue(this, 1)">+</button>
            </form>
          </div>

          <div class="put_price_here">
            <span>${item.price} AZN</span>
          </div>

          <div class="edit-container">
            <button id="edit"><img src="./assets/img/Edit.svg" alt="editIcon"></button>
          </div>

          <div class="line-for-mobile"></div>
        `;

        purchasesList.appendChild(itemElement);
      });

      totalPriceElement.textContent = `${cartData.total_price} AZN`;
    } catch (error) {
      console.error(error);
      alert('Səbət yüklənərkən xəta baş verdi');
    }
  }

  loadCart();
});


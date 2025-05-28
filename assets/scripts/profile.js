async function fetchFavorites() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    console.log('Token və ya UserId localStorage-də yoxdur');
    return;
  }

  try {
    const favResponse = await fetch(`https://api.fresback.squanta.az/api/fave/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!favResponse.ok) {
      console.log('Sevimli məhsullar sorğusu uğursuz oldu:', favResponse.status);
      return;
    }

    const favoriteProducts = await favResponse.json();

    const favouritesBox = document.querySelector('.favourites-box');
    if (favouritesBox) {
      favouritesBox.innerHTML = favoriteProducts.map(item => `
        <div class="products-container" data-id="${item.id}">
          <div class="imgae-circle">
            <div class="image-container">
              <img style="width:20px" src="https://api.fresback.squanta.az/uploads/product/${item.image}" alt="${item.title}">
            </div>
            <div class="favourite-circle" data-id="${item.id}" style="cursor:pointer;">
              <img src="./assets/img/orangeHerz.svg" alt="fav-icon">
            </div>
          </div>
          <div class="name-weight">
            <h3>${item.title}</h3>
            <span class="stock-status">
              ${
                item.stock === 1
                  ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                       <path d="M7 13l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     Stokda var`
                  : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <circle cx="12" cy="12" r="10" fill="#F44336"/>
                       <path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                     Stokda yoxdur`
              }
            </span>
            <span>${item.quantity > 0 ? item.quantity + ' ədəd' : ''}</span>
            <span>${item.weight > 0 ? item.weight + " kg" : ""}</span>
            <span>${item.liter > 0 ? item.liter + " l" : ""}</span>
          </div>
          <div class="price">
            <span>${item.price} man</span>
          </div>
          <div>
            <button role="link" onclick="window.location.href='product-page.html';">İndi sifariş et</button>
          </div>
        </div>
      `).join('');

      // Silmə funksiyasını ürək ikonuna bağla
      document.querySelectorAll('.favourite-circle').forEach(favCircle => {
        favCircle.addEventListener('click', () => {
          const productId = favCircle.dataset.id;
          const productCardElement = favCircle.closest('.products-container');
          removeFavourite(productId, productCardElement);
        });
      });
    }

  } catch (error) {
    console.error('Xəta:', error);
  }
}

// Sevimlərdən silmək funksiyası:
async function removeFavourite(productId, productCardElement) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    alert("Zəhmət olmasa, əvvəlcə hesabınıza daxil olun");
    return;
  }

  try {
    const res = await fetch('https://api.fresback.squanta.az/api/fave/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId
      }),
    });

    if (!res.ok) throw new Error('Silinmə zamanı xəta baş verdi');

    // UI-dən məhsulu sil:
    if (productCardElement) {
      productCardElement.remove();
    }

    alert("Məhsul sevimlərdən silindi");

  } catch (err) {
    console.error("Sevimlərdən silmə xətası:", err);
    alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
  }
}

fetchFavorites();

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
        document.getElementById("put_name_here").textContent = `${product.title} ${product.weight > 0 ? '(' + product.weight + ' kq)' : ''}`;
        document.getElementById("put_price_here").textContent = `${product.price} AZN`;
        document.getElementById('add_category_here').textContent = `${product.category_title || product.category_name}`;
        if (product.description) {
            document.getElementById("put_description_here").textContent = product.description;
        }

        const img = document.querySelector(".product-image-box img");
        img.src = `https://api.fresback.squanta.az/uploads/product/${product.image}`;
        img.alt = product.title;

        if (product.category_title) {
            const catElem = document.getElementById("breadcrumb_category");
            if (catElem) catElem.textContent = product.category_title;
        }

        if (product.title) {
            const titleElem = document.getElementById("breadcrumb_title");
            if (titleElem) titleElem.textContent = product.title;
        }
    }
});


async function loadRecommendations() {
  const limit = 3; // neçə məhsul göstərmək istədiyini buradan təyin et
  const recommendation = document.getElementById('recommendation_box');
  if (!recommendation) return;

  recommendation.innerHTML = ''; // təmizləyirik

  try {
    const res = await fetch("https://api.fresback.squanta.az/api/product/all");
    const data = await res.json();

    // Random şəkildə "limit" sayda məhsul seç
    const recommended = data.sort(() => 0.5 - Math.random()).slice(0, limit);

    const html = recommended.map(product => {
      const discountedPrice = product.discount
        ? (product.price - (product.price * product.discount / 100)).toFixed(2)
        : null;

      return `
        <div class="card_recommendation" data-id="${product.id}">
          <div class="image-circle">
            <div class="image_box">
              <img src="https://api.fresback.squanta.az/uploads/product/${product.image}" alt="${product.title}">
            </div>
            <button style="cursor: pointer;">
              <div class="wish_list_circle">
                <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="heart-icon">
              </div>
            </button>
          </div>
          <div class="name-weight">
            <h3>${product.title}</h3>
            <span>${product.weight > 0 ? product.weight + ' kg' : ''}</span>
          </div>
          <div class="price">
            ${
              discountedPrice
                ? `
                  <span style="text-decoration: line-through; color: #888;">${product.price} man</span>
                  <span style="color: red; font-weight: bold; margin-left: 6px;">${discountedPrice} man</span>
                `
                : `<span>${product.price} man</span>`
            }
          </div>
          <div>
            <button role="link" onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>
          </div>
        </div>
      `;
    }).join('');

    recommendation.innerHTML = html;

  } catch (error) {
    console.error("Tövsiyə olunan məhsullar yüklənmədi:", error);
    recommendation.innerHTML = `<p>Xəta baş verdi. Məhsullar yüklənmədi.</p>`;
  }
}


loadRecommendations();


// async function addToFavourites(productId) {
//   const userId = localStorage.getItem('userId');
//   if (!userId) {
//     showToast("Zəhmət olmasa daxil olun", true);
//     return;
//   }

//   try {
//     const res = await fetch('https://api.fresback.squanta.az/api/fave/store', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // 'Authorization': `Bearer ${token}`, // если нужно
//       },
//       body: JSON.stringify({
//         user_id: userId,
//         product_id: productId
//       })
//     });

//     if (res.ok) {
//       showToast("Məhsul sevimlilərə əlavə edildi");
//       await getFavoritesByUser(userId);
//     } else {
//       const errorData = await res.json();
//       showToast(`Xəta: ${errorData.message || 'Əlavə etmək mümkün olmadı'}`, true);
//     }
//   } catch (error) {
//     console.error("Sevimlilərə əlavə edərkən xəta:", error);
//     showToast("Xəta baş verdi", true);
//   }
// }
// document.addEventListener("DOMContentLoaded", () => {
//   const favButton = document.getElementById("add_to_favourite");
//   if (favButton) {
//     favButton.addEventListener("click", () => {
//       const productNameEl = document.getElementById("put_name_here");
//       const productId = productNameEl?.dataset?.productId;
//       if (productId) {
//         addToFavourites(productId);
//       } else {
//         showToast("Məhsul tapılmadı", true);
//       }
//     });
//   }
// });

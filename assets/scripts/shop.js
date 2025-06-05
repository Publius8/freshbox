// URL-dən categoryTitle parametrini oxuyur
function getCategoryTitleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('categoryTitle');
}

// Toast mesaj göstərmək üçün funksiya
function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '10px 20px';
  toast.style.backgroundColor = isError ? 'red' : 'green';
  toast.style.color = 'white';
  toast.style.borderRadius = '5px';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Məhsulları göstərmək üçün funksiya
function displayProducts(products) {
  const container = document.getElementById('productList');
  container.innerHTML = ''; // təmizlə

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'products-card';
    productCard.dataset.id = product.id;
    productCard.dataset.fav = product.fav || '0';

   const discountedPrice = product.discount
  ? (product.price - (product.price * product.discount / 100)).toFixed(2)
  : null;

productCard.innerHTML = `
  <div class="imgae-circle">
    <div class="image-container">
      <img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title}">
    </div>
    <div class="favourite-circle" data-id="${product.id}" data-fav="${product.fav === 1 ? '1' : '0'}">
      <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="fav-icon">
    </div>
  </div>

  <div class="name-weight">
    <h3>${product.title}</h3>
    <span class="stock-status">
      ${
        product.stock === 1
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7 13l3 3 7-7" stroke="white" stroke-width="2"/></svg> Stokda var`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F44336"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/></svg> Stokda yoxdur`
      }
    </span>
    <span>${product.quantity > 0 ? product.quantity + ' ədəd' : ''}</span>
    <span>${product.weight > 0 ? product.weight + " kg" : ""}</span>
    <span>${product.liter > 0 ? product.liter + " l" : ""}</span>
  </div>

  <div class="price">
    ${
      discountedPrice
        ? `
          <span style="text-decoration: line-through; color: #999; margin-right: 6px;">${product.price} azn</span>
          <span style="color: red; font-weight: bold;">${discountedPrice} azn</span>
        `
        : `<span>${product.price} azn</span>`
    }
  </div>

  <div>
    <button role="link" onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>
  </div>
`;


    container.appendChild(productCard);
  });

  attachFavListeners();
}

// Məhsulları yüklə və seçilmiş kateqoriyaya görə filtr et
let selectedCategoryId = null;

async function loadProducts() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənə bilmədi');
    let products = await res.json();

    if (selectedCategoryId !== null) {
      products = products.filter(p => p.category_id === selectedCategoryId);
    }

    displayProducts(products);

    document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
  } catch (error) {
    console.error(error);
    document.getElementById('productList').innerHTML = '<p>Məhsullar yüklənərkən xəta baş verdi.</p>';
  }
}

// Kateqoriyaları yüklə və DOM-a əlavə et
const categoriesContainer = document.getElementById('categories');

let selectedCategoryTitle = null;

async function loadCategory() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/kategoriya/all');
    if (!res.ok) throw new Error('Kateqoriyalar yüklənə bilmədi');
    const categoriesData = await res.json();

    categoriesContainer.innerHTML = '';
    const urlCategoryTitle = getCategoryTitleFromURL();

    // Hamısı radio
    const allItem = document.createElement('div');
    allItem.className = 'category-item';
    allItem.innerHTML = `
      <input type="radio" name="category" id="catAll" ${!urlCategoryTitle ? 'checked' : ''}>
      <label for="catAll">Hamısı</label>
    `;
    allItem.addEventListener('click', () => {
      selectedCategoryTitle = null;
      loadProducts();
    });
    categoriesContainer.appendChild(allItem);

    categoriesData.forEach(cat => {
      const isSelected = cat.title === urlCategoryTitle;
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item';
      categoryItem.innerHTML = `
        <input type="radio" name="category" id="cat${cat.id}" ${isSelected ? 'checked' : ''}>
        <label for="cat${cat.id}">${cat.title}</label>
      `;
      categoryItem.addEventListener('click', () => {
        selectedCategoryTitle = cat.title;
        loadProducts();
      });
      categoriesContainer.appendChild(categoryItem);

      if (isSelected) {
        selectedCategoryTitle = cat.title;
      }
    });

  } catch (error) {
    console.error(error);
    categoriesContainer.innerHTML = '<p>Kateqoriyalar yüklənərkən xəta baş verdi.</p>';
  }
}

async function loadProducts() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənə bilmədi');
    let products = await res.json();

    if (selectedCategoryTitle !== null) {
      products = products.filter(p => p.category_title === selectedCategoryTitle);
    }

    displayProducts(products);
    document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
  } catch (error) {
    console.error(error);
    document.getElementById('productList').innerHTML = '<p>Məhsullar yüklənərkən xəta baş verdi.</p>';
  }
}


// Ürək ikonuna klik dinləyicisi əlavə et
function attachFavListeners() {
  document.querySelectorAll(".favourite-circle").forEach(circle => {
    circle.addEventListener("click", async (e) => {
      e.stopPropagation();

      const productCardElement = e.currentTarget.closest('.products-card');
      const productId = e.currentTarget.getAttribute("data-id");

      if (productCardElement && productId) {
        await toggleFavourite(productId, productCardElement, e.currentTarget);
      }
    });
  });
}

// Sevimliyə əlavə/silmə funksiyası
async function toggleFavourite(productId, productCardElement, favCircleElement) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    showToast("Zəhmət olmasa daxil olun", true);
    return;
  }

  try {
    const isFav = favCircleElement.getAttribute("data-fav") === "1";

    let url, method;
    if (isFav) {
      // Sevimlilərdən silmək
      url = 'https://api.back.freshbox.az/api/fave/delete';
      method = 'DELETE';
    } else {
      // Sevimlilərə əlavə etmək
      url = 'https://api.back.freshbox.az/api/fave/add';
      method = 'POST';
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId
      }),
    });

    if (res.ok) {
      const isNowFav = !isFav;
      favCircleElement.setAttribute("data-fav", isNowFav ? "1" : "0");
      favCircleElement.querySelector('img').src = isNowFav
        ? './assets/img/orangeHerz.svg'
        : './assets/img/heart.png';

      showToast(isNowFav ? "Sevimlilərə əlavə olundu" : "Sevimlilərdən silindi");
    } else {
      throw new Error('Server error');
    }
  } catch (error) {
    console.error('Sevimliyə əlavə/silmə xətası:', error);
    showToast("Xəta baş verdi", true);
  }
}


// Məhsul səhifəsinə yönləndir
function goToProductPage(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  const titleParam = encodeURIComponent(product.title);
  window.location.href = `product-page.html?title=${titleParam}`;
}

// Səhifə yüklənəndə
document.addEventListener('DOMContentLoaded', async () => {
  await loadCategory();
  loadProducts();
});
function displayProducts(products) {
  const container = document.getElementById('productList');
  container.innerHTML = ''; // əvvəlcə təmizləyirik

  const htmlStrings = products.map(product => {
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount
      ? (product.price - (product.price * product.discount / 100)).toFixed(2)
      : null;

    return `
<div class="products-card" data-id="${product.id}" data-fav="${product.fav || '0'}">
  <div class="image-container">
    <img src="https://api.back.freshbox.az/uploads/product/${product.image}" alt="${product.title}">
    ${hasDiscount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
   <div class="favourite-circle" data-id="${product.id}" data-fav="${product.fav === 1 ? '1' : '0'}">
      <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="fav-icon">
    </div>
  </div>

  <div class="name-weight">
    <h3>${product.title}</h3>
    <div class="stock-weight">
      <span class="stock-status">
        ${
          product.stock === 1
            ? `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7 13l3 3 7-7" stroke="white" stroke-width="2"/></svg> Stokda var`
            : `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F44336"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/></svg> Stokda yoxdur`
        }
      </span>
      <span class="weight-info">
        ${product.weight > 0 ? product.weight + " kg" : ""}
        ${product.quantity > 0 ? product.quantity + ' ədəd' : ''}
        ${product.liter > 0 ? product.liter + " l" : ""}
      </span>
    </div>
  </div>

  <div class="price">
    ${
      hasDiscount
        ? `<span class="old-price">${product.price} azn</span>
           <span class="discounted-price">${discountedPrice} azn</span>`
        : `<span>${product.price} azn</span>`
    }
  </div>

  <button onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>
</div>

    `;
  });

  container.innerHTML = htmlStrings.join('');
  attachFavListeners(); // ürək klikləri üçün
}

// Axtarış üçün funksiya
function searchProducts(keyword, products) {
  keyword = keyword.toLowerCase();
  return products.filter(product =>
    product.title.toLowerCase().includes(keyword)
  );
}
let allProducts = []; // bütün məhsullar burada saxlanacaq
async function loadProducts() {
  try {
    const res = await fetch('https://api.back.freshbox.az/api/product/all');
    if (!res.ok) throw new Error('Məhsullar yüklənə bilmədi');
    let products = await res.json();

    allProducts = products; // Bütün məhsulları yadda saxla

    if (selectedCategoryTitle !== null) {
      products = products.filter(p => p.category_title === selectedCategoryTitle);
    }

    displayProducts(products);
    document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
  } catch (error) {
    console.error(error);
    document.getElementById('productList').innerHTML = '<p>Məhsullar yüklənərkən xəta baş verdi.</p>';
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  await loadCategory();
  await loadProducts();

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value;
    let filtered = searchProducts(keyword, allProducts);

    // Əgər kateqoriya seçilibsə, həmin kateqoriyada filtrlə
    if (selectedCategoryTitle !== null) {
      filtered = filtered.filter(p => p.category_title === selectedCategoryTitle);
    }

    displayProducts(filtered);
    document.getElementById('quatity-of-products').textContent = `${filtered.length} məhsul`;
  });
});

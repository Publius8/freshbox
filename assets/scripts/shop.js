function getCategoryTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('categoryTitle');
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".dropdown-toggle-mobile");
    const filterBar = document.querySelector(".filter-left-bar");

    toggleBtn.addEventListener("click", function () {
        filterBar.classList.toggle("active");
    });
});

window.addEventListener("load", function () {
    const mobileAuthControl = document.getElementById('mobileAuthControl');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (window.innerWidth <= 768) {
        if (token && userId) {
            // show icon
            if (mobileAuthControl) {
                mobileAuthControl.innerHTML = `
    <a href="./profile.html" style="
      padding: 10px 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 20px;
      text-decoration: none;
      font-size: 22px;
      color: white;
      transition: 0.3s;
    " onmouseover="this.style.backgroundColor='rgba(19, 125, 59, 0.95)'" 
       onmouseout="this.style.backgroundColor=''">
      <img src="./assets/img/iconizer-Profile.svg" alt="Profile" style="margin-right: 10px;">
      Profile
    </a>
  `;
                mobileAuthControl.style.display = 'flex';
            }
        } else {
            // show register button
            if (mobileAuthControl) {
                mobileAuthControl.innerHTML = `
          <button class="sidebar-button" onclick="document.location='mobile_sing.html'">Qeydiyyatdan keç</button>
        `;
                mobileAuthControl.style.display = 'flex';
            }
        }
    }
});

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
function displayProducts(products) {
    const container = document.getElementById('productList');
    container.innerHTML = ''; // təmizlə

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'products-card';
        productCard.dataset.id = product.id;
        productCard.dataset.fav = product.fav || '0';

        productCard.innerHTML = `
        <div class="imgae-circle">
          <div class="image-container">
            <img src="https://api.fresback.squanta.az/uploads/product/${product.image}" alt="${product.title}">
          </div>
          <div class="favourite-circle" data-id="${product.id}" data-fav="${product.fav === 1 ? '1' : '0'}">
            <img src="${product.fav === 1 ? './assets/img/orangeHerz.svg' : './assets/img/heart.png'}" alt="fav-icon">
          </div>
        </div>
        <div class="name-weight">
          <h3>${product.title}</h3>
          <span class="stock-status">
            ${product.stock === 1
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M7 13l3 3 7-7" stroke="white" stroke-width="2"/></svg> Stokda var`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F44336"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"/></svg> Stokda yoxdur`}
          </span>
          <span>${product.quantity > 0 ? product.quantity + ' ədəd' : ''}</span>
          <span>${product.weight > 0 ? product.weight + " kg" : ""}</span>
          <span>${product.liter > 0 ? product.liter + " l" : ""}</span>
        </div>
        <div class="price">
          <span>${product.price} man</span>
        </div>
        <div>
          <button role="link" onclick='goToProductPage(${JSON.stringify(product)})'>İndi sifariş et</button>
        </div>
      `;

        container.appendChild(productCard);
    });

    document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
    attachFavListeners();
}

// Məhsulları yüklə və siyahını göstər
async function loadProducts() {
    try {
        const res = await fetch('https://api.fresback.squanta.az/api/product/all');
        const products = await res.json();

        displayProducts(products);
        document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
    } catch (error) {
        console.error('Xəta məhsulları yükləyərkən:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // Загрузка при открытии страницы
});

document.querySelector('.custom-dropdown select').addEventListener('change', async function () {
    const selectedValue = this.value;
    try {
        const res = await fetch('https://api.fresback.squanta.az/api/product/all');
        let products = await res.json();

        // Сортировка
        switch (selectedValue) {
            case 'azdan-coxa':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'coxdan-aza':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'yeniler':
                products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'endirim':
                products = products.filter(product => product.discount_price > 0);
                break;
        }

        displayProducts(products);
        document.getElementById('quatity-of-products').textContent = `${products.length} məhsul`;
    } catch (error) {
        console.error('Xəta:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); // <- теперь при первой загрузке всё отобразится
});


document.querySelector('.custom-dropdown select').addEventListener('change', async function () {
    const selectedValue = this.value;
    try {
        const res = await fetch('https://api.fresback.squanta.az/api/product/all');
        let products = await res.json();

        // Сортировка
        switch (selectedValue) {
            case 'azdan-coxa':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'coxdan-aza':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'yeniler':
                products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'endirim':
                products = products.filter(product => product.discount_price > 0);
                break;
        }

        displayProducts(products); // вызываем отрисовку
    } catch (error) {
        console.error('Xəta:', error);
    }
});

// Ürək ikonuna klik dinləyicisi əlavə et
function attachFavListeners() {
    document.querySelectorAll(".favourite-circle").forEach(circle => {
        circle.addEventListener("click", async (e) => {
            e.stopPropagation(); // klik eventini məhsul kartına yayılmasın

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
        const url = `https://api.fresback.squanta.az/api/favourite/${isFav ? 'remove' : 'add'}`;
        const method = isFav ? 'DELETE' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id: productId,
                user_id: userId
            })
        });

        if (res.ok) {
            // Toggle the icon and data-fav value
            const isNowFav = !isFav;
            favCircleElement.setAttribute("data-fav", isNowFav ? "1" : "0");
            favCircleElement.querySelector('img').src = isNowFav
                ? './assets/img/orangeHerz.svg'
                : './assets/img/heart.png';

            showToast(isNowFav ? "Sevimlilərə əlavə olundu" : "Sevimlilərdən silindi");
        } else {
            throw new Error("Server error");
        }
    } catch (error) {
        console.error('Sevimliyə əlavə etmə xətası:', error);
        showToast("Xəta baş verdi", true);
    }
}

function goToProductPage(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    const titleParam = encodeURIComponent(product.title);
    window.location.href = `product-page.html?title=${titleParam}`;
}


loadProducts();




// Categorya\
let categories = document.getElementById('categories');
let selectedCategoryId = null; 

async function loadCategory() {
    try {
        const res = await fetch('https://api.fresback.squanta.az/api/kategoriya/all');
        const categories = await res.json();

      
        categories.innerHTML = ''; // təmizlə

        // "Hamısı" seçimini əlavə et
        const allItem = document.createElement('div');
        allItem.className = 'category-item';
        allItem.innerHTML = `
            <input type="radio" name="category" id="catAll" checked>
            <label for="catAll">Hamısı</label>
        `;
        allItem.addEventListener('click', () => {
            selectedCategoryId = null;
            loadProducts();
        });
        container.appendChild(allItem);

        // Kateqoriyaları əlavə et
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            
            categoryItem.innerHTML = `
                <input type="radio" name="category" id="cat${category.id}">
                <label for="cat${category.id}">${category.title}</label>
            `;

            categoryItem.addEventListener('click', () => {
                selectedCategoryId = category.id;
                loadProducts();
            });

            container.appendChild(categoryItem);
        });

    } catch (error) {
        console.error('Xəta:', error);
    }
}

async function loadCategory() {
    try {
        const categoriesData = await fetch('https://api.fresback.squanta.az/api/kategoriya/all').then(res => res.json());

        categories.innerHTML = ''; // təmizlə
        const selectedCategoryTitle = getCategoryTitleFromURL();

        // "Hamısı" seçimi
        const allItem = document.createElement('div');
        allItem.className = 'category-item';
        allItem.innerHTML = `
            <input type="radio" name="category" id="catAll" ${!selectedCategoryTitle ? 'checked' : ''}>
            <label for="catAll">Hamısı</label>
        `;
        allItem.addEventListener('click', () => {
            selectedCategoryId = null;
            loadProducts();
        });
        categories.appendChild(allItem);

        categoriesData.forEach(category => {
            const isSelected = category.title === selectedCategoryTitle;
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';

            categoryItem.innerHTML = `
                <input type="radio" name="category" id="cat${category.id}" ${isSelected ? 'checked' : ''}>
                <label for="cat${category.id}">${category.title}</label>
            `;

            categoryItem.addEventListener('click', () => {
                selectedCategoryId = category.id;
                loadProducts();
            });

            categories.appendChild(categoryItem);

            // Если это выбранная категория — загружаем товары
            if (isSelected) {
                selectedCategoryId = category.id;
            }
        });

        loadProducts();

    } catch (error) {
        console.error('Xəta:', error);
    }
}


// Səhifə yüklənəndə hər ikisini çağır
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategory();
    loadProducts();
});

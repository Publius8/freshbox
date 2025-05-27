  // AOS инциализация
AOS.init();

// Modal popup funksiyaları
let modalPage = document.getElementById("modalPage");
let popUP = document.getElementById("popUP");
let overlay = document.getElementById("overlay");
let closeBtn = document.getElementById("closeBtn");

function openPopup() {
  popUP.classList.remove("hide-popup");
  popUP.classList.add("show-popup");
  popUP.style.visibility = "visible";
  overlay.classList.add("active-overlay");
  AOS.refresh();
}

function closePopup() {
  popUP.classList.remove("show-popup");
  popUP.classList.add("hide-popup");
  overlay.classList.remove("active-overlay");
  setTimeout(() => {
    popUP.style.visibility = "hidden";
  }, 300);
}

modalPage.addEventListener("click", openPopup);
closeBtn.addEventListener("click", closePopup);

// Form switch funksiyası
function switchForm(formType) {
  const buttons = document.querySelectorAll('.switchButtons button');
  buttons.forEach(button => {
    button.classList.remove('active');
    button.style.opacity = 0.6;
  });

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (formType === 'login') {
    document.querySelector('.switchButtons button:first-child').classList.add('active');
    document.querySelector('.switchButtons button:first-child').style.opacity = 1;

    if (registerForm.style.display === 'block') {
      registerForm.style.transition = "opacity 0.5s ease-in-out";
      registerForm.style.opacity = 0;
      setTimeout(() => {
        registerForm.style.display = 'none';
      }, 500);
    }

    setTimeout(() => {
      loginForm.style.display = 'block';
      loginForm.style.transition = "opacity 0.5s ease-in-out";
      loginForm.style.opacity = 1;
    }, 500);

  } else {
    document.querySelector('.switchButtons button:last-child').classList.add('active');
    document.querySelector('.switchButtons button:last-child').style.opacity = 1;

    if (loginForm.style.display === 'block') {
      loginForm.style.transition = "opacity 0.5s ease-in-out";
      loginForm.style.opacity = 0;
      setTimeout(() => {
        loginForm.style.display = 'none';
      }, 500);
    }

    setTimeout(() => {
      registerForm.style.display = 'block';
      registerForm.style.transition = "opacity 0.5s ease-in-out";
      registerForm.style.opacity = 1;
    }, 500);
  }
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

// Məhsulları yüklə və siyahını göstər
async function loadProducts() {
  try {
    const res = await fetch('https://api.fresback.squanta.az/api/product/all');
    const products = await res.json();

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
            <img src="https://api.fresback.squanta.az/api/product/${product.image}" alt="${product.title}">
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
          <span>${product.quantity > 0 ? product.quantity + ' ədəd' : ''}</span>
          <span>${product.weight > 0 ? product.weight + " kg" : ""}</span>
          <span>${product.liter > 0 ? product.liter + " l" : ""}</span>
        </div>
        <div class="price">
          <span>${product.price} man</span>
        </div>
        <div>
          <button role="link" onclick="window.location.href='product-page.html';">İndi sifariş et</button>
        </div>
      `;

      // productCard-ə klik dinləyici əlavə etməkdənsə, yalnız favourite-circle üçün əlavə edirik

      container.appendChild(productCard);
    });

    attachFavListeners();

  } catch (error) {
    console.error('Xəta:', error);
  }
}

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
    showToast("Zəhmət olmasa, əvvəlcə hesabınıza daxil olun", true);
    return;
  }

  let isFaved = favCircleElement.dataset.fav === "1";

  try {
    if (isFaved) {
      // Sevimlərdən sil
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

      if (!res.ok) throw new Error('Xəta baş verdi');

      productCardElement.dataset.fav = "0";
      favCircleElement.dataset.fav = "0";
      favCircleElement.querySelector("img").src = "./assets/img/heart.png";

      showToast("Sevimlərdən silindi");

    } else {
      // Sevimlərə əlavə et
      const res = await fetch('https://api.fresback.squanta.az/api/fave/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId
        }),
      });

      if (res.status === 201) {
        productCardElement.dataset.fav = "1";
        favCircleElement.dataset.fav = "1";
        favCircleElement.querySelector("img").src = "./assets/img/orangeHerz.svg";

        showToast("Sevimlərə əlavə edildi");
      } else if (res.status === 409) {
        const data = await res.json();
        showToast(data.error || "Məhsul artıq sevimlilərdə var", true);
      } else {
        throw new Error('Xəta baş verdi');
      }
    }
  } catch (err) {
    console.error("Sevimlər xətası:", err);
    showToast("Xəta baş verdi", true);
  }
}

loadProducts();


    function openNav() {
      // Open the sidebar and overlay
      document.getElementById("mySidebar").classList.add("open");
      document.getElementById("overlaytus").classList.add("show");
    
      // Disable scrolling by setting the body's and html's overflow to 'hidden'
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // This ensures scrolling is disabled for the entire document
    }
    
    function closeNav() {
      // Close the sidebar and overlay
      document.getElementById("mySidebar").classList.remove("open");
      document.getElementById("overlaytus").classList.remove("show");
    
      // Re-enable scrolling by restoring the body's and html's overflow property
      document.body.style.overflow = '';
      document.documentElement.style.overflow = ''; // This restores the default scrolling behavior
    }
    
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const arrowIcon = document.querySelector('.arrow-icon'); // выбираем стрелку
    
    languageBtn.addEventListener('click', () => {
        languageDropdown.classList.toggle('open');
        arrowIcon.classList.toggle('rotated'); // переключаем класс для поворота
    });
    
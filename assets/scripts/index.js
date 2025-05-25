document.addEventListener('DOMContentLoaded', () => {
  const registerFormAction = document.getElementById('registerFormAction');
  const registerMessage = document.getElementById('registerMessage');
  const loginFormAction = document.getElementById('loginFormAction');
  // const loginMessage = document.getElementById('loginMessage');
  const authButtons = document.querySelector('.auth-buttons');
  const userIcon = document.querySelector('.user-icon');

  let userId = "";
  let token = "";


  // === Регистрация ===
  registerFormAction?.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerMessage.textContent = '';
    registerMessage.className = 'message';

    const full_name = registerFormAction.full_name.value.trim();
    const email = registerFormAction.email.value.trim();
    const password = registerFormAction.password.value;

    if (!full_name || !email || !password) {
      registerMessage.textContent = 'Пожалуйста, заполните все поля.';
      registerMessage.classList.add('error');
      return;
    }

    if (password.length < 8) {
      registerMessage.textContent = 'Пароль должен содержать минимум 8 символов.';
      registerMessage.classList.add('error');
      return;
    }

    try {
      const res = await fetch('https://api.fresback.squanta.az/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Добро пожаловать, ${data.user.full_name}!`);
        registerFormAction.reset();
        saveAuthState(data);
        replaceAuthButton();
        hidePopup();

        if (window.innerWidth <= 768) {
          window.location.href = './index.html';
        }
      } else {
        registerMessage.textContent = data.error || 'Произошла ошибка.';
        registerMessage.classList.add('error');
      }
    } catch (err) {
      registerMessage.textContent = 'Не удалось подключиться к серверу.';
      registerMessage.classList.add('error');
      console.error(err);
    }
  });

  // === Вход ===
  loginFormAction?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // loginMessage.textContent = '';
    // loginMessage.className = 'message';

    const email = loginFormAction.email.value.trim();
    const password = loginFormAction.password.value;

    // if (!email || !password) {
    //   loginMessage.textContent = 'Пожалуйста, введите email и пароль.';
    //   loginMessage.classList.add('error');
    //   return;
    // }

    try {
      const res = await fetch('https://api.fresback.squanta.az/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess(`Добро пожаловать, ${data.user.full_name}!`);
        loginFormAction.reset();
        saveAuthState(data);
        replaceAuthButton();
        hidePopup();

        if (window.innerWidth <= 768) {
          window.location.href = './index.html';
        }
      } else {
        // ВЫВОД СООБЩЕНИЯ ЕСЛИ НЕВЕРНЫЙ EMAIL ИЛИ ПАРОЛЬ
        // loginMessage.textContent = data.error || 'Неверный email или пароль.';
        // loginMessage.classList.add('error');
      }
    } catch (err) {
      // loginMessage.textContent = 'Ошибка подключения к серверу.';
      // loginMessage.classList.add('error');
      // console.error(err);
    }
  });

  // === Проверка входа при загрузке ===
   token = localStorage.getItem('token');
   userId = localStorage.getItem('userId');

  if (token && userId) {
    replaceAuthButton();
  }

  // === Заполнение профиля при загрузке ===
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const phoneInput = document.getElementById('profilePhone');
  const addressInput = document.getElementById('profileAddress');

  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const phone = localStorage.getItem('phone');
  const address = localStorage.getItem('address');

  if (nameInput && fullName) nameInput.value = fullName;
  if (emailInput && email) emailInput.value = email;
  if (phoneInput && phone) phoneInput.value = phone;
  if (addressInput && address) addressInput.value = address;

  // === PROFILE UPDATE ===
  const profileUpdateForm = document.getElementById('profileUpdateForm');
  const profileUpdateMessage = document.getElementById('profileUpdateMessage');

  if (profileUpdateForm && userId && token) {
    loadProfileData(userId);

    profileUpdateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      profileUpdateMessage.textContent = '';
      profileUpdateMessage.className = 'message';

      const updateData = {
        full_name: profileUpdateForm.full_name.value.trim(),
        phone: profileUpdateForm.phone.value.trim(),
        email: profileUpdateForm.email.value.trim(),
        address: profileUpdateForm.address.value.trim(),
      };

      try {
        const res = await fetch(`https://api.fresback.squanta.az/api/user/profile/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();

        if (res.ok) {
          profileUpdateMessage.textContent = 'Profil məlumatları uğurla yeniləndi!';
          profileUpdateMessage.classList.remove('error');
          profileUpdateMessage.classList.add('success');
        } else {
          profileUpdateMessage.textContent = data.error || 'Xəta baş verdi.';
          profileUpdateMessage.classList.add('error');
        }
      } catch (err) {
        profileUpdateMessage.textContent = 'Serverə qoşulmaq mümkün olmadı.';
        profileUpdateMessage.classList.add('error');
        console.error(err);
      }
    });
  }

  async function loadProfileData(userId) {
    try {
      const res = await fetch(`https://api.fresback.squanta.az/api/user/with-profiles/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Profil məlumatları gətirilə bilmədi.');

      const profileData = await res.json();

      document.getElementById('update_full_name').value = profileData.full_name || '';
      document.getElementById('update_email').value = profileData.email || '';
      document.getElementById('update_phone').value = profileData.phone || '';
      document.getElementById('update_address').value = profileData.address || '';
    } catch (err) {
      if (profileUpdateMessage) {
        profileUpdateMessage.textContent = err.message;
        profileUpdateMessage.classList.add('error');
      }
    }
  }

  // === Logout Modal ===
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogoutBtn = document.getElementById("confirmLogout");
  const cancelLogoutBtn = document.getElementById("cancelLogout");

  window.showLogoutModal = function () {
    logoutModal.style.display = "flex";
  };

  cancelLogoutBtn?.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  confirmLogoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("address");

    logoutModal.style.display = "none";

    if (authButtons) authButtons.style.display = "flex";
    if (userIcon) userIcon.style.display = "none";

    window.location.href = "./index.html";
  });

  // === Helpers ===
  function saveAuthState(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('fullName', data.user.full_name);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('phone', data.user.phone || '');
    localStorage.setItem('address', data.user.address || '');
  }

  function replaceAuthButton() {
    const authControl = document.getElementById('authControl');
    if (authControl) {
      authControl.innerHTML = `
        <a href="./profile.html">
          <img src="./assets/img/Profile.png" alt="Профиль">
        </a>
      `;
    }

    if (authButtons) authButtons.style.display = 'none';
    if (userIcon) userIcon.style.display = 'flex';
  }

  function showSuccess(message) {
    alert(message); // Можно заменить на toast
  }

  function hidePopup() {
    const popup = document.getElementById('popUP');
    const overlay = document.getElementById('overlay');
    if (popup) popup.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
  }
  

  
// PASS CHANGE START

   const passwordMessage = document.getElementById('passwordMessage');
  // form elementi (düzgün işləməsi üçün əlavə et)
  const passwordForm = document.getElementById('passwordForm');

  // Mesaj göstərmə funksiyası
  function showPasswordMessage(message, isError) {
    passwordMessage.textContent = message;
    passwordMessage.style.color = isError ? 'red' : 'green';
    passwordMessage.className = isError ? 'error' : 'success';
  }

  // Əsas parol dəyişmə funksiyası
  async function passresstss() {


    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    passwordMessage.textContent = '';
    passwordMessage.className = '';

    if (!oldPassword || !newPassword || !confirmPassword) {
      showPasswordMessage('Bütün sahələri doldurun.', true);
      return;
    }

    if (newPassword.length < 8) {
      showPasswordMessage('Yeni parol ən azı 8 simvoldan ibarət olmalıdır.', true);
      return;
    }

    if (newPassword !== confirmPassword) {
      showPasswordMessage('Yeni parollar uyğun gəlmir.', true);
      return;
    }

    if (!token || !userId) {
      showPasswordMessage('İstifadəçi daxil olmayıb.', true);
      return;
    }

    try {
      const response = await fetch(`https://api.fresback.squanta.az/api/user/password/${userId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showPasswordMessage('Parol uğurla dəyişdirildi!', false);
        passwordForm.reset();
      } else {
        showPasswordMessage(data.message || data.error || 'Xəta baş verdi.', true);
      }
    } catch (error) {
      console.error('Password change error:', error);
      showPasswordMessage('Serverə qoşulmaq mümkün olmadı.', true);
    }
  }

 
   const changePassBtn = document.getElementById('change-pass');
  if (changePassBtn) {
    changePassBtn.addEventListener('click', passresstss);
  }
// PASS CHANGE FINISH


// cart script
document.addEventListener('DOMContentLoaded', () => {
  const addToCartForm = document.getElementById('add-to-cart-form');
  const quantityInput = document.getElementById('numberInput');
  const productId = document.getElementById('put_name_here').dataset.productId;
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    alert('Пользователь не авторизован');
    return;
  }

  // add to cart
  addToCartForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const quantity = parseInt(quantityInput.value, 10);

    try {
      const response = await fetch('https://api.fresback.squanta.az/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении товара в корзину');
      }

      const result = await response.json();
      alert('Товар успешно добавлен в корзину!');
      await loadCart(); 
    } catch (error) {
      console.error(error);
      alert('Ошибка при добавлении товара');
    }
  });

  // buttons + and -
  window.changeValue = (delta) => {
    let currentValue = parseInt(quantityInput.value, 10);
    if (isNaN(currentValue)) currentValue = 1;
    currentValue += delta;
    if (currentValue < 1) currentValue = 1;
    quantityInput.value = currentValue;
  };

  // cart download
  async function loadCart() {
    try {
      const response = await fetch(`https://api.fresback.squanta.az/api/cart?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const cartData = await response.json();
      const purchasesList = document.querySelector('.purchases-list');
      purchasesList.innerHTML = '';

      const totalPriceElement = document.getElementById('put_total_here');

      if (!cartData.items || cartData.items.length === 0) {
        purchasesList.innerHTML = '<p>Empty</p>';
        totalPriceElement.textContent = '0 AZN';
        return;
      }

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
              <span>${item.weight}</span>
            </div>
          </div>
          <div class="quatity-of-products">
            <span>${item.quantity}</span>
          </div>
          <div class="put_price_here">
            <span>${item.price} AZN</span>
          </div>
        `;
        purchasesList.appendChild(itemElement);
      });

      totalPriceElement.textContent = `${cartData.total_price} AZN`;
    } catch (error) {
      console.error(error);
      alert('Error');
    }
  }

  loadCart();
});


});







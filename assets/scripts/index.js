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

  const passwordSection = document.querySelector('.change-pass');
  const changePasswordForm = passwordSection?.querySelector('.form-grid');
  const submitButton = passwordSection?.querySelector('#change-pass');


  submitButton?.addEventListener('click', async (e) => {
    e.preventDefault();

   token = localStorage.getItem('token');
   userId = localStorage.getItem('userId');


    const oldPassword = changePasswordForm?.querySelector('input[placeholder="Əvvəlki parol"]')?.value.trim();
    const newPassword = changePasswordForm?.querySelector('input[placeholder="Yeni parol"]')?.value.trim();
    const confirmPassword = changePasswordForm?.querySelector('input[placeholder="Yeni parolu yenidən daxil edin"]')?.value.trim();
    const messageBlock = passwordSection.querySelector('.change-pass-message');

    if (messageBlock) {
      messageBlock.textContent = '';
      messageBlock.className = 'change-pass-message';
    }

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

    try {
      const res = await fetch(`https://api.fresback.squanta.az/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          current_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showPasswordMessage('Parol uğurla dəyişdirildi!', false);
        changePasswordForm.reset();
      } else {
        showPasswordMessage(data.error || 'Xəta baş verdi.', true);
      }
    } catch (err) {
      console.error(err);
      showPasswordMessage('Serverə qoşulmaq mümkün olmadı.', true);
    }
  });

  function showPasswordMessage(message, isError) {
    let messageBlock = passwordSection.querySelector('.change-pass-message');

    if (!messageBlock) {
      messageBlock = document.createElement('div');
      messageBlock.className = 'change-pass-message';
      passwordSection.querySelector('.form-pass-change')?.appendChild(messageBlock);
    }

    messageBlock.textContent = message;
    messageBlock.classList.toggle('error', isError);
    messageBlock.classList.toggle('success', !isError);
  }

// PASS CHANGE FINISH





  // favourites

  // const productsCard = document.querySelector(".products-card");
 

});







// document.addEventListener("DOMContentLoaded", () => {


//   document.querySelectorAll(".favourite-circle").forEach(circle => {
//     circle.addEventListener("click", async (e) => {
//       e.stopPropagation();


//       const elem = e.currentTarget;
//       const productId = elem.getAttribute("data-id");
//       const isFaved = elem.getAttribute("data-fav") === "1";



//       try {
//         if (isFaved) {
//           // Удалить из избранного
//           const res = await fetch('http://localhost:3000/api/fave/delete', {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               user_id: currentUserId,
//               product_id: productId
//             }),
//           });

//           if (!res.ok) throw new Error('Xəta baş verdi');

//           // Обновить UI
//           elem.setAttribute("data-fav", "0");
//           elem.querySelector("img").src = "./assets/img/emptyHerz.svg";
//           showToast("Sevimlərdən silindi");

//         } else {
//           // Добавить в избранное
//           const res = await fetch('http://localhost:3000/api/fave/add', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               user_id: currentUserId,
//               product_id: productId
//             }),
//           });

//           if (!res.ok) throw new Error('Xəta baş verdi');

//           // Обновить UI
//           elem.setAttribute("data-fav", "1");
//           elem.querySelector("img").src = "./assets/img/orangeHerz.svg";
//           showToast("Sevimlərə əlavə edildi");
//         }
//       } catch (err) {
//         console.error("Sevimlər xətası:", err);
//         showToast("Xəta baş verdi", true);
//       }
//     });
//   });
// });

// function showToast(message, isError = false) {
//   const toast = document.createElement('div');
//   toast.textContent = message;
//   toast.style.position = 'fixed';
//   toast.style.bottom = '20px';
//   toast.style.left = '50%';
//   toast.style.transform = 'translateX(-50%)';
//   toast.style.padding = '10px 20px';
//   toast.style.backgroundColor = isError ? 'red' : 'green';
//   toast.style.color = 'white';
//   toast.style.borderRadius = '5px';
//   toast.style.zIndex = '9999';
//   toast.style.fontSize = '14px';
//   toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
//   document.body.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//   }, 2000);
// }

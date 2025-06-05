                // Инициализация AOS
                AOS.init();

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


const sidebar = document.querySelector('.sidebar');
const text = document.querySelector('.textHeadButton');

function toggleSidebar(open) {
  if (open) {
    sidebar.classList.add('open');
    text.classList.add('hide-text');
  } else {
    sidebar.classList.remove('open');
    text.classList.remove('hide-text');
  }
}

function openNav() {
  toggleSidebar(true);
  document.getElementById("overlaytus").style.display = "block";
}

function closeNav() {
  toggleSidebar(false);
  document.getElementById("overlaytus").style.display = "none";
}

        // Инициализация AOS
        AOS.init();


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


  function replaceAuthButton() {
    const authControl = document.getElementById('authControl');
    if (authControl) {
      authControl.innerHTML = `
        <a href="./profile.html">
         
      <img src="./assets/img/Profile.svg" alt="Profile">

        </a>
      `;
    }
    if (authButtons) authButtons.style.display = 'none';
    if (userIcon) userIcon.style.display = 'flex';
  }
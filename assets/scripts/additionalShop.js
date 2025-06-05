AOS.init();

document.addEventListener('DOMContentLoaded', () => {
  loadCategory();
  loadProducts();

  const toggleBtn = document.querySelector('.dropdown-toggle-mobile');
  const filterBar = document.querySelector('.filter-left-bar');

  if (toggleBtn && filterBar) {
    toggleBtn.addEventListener('click', () => {
      filterBar.classList.toggle('mobile-visible');
    });
  } else {
    console.warn('Кнопка или блок с фильтрами не найдены');
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
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");
let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}
let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}
modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

// skript əgər form daxil olmaq ucun dolu deyil onda admin panelə giriş qadağa olur

//   const token = localStorage.getItem('authToken');

//     if (!token) {
//       // Если токена нет — выкидываем обратно
//       window.location.href = './login.html';
//     }

//     function logout() {
//       localStorage.removeItem('authToken');
//       window.location.href = './login.html';
//     }


// tabs and animation

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links a");
    const tabs = document.querySelectorAll(".content-tab");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("data-target");
            const targetTab = document.getElementById(targetId);

            if (targetTab.classList.contains("active")) return;

            tabs.forEach(tab => {
                tab.classList.remove("active");
            });

            setTimeout(() => {
                targetTab.classList.add("active");
            }, 10); 
        });
    });
});



// kategoria add/edit/delete

const categoryBody = document.getElementById("category-body");
const categoryModal = document.getElementById("category-modal");
const closeCategoryModal = document.getElementById("close-category-modal");
const categoryForm = document.getElementById("category-form");
let categoryId = 3;

const categories = [
  { id: 1, name: "Meyvələr", description: "Təzə meyvələr", productCount: 5 },
  { id: 2, name: "Süd Məhsulları", description: "Təbii süd məhsulları", productCount: 2 },
  { id: 3, name: "Ət Məhsulları", description: "Toyuq, mal və s.", productCount: 4 }
];

function renderCategories() {
  categoryBody.innerHTML = "";
  categories.forEach(cat => {
    categoryBody.innerHTML += `
      <tr>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td>${cat.description}</td>
        <td>${cat.productCount}</td>
        <td>
          <button class="edit-btn" onclick="editCategory(${cat.id})">Redaktə et</button>
          <button class="delete-btn" onclick="deleteCategory(${cat.id})">Sil</button>
        </td>
      </tr>
    `;
  });
}

function editCategory(id) {
  const cat = categories.find(c => c.id === id);
  alert(`"${cat.name}" kateqoriyası redaktə olunur...`);
}

function deleteCategory(id) {
  const cat = categories.find(c => c.id === id);
  if (confirm(`"${cat.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
    const index = categories.findIndex(c => c.id === id);
    if (index > -1) {
      categories.splice(index, 1);
      renderCategories();
    }
  }
}

document.getElementById("add-category-btn").addEventListener("click", () => {
  categoryModal.style.display = "block";
});

closeCategoryModal.onclick = () => {
  categoryModal.style.display = "none";
};

window.addEventListener("click", (e) => {
  if (e.target === categoryModal) {
    categoryModal.style.display = "none";
  }
});

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  categoryId++;
  const newCategory = {
    id: categoryId,
    name: document.getElementById("category-name").value,
    description: document.getElementById("category-description").value,
    productCount: parseInt(document.getElementById("category-product-count").value)
  };
  categories.push(newCategory);
  renderCategories();
  categoryModal.style.display = "none";
  categoryForm.reset();
});


renderCategories();




// məhsullar script
 const productBody = document.getElementById("product-body");
  let productId = 3;

  const products = [
    {
      id: 1,
      title: "Alma",
      description: "Təzə Quba almaları",
      price: 1.2,
      stock: 100,
      discount: 10,
      weight: "1kg",
      number: 5,
      liter: "—",
      quantity: 20,
      category_id: 3,
      image: "https://via.placeholder.com/60"
    },
    {
      id: 2,
      title: "Süd",
      description: "Təbii kənd südü",
      price: 0.9,
      stock: 50,
      discount: 5,
      weight: "1l",
      number: 2,
      liter: "1L",
      quantity: 10,
      category_id: 2,
      image: "https://via.placeholder.com/60"
    },
    {
      id: 3,
      title: "Toyuq Əti",
      description: "Təzə doğranmış toyuq",
      price: 4.5,
      stock: 80,
      discount: 0,
      weight: "2kg",
      number: 4,
      liter: "—",
      quantity: 15,
      category_id: 1,
      image: "https://via.placeholder.com/60"
    }
  ];

  function renderProducts() {
    productBody.innerHTML = "";
    products.forEach(product => {
      productBody.innerHTML += `
        <tr>
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>${product.description}</td>
          <td>${product.price} ₼</td>
          <td>${product.stock}</td>
          <td>${product.discount}%</td>
          <td>${product.weight}</td>
          <td>${product.number}</td>
          <td>${product.liter}</td>
          <td>${product.quantity}</td>
          <td>${product.category_id}</td>
          <td><img src="${product.image}" alt="${product.title}" style="width: 60px;"></td>
          <td>
            <button class="edit-btn" onclick="editProduct(${product.id})">Redaktə et</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Sil</button>
          </td>
        </tr>
      `;
    });
  }

  function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (confirm(`"${product.title}" məhsulunu silmək istədiyinizə əminsiniz?`)) {
      const index = products.findIndex(p => p.id === id);
      if (index > -1) {
        products.splice(index, 1);
        renderProducts();
      }
    }
  }

  function editProduct(id) {
    const product = products.find(p => p.id === id);
    alert(`"${product.title}" məhsulu redaktə edilir...`);
    // Burada modal və ya form əlavə oluna bilər
  }

  document.getElementById("add-product-btn").addEventListener("click", () => {
    productId++;
    const newProduct = {
      id: productId,
      title: `Yeni Məhsul ${productId}`,
      description: "Təsvir yoxdur",
      price: 0,
      stock: 0,
      discount: 0,
      weight: "0kg",
      number: 0,
      liter: "0L",
      quantity: 0,
      category_id: 1,
      image: "https://"
    };
    products.push(newProduct);
    renderProducts();
  });

  renderProducts();



  const modal = document.getElementById("product-modal");
const closeModal = document.getElementById("close-modal");
const form = document.getElementById("product-form");

document.getElementById("add-product-btn").addEventListener("click", () => {
  modal.style.display = "block";
});

closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  productId++;

  const newProduct = {
    id: productId,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    discount: parseInt(document.getElementById("discount").value),
    weight: document.getElementById("weight").value,
    number: parseInt(document.getElementById("number").value),
    liter: document.getElementById("liter").value,
    quantity: parseInt(document.getElementById("quantity").value),
    category_id: parseInt(document.getElementById("category_id").value),
    image: document.getElementById("image").value
  };

  products.push(newProduct);
  renderProducts();
  modal.style.display = "none";
  form.reset();
});





// user data table
const users = [
  {
    id: 1,
    full_name: "Aysel Əliyeva",
    email: "aysel@example.com",
    phone: "+994501234567",
    address: "Bakı, Azərbaycan",
    profl_img: "https://via.placeholder.com/60"
  },
  {
    id: 2,
    full_name: "Murad Məmmədov",
    email: "murad@example.com",
    phone: "+994551112233",
    address: "Gəncə, Azərbaycan",
    profl_img: "https://via.placeholder.com/60"
  }
];

function renderUsers() {
  const userBody = document.getElementById("user-body");
  userBody.innerHTML = "";
  users.forEach(user => {
    userBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.full_name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address}</td>
        <td><img src="${user.profl_img}" alt="Profil" style="width: 60px; border-radius: 50%;"></td>
      </tr>
    `;
  });
}

renderUsers();







// payment data
const payments = [
  {
    id: 1,
    full_name: "Elvin Məmmədov",
    email: "elvin@example.com",
    amount: "50 AZN",
    date: "2025-05-26",
    status: "paid"
  },
  {
    id: 2,
    full_name: "Aygün Qasımova",
    email: "aygun@example.com",
    amount: "120 AZN",
    date: "2025-05-25",
    status: "pending"
  },
  {
    id: 3,
    full_name: "Tamerlan Əliyev",
    email: "tamerlan@example.com",
    amount: "80 AZN",
    date: "2025-05-24",
    status: "failed"
  }
];


function renderPaymentsTable() {
  const tbody = document.getElementById("payment-body");
  tbody.innerHTML = "";

  payments.forEach(payment => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td data-label="ID">${payment.id}</td>
      <td data-label="İstifadəçi">${payment.full_name}</td>
      <td data-label="Email">${payment.email}</td>
      <td data-label="Məbləğ">${payment.amount}</td>
      <td data-label="Tarix">${payment.date}</td>
      <td data-label="Status">
        <span class="status-${payment.status}">
          ${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </span>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", renderPaymentsTable);



// Bu isə log out duynəsinə basanda login_to kecid edir 

  function handleLogout() {



    window.location.href = "login_to_admin.html";
  }
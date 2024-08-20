const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];
const modal = document.getElementById("modal");
const secondModal = document.getElementById("second-modal");
const filterContainer = document.querySelector("#filters");
const navbarContainer = document.querySelector("#navbarContainer");

// Étape 1.1 : Appel API pour les travaux (galeries)
const getWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  works = await response.json();
  createGallery(works);
  createGallery2(works);
};

// Étape 2.1 : Appel API pour les catégories (filtres)
const getCategory = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();
  filterWorks();
};

//Étape 4.3 : Création de la première modale
const createGallery2 = (newWork) => {
  modal.classList.add("edit-modal2");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2 class="modal-title">Galerie photo</h2>
      <div id="gallery" class="tab-content active"></div>
      <hr class="separator">
      <button class="add-photo-btn">Ajouter une photo</button>
    </div>
  `;
  const galleryContainer = document.querySelector("#gallery");
  galleryContainer.innerHTML = "";
  newWork.forEach((item) => {
    const projectElement = document.createElement("div");
    projectElement.className = "gallery-item";
    projectElement.dataset.imageId = item.id;
    projectElement.innerHTML = `
      <div class="delete-icon">
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <img src="${item.imageUrl}" alt="${item.title}">
    `;
    galleryContainer.appendChild(projectElement);
  });

  // Étape 4.4 : Suppression d'un projet de la galley & message d'erreur
  const deleteWork = async (workId) => {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Une erreur est survenue");
    }
    const index = newWork.findIndex((work) => work.id == workId);
    if (index !== -1) {
      newWork.splice(index, 1);
      createGallery(newWork);
      createGallery2(newWork);
    }
  };

  const deleteIcons = document.querySelectorAll(".delete-icon");
  deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", async () => {
      const workId = deleteIcon.parentElement.dataset.imageId;
      await deleteWork(workId);
    });
  });

  attachModalEvents();
};

// Étape 4.1 : Affichage première modale
const createModal = () => {
  modal.classList.remove("edit-modal2");
  modal.classList.add("edit-modal");
  modal.style.display = "flex";

  attachModalEvents();
};

// Étape 5.2 : Création de la seconde modale
const createSecondModal = (event) => {
  event.preventDefault();

  secondModal.className = "add-modal";
  secondModal.style.display = "flex";
  secondModal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <span class="fa fa-arrow-left back-btn"></span>
      <h2 class="modal-title">Ajout photo</h2>
      <form id="add-picture-form" class="add-picture-form">
        <div class="add-pic-container">
        <i class="fa-regular fa-image img-logo"></i>
          <img src="#" class="" id="preview-img" alt="">
          <input type="file" class="input-file-btn" id="input-file-btn">
          <label for="input-file-btn">+ Ajouter photo</label>
          <p>jpg, png : 4mo max</p>
        </div>
        <label for="picture-title" class="label-form">Titre</label>
        <input type="text" id="picture-title" class="title-and-categorie">
        <label for="category-select" class="label-form">Catégorie</label>
        <select name="category" id="category-select" class="title-and-categorie">
          <option value=""></option>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hotels & restaurants</option>
        </select>
        <hr class="separator">
        <button type="submit" class="submit-pic">Valider</button>
        <div class="error-message" style="color: red; display: none;">Tous les champs sont obligatoires.</div>
      </form>
    </div>
  `;

  // Étape 5.3 : Evenements de fermeture de la seconde modale
  const closeBtn = secondModal.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    secondModal.style.display = "none";
  });

  const backBtn = secondModal.querySelector(".back-btn");
  backBtn.addEventListener("click", () => {
    secondModal.style.display = "none";
    modal.style.display = "flex";
  });

  window.addEventListener("click", (e) => {
    if (e.target == secondModal) {
      secondModal.style.display = "none";
      modal.style.display = "none";
    }
  });

  // Étape 5.6 : Prévisualisation de l'image upload & cacher les anciens elements
  const inputFile = document.getElementById("input-file-btn");
  inputFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewImg = document.getElementById("preview-img");
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        document.querySelector(".add-pic-container i").style.display = "none";
        document.querySelector(".add-pic-container label").style.display =
          "none";
        document.querySelector(".add-pic-container p").style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  // Etape 5.4 : Envoi d'un nouveau projet via le formulaire
  const form = secondModal.querySelector("#add-picture-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const photoFile = document.getElementById("input-file-btn").files[0];
    const photoTitle = document.getElementById("picture-title").value;
    const photoCategory = document.getElementById("category-select").value;
    const errorMessage = document.querySelector(".error-message");

    if (!photoFile || !photoTitle || !photoCategory) {
      errorMessage.style.display = "block";
      errorMessage.style.textAlign = "center";
      errorMessage.style.marginTop = "10px";
      return;
    } else {
      errorMessage.style.display = "none";
    }

    await addWork(photoFile, photoTitle, photoCategory);
  });
};

//Étape 4.2 : Fermeture des modales
const attachModalEvents = () => {
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      secondModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
  // Étape 5.1 : Bouton de la seconde modale
  const secondModalBtn = document.querySelector(".add-photo-btn");
  if (secondModalBtn) {
    secondModalBtn.addEventListener("click", createSecondModal);
  }
};

// Étape 5.5 : Vérification de l'upload
const addWork = async (photoFile, photoTitle, photoCategory) => {
  const formData = new FormData();
  formData.append("image", photoFile);
  formData.append("title", photoTitle);
  formData.append("category", photoCategory);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Une erreur est survenue lors de l'ajout du travail");
  }
  // Étape 5.7 : Affichage du projet et fermeture de la modale
  const newWork = await response.json();
  works.push(newWork);
  createGallery(works);
  createGallery2(works);
  modal.style.display = "none";
  secondModal.style.display = "none";
};

// Étape 4.1 : Selection du bouton & ajout d'un evenement
const btnModal = document.querySelector(".editBtn");
btnModal.addEventListener("click", createModal);

// Étape 1.2 : Afficher les travaux en JavaScript
const createGallery = (newWork) => {
  gallery.innerHTML = "";
  newWork.forEach((work) => {
    const workElement = document.createElement("div");
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <div class="work-info">
        <figcaption>${work.title}</figcaption>
      </div>
    `;
    gallery.appendChild(workElement);
  });
};
// Étape 2.2 : Affichage bouton "TOUS"
const filterWorks = () => {
  const allButton = document.createElement("button");
  allButton.innerHTML = "Tous";
  allButton.setAttribute("value", "all");
  allButton.classList.add("filtersBtn");
  allButton.addEventListener("click", () => {
    gallery.innerHTML = "";
    allButton.classList.add("filtersBtnSelec");
    const filterButtons = document.querySelectorAll(".filtersBtn");
    filterButtons.forEach((filterButton) => {
      if (filterButton !== allButton) {
        filterButton.classList.remove("filtersBtnSelec");
      }
    });
    createGallery(works);
  });

  filterContainer.appendChild(allButton);

  // Étape 2.3 : Affichage d'un bouton par catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.innerHTML = category.name;
    button.setAttribute("value", category.id);
    button.classList.add("filtersBtn");
    filterContainer.appendChild(button);

    button.addEventListener("click", () => {
      const value = button.getAttribute("value");
      const filteredWorks = works.filter((work) => work.categoryId == value);
      gallery.innerHTML = "";
      button.classList.add("filtersBtnSelec");
      const filterButtons = document.querySelectorAll(".filtersBtn");
      filterButtons.forEach((item) => {
        if (item !== button) {
          item.classList.remove("filtersBtnSelec");
        }
      });
      createGallery(filteredWorks);
    });
  });
};
// Etape 3 : Admin mode
const adminMode = () => {
  const isLoggedIn = localStorage.getItem("accessToken");

  const link = document.getElementById("authLink");
  const navbar = document.createElement("div");
  navbar.classList.add("navbar");

  const logo = document.createElement("i");
  logo.classList.add("fas", "fa-pen-to-square");

  const modeEdition = document.createElement("span");
  modeEdition.textContent = "Mode édition";

  navbar.appendChild(logo);
  navbar.appendChild(modeEdition);
  navbarContainer.appendChild(navbar);

  if (isLoggedIn) {
    navbar.style.display = "flex";
    filterContainer.style.display = "none";
    link.textContent = "logout";
    link.href = "#";
  } else {
    navbar.style.display = "none";
    btnModal.style.display = "none";
    link.textContent = "login";
    link.href = "login.html";
  }

  link.addEventListener("click", (event) => {
    if (isLoggedIn) {
      event.preventDefault();
      localStorage.removeItem("accessToken");
      link.textContent = "login";
      link.href = "login.html";
      location.reload();
    }
  });
};

adminMode();
getCategory();
getWorks();

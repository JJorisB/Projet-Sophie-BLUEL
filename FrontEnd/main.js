const gallery = document.querySelector('.gallery');
let works = [];
let categories = [];
const modal = document.getElementById('modal');
const secondModal = document.getElementById('second-modal');

const getWorks = async () => {
  const response = await fetch('http://localhost:5678/api/works');
  console.log(response)

  works = await response.json();
  createGallery(works);
  createGallery2(works);
}

const getCategory = async () => {
  const response = await fetch('http://localhost:5678/api/categories');

  categories = await response.json();
  console.log(categories);
  filterWorks();
}


const createGallery2 = (newWork) => {
  modal.classList.add('edit-modal2');
  modal.innerHTML = "";
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
  newWork.forEach(item => {
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


  const deleteWork = async (workId) => {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    if (!response.ok) {
      throw new Error('Une erreur est survenue');
    }
    const index = newWork.findIndex(work => work.id == workId);
    if (index !== -1) {
      newWork.splice(index, 1);
      createGallery(newWork);
      createGallery2(newWork);
    }
  }

  const deleteIcons = document.querySelectorAll('.delete-icon');
  deleteIcons.forEach(deleteIcon => {
    deleteIcon.addEventListener('click', async () => {
      const workId = deleteIcon.parentElement.dataset.imageId;
      await deleteWork(workId);
    });
  });
};

const createModal = () => {
  modal.classList.remove('edit-modal2');
  modal.classList.add('edit-modal');
  modal.style.display = "flex";

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
    secondModal.style.display = "none";
  });
  window.addEventListener('click', (e ) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  })


  const createSecondModal = (event) => {
    event.preventDefault();

    secondModal.className = "add-modal";
    secondModal.style.display = "flex";
    secondModal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <span class="fa fa-arrow-left back-btn"></span>
                <h2 class="modal-title">Ajout photo</h2>
                <form action="" method="get" class="add-picture-form">
                <div class="add-pic-container">
                    <img src="./assets/images/Vector-img.png" class="img-logo">
                    <input type="file" class="input-file-btn" id="input-file-btn">
                    <label for="input-file-btn">+ Ajouter photo</label>
                    <p>jpg, png : 4mo max</p>
                </div>
                <label for="picture-title" class="label-form">Titre</label>
                <input type="text" id="picture-title" class="title-and-categorie">
                <label for="category-select" class="label-form">Catégorie</label>
                <select name ="category" id="category-select" class="title-and-categorie">
                <option value=""></option>
                <option value="Objets">Objets</option>
                <option value="Appartements">Appartements</option>
                <option value="Hotels & restaurants">Hotels & restaurants</option>
                </select>
                <hr class="separator">
                <button class="submit-pic">Valider</button>
                </form>
            </div>
        `;

    const photoFile = document.getElementById('input-file-btn').files[0];
    const photoTitle = document.getElementById('picture-title').value;
    const photoCategory = document.getElementById('category-select').value;

    photoFile.addEventListener('change', (e) => {
      console.log(photoFile);
    });

    photoFile.addEventListener('change', (e) => {
      console.log(photoTitle);
    })


    const closeBtn = secondModal.querySelector(".close-btn");
    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
      secondModal.style.display = "none";
    });
    window.addEventListener('click', (e ) => {
      if (e.target == secondModal) {
        secondModal.style.display = "none";
        modal.style.display = "none";
      }
    })
  };

  const secondModalBtn = document.querySelector('.add-photo-btn');
  secondModalBtn.addEventListener('click', createSecondModal);
}


const btnModal = document.querySelector('.editBtn');
btnModal.addEventListener('click', createModal);


const createGallery = (newWork) => {
  gallery.innerHTML = '';
  newWork.forEach(work => {
    const workElement = document.createElement('div');
    workElement.innerHTML = ""
    workElement.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <div class="work-info">
                <figcaption>${work.title}</figcaption>
            </div>
        `;
    gallery.appendChild(workElement);
  });
}

const filterWorks = () => {
  const filterContainer = document.querySelector('#filters');
  const allButton = document.createElement('button');
  allButton.innerHTML = 'Tous';
  allButton.setAttribute('value', 'all');
  allButton.classList.add("filtersBtn");
  allButton.addEventListener('click', () => {
    gallery.innerHTML = '';
    allButton.classList.add("filtersBtnSelec");
    const filterButtons = document.querySelectorAll('.filtersBtn');
    filterButtons.forEach(filterButton => {
      if (filterButton !== allButton) {
        filterButton.classList.remove("filtersBtnSelec");
      }
    });
    createGallery(works);
  });

  filterContainer.appendChild(allButton);

  categories.forEach(category => {
    const button = document.createElement('button');
    button.innerHTML = category.name;
    button.setAttribute('value', category.id);
    button.classList.add("filtersBtn");
    filterContainer.appendChild(button);

    button.addEventListener('click', () => {
      const value = button.getAttribute('value');
      const filteredWorks = works.filter(work => work.categoryId == value);
      gallery.innerHTML = '';
      button.classList.add("filtersBtnSelec");
      const filterButtons = document.querySelectorAll('.filtersBtn');
        filterButtons.forEach(item => {
            if (item !== button) {
            item.classList.remove("filtersBtnSelec");
            }
        });
      createGallery(filteredWorks);
    });

  });
}



getCategory()
getWorks();
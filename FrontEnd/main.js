const gallery = document.querySelector('.gallery');
let works = [];
let categories = [];

const getWorks = async () => {
  const response = await fetch('http://localhost:5678/api/works');
  console.log(response)

  works = await response.json();
  createGallery(works);
}

const getCategory = async () => {
  const response = await fetch('http://localhost:5678/api/categories');

  categories = await response.json();
  console.log(categories);
  filterWorks();
}



const createGallery = (newWork) => {
  newWork.forEach(work => {
    const workElement = document.createElement('div');
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
      createGallery(filteredWorks);
    });

  });
}



getCategory()
getWorks();
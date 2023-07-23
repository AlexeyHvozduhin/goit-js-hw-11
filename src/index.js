import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const API_KEY = '38417581-6d699f2852f40bcdc4fffe66a';
const BASE_URL =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal&safesearch=true&key=38417581-6d699f2852f40bcdc4fffe66a&per_page=40';
const BASE_KEY = '38417581-6d699f2852f40bcdc4fffe66a';

// https://pixabay.com/api/?key=38417581-6d699f2852f40bcdc4fffe66a&image_type=photo&orientation=horizontal&safesearch=true&q=yellow+flowers

const serchForm = document.getElementById('search-form');
const gallery = document.querySelector('div.gallery');

const inputSerch = serchForm.firstElementChild;
const buttonSerch = serchForm.lastElementChild;
const buttonLeadMore = document.querySelector('.load-more');

function fetches(request) {
  return fetch(`${BASE_URL}&q=${request}`)
    .then(response => {
      if (!response.ok) {
        gallery.innerHTML = ' ';
        Notiflix.Notify.failure(`Ошибка: ${response.status}`);
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (!(data.hits == '')) {
        if (page == 2)
          Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createGallery(data.hits);

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 0.65,
          behavior: 'smooth',
        });

        if (gallery.children.length == data.totalHits) {
          buttonLeadMore.style.display = 'none';
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
    })
    .catch(error => {
      gallery.innerHTML = ' ';
      Notiflix.Notify.failure('Ошибка (РАЗОБРАТЬСЯ ИЗ-ЗА ЧЕГО)');
      console.log(error);
    });
}

function formatNumber(num) {
  const abbreviations = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  for (let i = 0; i < abbreviations.length; i++) {
    if (num >= abbreviations[i].value) {
      return (
        (num / abbreviations[i].value).toFixed(1) + abbreviations[i].symbol
      );
    }
  }

  return num;
}

function createGallery(hits) {
  const array = [];
  for (let i = 0; i < hits.length; i++) {
    const div = document.createElement('div');
    div.className = 'photo-card';
    div.innerHTML = `
  <a class="gallery-link" href=${hits[i].largeImageURL} onclick="return false;">
  <img src="${hits[i].webformatURL}" alt="${
      hits[i].tags
    }" loading="lazy" class="photo-img"/>
  </a>
  <div class="info">
  
    <div>
  <span class="span span-like"></span>
    <p class="info-item">
    ${formatNumber(hits[i].likes)}
    </p>
    </div>

    <div>
  <span class="span span-view"></span>
    <p class="info-item">
    ${formatNumber(hits[i].views)}
    </p>
    </div>    
    
    <div>
  <span class="span span-comment"></span>
    <p class="info-item">
    ${formatNumber(hits[i].comments)}
    </p>
    </div>    
    
    <div>
  <span class="span span-download"></span>
    <p class="info-item">
    ${formatNumber(hits[i].downloads)}
    </p>
    </div>
    
</div>`;
    array.push(div);
  }
  gallery.append(...array);
  lightbox.refresh();
  buttonLeadMore.style.display = 'block';
}

// Стандартизировать запрос. Вместо пробелов - плюсы, все буквы маленькие, и тд
function standardizationOfRequest(request) {
  return request.toLowerCase().replace(/\s+/g, '+');
}
// Снять стандартное поведение для формы
serchForm.addEventListener('submit', event => {
  event.preventDefault();
});

// Отправить запрос, который уже стандартизирвоан
let page = 1;

buttonSerch.addEventListener('click', () => {
  buttonLeadMore.style.display = 'none';
  gallery.innerHTML = ' ';
  page = 2;
  fetches(standardizationOfRequest(inputSerch.value));
});

//
buttonLeadMore.style.display = 'none';

buttonLeadMore.addEventListener('click', () => {
  fetches(`${standardizationOfRequest(inputSerch.value)}&page=${page}`);
  page += 1;
});

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: `alt`,
});

import cardMarkupTpl from '../../templates/cardMarkupTpl.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryAPIService from './api-service';
import LodashThrottle from 'lodash.throttle';
import getRefs from './get-refs';
import WheelIndicator from 'wheel-indicator';

const refs = getRefs();

refs.form.addEventListener('submit', onSearch);
(() => {
  window.addEventListener('scroll', LodashThrottle(checkPosition, 500));
  window.addEventListener('resize', LodashThrottle(checkPosition, 500));
})();

const galleryAPIService = new GalleryAPIService();

function onSearch(e) {
  e.preventDefault();
  resetGalleryContainer();
  galleryAPIService.itemQuery = e.currentTarget.elements.searchQuery.value;
  if (galleryAPIService.itemQuery === '') {
    return alert('Please let us know Your query item');
  }
  galleryAPIService.onFoundNotify();
  galleryAPIService.resetPage();
  embedGallery();
}

async function checkPosition() {
  // Нам потребуется знать высоту документа и высоту экрана:
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  // Они могут отличаться: если на странице много контента,
  // высота документа будет больше высоты экрана (отсюда и скролл).

  // Записываем, сколько пикселей пользователь уже проскроллил:
  const scrolled = window.scrollY;

  // Обозначим порог, по приближении к которому
  // будем вызывать какое-то действие.
  // В нашем случае — четверть экрана до конца страницы:
  const threshold = height - screenHeight / 1;

  // Отслеживаем, где находится низ экрана относительно страницы:
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    // Если мы пересекли полосу-порог, вызываем нужное действие.
    try {
      await embedGallery();
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

async function embedGallery() {
  try {
    const { hits } = await galleryAPIService.fetchGallery();
    const markup = await refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      cardMarkupTpl(hits)
    );
    await gallerySlider();
    await smoothScroll();
    return markup;
  } catch (error) {
    console.log(error);
  }
}

function resetGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function gallerySlider() {
  var lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Scroll direction

// const indicator = new WheelIndicator({
//   elem: document.querySelector('.gallery'),
//   callback: function (e) {
//     console.log('e.direction', e.direction);
//     if (e.direction === 'down') {
//       // embedGallery();
//     }
//     return;
//   },
// });
// indicator.setOptions({ preventMouse: false });

// import 'material-icons/iconfont/material-icons.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { UnsplashAPI } from './unsplushAPI';
import { createMarkup } from './unsplushMarkup';
// import { refs } from './refs';

const refs = {
  form: document.querySelector('.js-search-form'),
  list: document.querySelector('.js-gallery'),
  loadMoreBtn: document.querySelector('.js-more'),
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const unsplash = new UnsplashAPI();

function handleSubmit(e) {
  e.preventDefault();
  clearPage();
  const {
    elements: { query },
  } = e.currentTarget;
  const searchQuery = query.value.trim().toLowerCase();
  query.value = '';
  if (!searchQuery) {
    return Notify.failure('Input your query please');
  }
  unsplash.query = searchQuery;
  unsplash
    .getPhotos()
    .then(({ results, total }) => {
      if (results.length === 0) {
        return Notify.info(`No images for ${searchQuery} found`);
      }
      const markUp = createMarkup(results);
      refs.list.insertAdjacentHTML('beforeend', markUp);
      unsplash.calculateTotalPages(total);
      Notify.success(
        `Found ${total} images upon your request for ${searchQuery}`
      );
      if (unsplash.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message, 'Ooops, please try again');
      clearPage();
    });
}

function onLoadMore() {
  unsplash.incrementPage();
  if (unsplash.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
  unsplash
    .getPhotos()
    .then(({ results }) => {
      const markUp = createMarkup(results);
      refs.list.insertAdjacentHTML('beforeend', markUp);
    })
    .catch(error => {
      Notify.failure(error.message, 'Ooops, please try again');
      clearPage();
    });
}

function clearPage() {
  unsplash.resetPage();
  refs.list.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

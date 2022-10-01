import { fetchMovies } from './fetchMovies';
import movieCardTpl from '../../../templates/movieCardTpl.hbs';

// Написати функцію getFilmsDescriptionByQuery яка буде приймати query і повертати ПОВНИЙ опис для знайдених фільмів
// themoviedb API повертає масив фільмів при пошуку по квері, але там не повна інформація, тому нам потрібно зробити запит за фільмами по пошуковому слову
// потім отримавшии масив всіх знайдений фільмів забрати їх айдішніки і за допомогою Promise.all зробити запит за кжним фільмом по його айдішніку
// отримавши потрібні дані, зарендеріть фільми в список movies (створіть в HTML ul з классом movies)
// Розмітка li одного фільма
//        `
// <li class="movies-item">
//    <h3 class="movie-original-title"></h3>
//    <img class="movie-image" src="" alt="" >
//    <p class="movie-status">Status: </p>
//    <p class="movie-overview"></p>
//    <p class="movie-vote-avarage">Vote avarage: </p>
//    <p class="movie-runtime">Runtime:  minutes</p>
//    <p>Production companies:</p>
//    <ul class="movie-production-companies">
//        <li class="production-companies-item-name"></li>;
//    </ul>
// </li>
//
// Дані для запиту за фільмами

// url для пошука фільмів по query `${URL}/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
// url для пошука повної інформації по фільму за його айдішніком `${URL}/3/movie/${movieId}?api_key=${API_KEY}`
// BASE_POSTER_URL базова урла до якої потрібно додати poster_path щоб отримати повний шлях до постера

// скріншот приблизного вигляду списка фільмів https://prnt.sc/JpsuSfNFDuDX

// мінімальні стилі

const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/w500';

const refs = {
  container: document.querySelector('.movie-container'),
};

getFilmsDescriptionByQuery('Tarzan');

function getFilmsDescriptionByQuery(query) {
  if (query) {
    fetchMovies(query)
      .then(fetchByID)
      .catch(onFetchError)
      .finally(() => {});
  }
  refs.container.innerHTML = '';
  return;
}

function fetchByID({ results }) {
  if (Promise.all(results)) {
    return Promise.all(results)
      .then(renderMovieCard)
      .catch(onFetchError)
      .finally(() => {});
  }
}

function renderMovieCard(results) {
  const markupMovie = results.map(movie => {
    return movieCardTpl(movie);
  });
  refs.container.innerHTML = markupMovie;
}

function onFetchError(error) {
  console.log(error);
}

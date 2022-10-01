const URL = 'https://api.themoviedb.org';
const API_KEY = '1a277fcd67d620e5e54e2f4f933a05d4';

export const fetchMovies = query => {
  return fetch(
    `${URL}/3/search/movie?api_key=${API_KEY}&query=${query}&page=1`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};

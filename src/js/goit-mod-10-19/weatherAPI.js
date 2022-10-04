import { format } from 'date-fns';

const API_KEY = '1f681b215f392ce6ae4f5c3ab03a5214';
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;
const searchParams = new URLSearchParams({
  appid: API_KEY,
  units: 'metric',
});

const formRef = document.querySelector('.js-search-form');
const weatherWrapper = document.querySelector('.weather__wrapper');

formRef.addEventListener('submit', handleSubmit);

function getWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&${searchParams} `;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Ошибка данных');
    }
    return response.json();
  });
}

function getWeatherByLocationName(name) {
  const url = `${BASE_URL}?q=${name}&${searchParams} `;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Ошибка данных');
    }
    return response.json();
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const { location } = e.currentTarget.elements;
  const site = location.value.trim().toLowerCase();
  if (!site) {
    alert('Input location name please');
    return;
  }
  getWeatherByLocationName(site)
    .then(data => {
      const markup = createMarkup(data);
      weatherWrapper.innerHTML = markup;
    })
    .catch(error => console.log('error.message', error.message));
  e.currentTarget.reset();
}

navigator.geolocation.getCurrentPosition(({ coords }) => {
  const { latitude, longitude } = coords;
  getWeatherByCoords(latitude, longitude)
    .then(data => {
      const markup = createMarkup(data);
      weatherWrapper.innerHTML = markup;
    })
    .catch(error => console.log('error.message', error.message));
});

function createMarkup({ name, weather, main, sys, clouds }) {
  console.log(weather[0].main);
  console.log(weather[0].description);
  console.log(weather[0].icon);
  console.log(main.temp);
  console.log(main.feels_like);
  const sunrise = format(new Date(sys.sunrise * 1000), 'HH:mm');
  const sunset = format(new Date(sys.sunset * 1000), 'HH:mm');

  return /*html*/ `<div class="weather__card">
      <h2 class="city-name">${name}</h2>
      <ul class="weather-info list">
          <li class="weather-info-item">
              <p class="temp">Температура: ${main.temp} <sup>&#176;</sup>С</p>
          </li>
          <li class="weather-info-item">
              <p class="feels-like-temp">Відчувається як: ${main.feels_like} <sup>&#176;</sup>С</p>
          </li>
          <li class="weather-info-item">
              <p class="sunrise-time">Схід сонця: ${sunrise}</p>
          </li>
          <li class="weather-info-item">
              <p class="sunset-time">Захід сонця: ${sunset}</p>
          </li>
          <li class="weather-info-item">
              <p class="clouds">Хмарність: ${clouds.all}%</p>
          </li>
          <li><img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" /></li>
      </ul>
  </div>`;
}

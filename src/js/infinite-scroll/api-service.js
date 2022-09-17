import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29248542-cea93977a5234fa0e2d1b3dfd';

export default class GalleryAPIService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.hitsCount = null;
    // Какая страница следующая:
    this.nextPage = this.page + 1;
    // Если отправили запрос, но ещё не получили ответ,
    // не нужно отправлять ещё один запрос:
    this.isLoading = false;
    // Если контент закончился, вообще больше не нужно
    // отправлять никаких запросов:
    this.shouldLoad = true;
  }

  async fetchGallery() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
      fields: [
        'webformatURL',
        'largeImageURL',
        'tags',
        'likes',
        'views',
        'comments',
        'downloads',
      ],
    });

    const url = `${BASE_URL}?${searchParams}`;

    try {
      // Если мы уже отправили запрос, или новый контент закончился,
      // то новый запрос отправлять не надо:
      if (this.isLoading || !this.shouldLoad) return;
      // Предотвращаем новые запросы, пока не закончится этот:
      this.isLoading = await true;
      const response = await axios.get(url);
      await this.incrementPage();
      // Если мы увидели, что контент закончился,
      // отмечаем, что больше запрашивать ничего не надо:
      if (!this.nextPage) this.shouldLoad = await false;
      // Когда запрос выполнен и обработан,
      // снимаем флаг isLoading:
      this.isLoading = await false;
      return await response.data;
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  async onFoundNotify() {
    const { totalHits } = await this.fetchGallery();
    if (!totalHits) {
      return await Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return await Notiflix.Notify.success(
      `Hooray! We found ${totalHits} images.`
    );
  }

  get itemQuery() {
    return this.query;
  }

  set itemQuery(newQuery) {
    this.query = newQuery;
  }
}

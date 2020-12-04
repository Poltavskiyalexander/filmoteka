import templateHeader from '../templates/header.hbs';
import templateSectionCards from '../templates/section__cards.hbs';
import templateFooter from '../templates/hooter.hbs';

import pagination from '../components/pagination';
import medb from '../lib/ApiMEDB';

const dataBuild = ({ results }, genres) => {
  /** Функция добавляет в полученные с
   *  сервера данные поля year в котором
   *  будет храниться год выхода фильма и
   *  genres в котором будет хранится массив
   *  с данными о жанрах вида {id, name}
   *
   */
  const resultsArray = [...results];
  resultsArray.forEach(filmObj => {
    filmObj.year = filmObj.release_date.slice(0, 4);
    filmObj.genres = [];
    filmObj.genre_ids.forEach(id => {
      const genrObj = genres.find(item => item.id === id);
      filmObj.genres.push(genrObj);
    });
  });
  return resultsArray;
};

const init = async (params, query) => {
  console.log(params);
  console.log(`params: ${query}`);
  debugger;
  const currentPage = params.split('=')[1];
  const data = await medb.getPopularFilms(currentPage);
  const { genres: genresArr } = await medb.getGenresList();
  const results = dataBuild(data, genresArr);
  const duffElem = document.createElement('div');

  duffElem.insertAdjacentHTML('beforeend', templateHeader());
  duffElem.insertAdjacentHTML('beforeend', templateSectionCards(results));
  duffElem.insertAdjacentHTML('beforeend', pagination(data));
  duffElem.insertAdjacentHTML('beforeend', templateFooter());

  duffElem.querySelector('.search__navLibrary').remove();
  duffElem.querySelector('header').classList.add('header__img-home');

  return duffElem.innerHTML;
};
export default init;

const submitHandler = async event => {
  event.preventDefault();
  const searchQuery = event.target.querySelector('input[name="text"]').value;
  const textError = document.querySelector('.search__libraryFilmList');

  if (searchQuery !== '') {
    const data = await medb.getFilmsQuery(searchQuery);
    console.log(data);
    const { total_results } = data;
    if (total_results === 0) {
      textError.classList.remove('headen');
      console.log(
        'Search result not successful. Enter the correct movie name and',
      );
    } else {
      console.log(`${total_results}кол фильмов`);
      event.target.reset();
    }
    console.log(searchQuery);
  }
};

const hideErrorHandler = event => {
  event.preventDefault();
  const textError = document.querySelector('.search__libraryFilmList');
  textError.classList.add('headen');
};

export const addEventHandlers = () => {
  document
    .querySelector('.form-search')
    .addEventListener('submit', submitHandler);

  document
    .querySelector('input[name="text"]')
    .addEventListener('click', hideErrorHandler);
};

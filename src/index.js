import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import 'notiflix/dist/notiflix-3.2.6.min.css';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onSearchChange, DEBOUNCE_DELAY));

function onSearchChange(e) {
  const inputValue = e.target.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(result => {
        if (result.length > 10) {
          listEl.innerHTML = '';

          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (result.length >= 2 && result.length <= 10) {
          console.log(result);
          divEl.innerHTML = '';
          const listItems = result.reduce(
            (acc, { flags: { svg: flag }, name: { common: countryName } }) =>
              acc +
              `<li class = "list-item"><img class='list-img' src="${flag}" alt="Flag of ${countryName}">  ${countryName}</li>`,
            ''
          );
          listEl.innerHTML = listItems;
        } else if (result.length === 1) {
          console.log(result);
          listEl.innerHTML = '';
          const {
            flags: { svg: flag },
            name: { common: countryName },
            capital,
            population,
            languages,
          } = result[0];

          const countryItem = `<h2><img class="item-img" src="${flag}" alt="Flag of ${countryName}" />${countryName}</h2>
<ul>
  <li><b>Capital:</b> ${capital.join(', ')}</li>
  <li><b>Population:</b> ${population}</li>
  <li><b>Languages:</b> ${Object.values(languages).join(', ')}</li>
</ul>`;
          divEl.innerHTML = countryItem;
        }
      })
      .catch(error => {
        console.dir(error);
        if (error.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else {
          Notiflix.Notify.failure(
            'Something went wrong.Try again in few minutes'
          );
        }
      });
  } else {
    divEl.innerHTML = '';
    listEl.innerHTML = '';
  }
}

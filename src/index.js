import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(getCountryData, DEBOUNCE_DELAY));

function getCountryData(event) {
  removeMarkup(countryListRef);
  removeMarkup(countryInfoRef);
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    return;
  }
  fetchCountries(searchQuery)
    .then(data => {
      if (data.length === 1) {
        showCountryItem(data);
      } else if (data.length >= 2 && data.length <= 10) {
        showCountriesList(data);
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
}

function showCountryItem(countryArr) {
  const itemElMarkup = countryArr
    .map(
      ({ flags, name, capital, population, languages }) =>
        `
        <div>
          <img width="100px" height="60px" src="${flags.svg}" alt="flag" />
          <h2 class="country-title">${name.official}</h2>
        </div>
        <ul>
          <li>
            <strong>Capital:</strong> <span>${capital}</span>
          </li>
          <li>
            <strong>Population:</strong> <span>${population}</span>
          </li>
          <li>
            <strong>Languages:</strong> <span>${Object.values(languages)}</span>
          </li>
        </ul>
        `
    )
    .join('');
  countryInfoRef.innerHTML = itemElMarkup;
}

function showCountriesList(countriesArr) {
  const itemsElMarkup = countriesArr
    .map(
      ({ flags, name }) =>
        `
      <li class='country-item'>
        <img width=50px height=30px src="${flags.svg}" alt="flag"/>
        <p>${name.official}</p>
      </li>
      `
    )
    .join('');
  countryListRef.innerHTML = itemsElMarkup;
}

function removeMarkup(element) {
  element.innerHTML = '';
}

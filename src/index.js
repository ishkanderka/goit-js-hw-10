import './css/styles.css';
import fetchCountry from './js/fetch-country';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(event => {
    event.preventDefault();
    const inputValue = event.target.value.trim();
    if (!inputValue) {
      clearCountryList();
      return;
    }
    fetchCountry(inputValue).then(handleResponse).catch(fetchError);
  }, DEBOUNCE_DELAY)
);

function handleResponse(name) {
  if (name.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    clearCountryList();
  } else if (name.length > 1) {
    renderCountryList(name);
    clearCountryInfo();
  } else {
    clearCountryList();
    renderCountryInfo(name);
  }
}

function renderCountryList(name) {
  const markup = name
    .map(({ name, flags }) => {
      return `
          <h2> 
          <img src="${flags.svg}" alt="flag" width="40">  
          ${name.official}</h2>
       `;
    })
    .join('');
  countryList.innerHTML = markup;
}
function renderCountryInfo(name) {
  const markup = name
    .map(({ name, capital, population, flags, languages }) => {
      return `
          <h2> 
          <img src="${flags.svg}" alt="flag" width="40">  
          ${name.official}</h2>
          <p><b>Capital</b>: ${capital}</p>
          <p><b>Population</b>: ${population}</p>
          <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>
       `;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function fetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  clearCountryList();
  clearCountryInfo();
}

function clearCountryList() {
  countryList.innerHTML = '';
}
function clearCountryInfo() {
  countryInfo.innerHTML = '';
}

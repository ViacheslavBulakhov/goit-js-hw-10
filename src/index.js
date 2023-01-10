import './css/styles.css';
import Notiflix from 'notiflix';
// import fetch from './js/components/fetchCountries';
let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    ul: document.querySelector('ul.country-list'),
    country: document.querySelector('div.country-info')
}
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();
    resetHtml()
    if (refs.input.value === '') {
        return;
    }
    fetchCountries();
}
function fetchCountries() {
    let name = refs.input.value.trim();
    fetch(`https://restcountries.com/v3.1/name/${name}?fields=capital,name,population,flags,languages`)
    .then(response => {
        return response.json();
    })
        .then(data => {
            const quantityCountry = data.length;
        if (quantityCountry > 10) {
            Notiflix.Notify.warning("Too many matches found. Please enter a more specific name.");
            return
        }
        if (quantityCountry >= 2 && quantityCountry < 10) {
            createCountryList(data)
            return;
        }
        countryInfo(data)
    });
}
function createCountryList(data) {
    data.map((item) => {
        refs.ul.insertAdjacentHTML('beforeend', `
        <li>
            ${ representativeContry(item)}
        </li>`)
    })
}
function countryInfo(data) {
    
    data.map((item) => {
        const languagesByCountry = Object.values(item.languages).join(', ');

        refs.country.insertAdjacentHTML('beforeend', 
        `<div>${ representativeContry(item)}</div>
        <ul>
            <li>Capital: <span>${item.capital}</span></li>
            <li>Population: <span>${item.population}</span></li>
            <li>Languages: <span>${languagesByCountry}</span></li>
        </ul`)
    })
}
function representativeContry(item) {
        return    `<img
            width = "30px"
            height = "30px"
            src="${item.flags.svg}"
            alt="${item.name.official}">
            <h2>${item.name.official}</h2>`
}
function resetHtml() {
    refs.ul.innerHTML = '';
    refs.country.innerHTML = '';
}
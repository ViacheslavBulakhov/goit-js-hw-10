import './css/styles.css';
import Notiflix from 'notiflix';
import {fetchCountries} from './js/components/fetchCountries';
let debounce = require('lodash.debounce');
Notiflix.Notify.init({
    width: '500px',
    position: 'center-top',
    cssAnimationStyle: 'from-left',
    distance: '10px',
    opacity: 1,
    failure: {
        notiflixIconColor: '#000000',
        textColor: '#e8ecf1',
    }
});

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
    let name = e.target.value.trim();
    if (name === '') {
        return;
    }
    fetchCountries(name,Notiflix).then(checkupByQuantity)
}
function createCountryList(data) {
    data.map((item) => {
        refs.ul.insertAdjacentHTML('beforeend', `
        <li>
            ${representativeContry(item)}
        </li>`)
    })
}
function countryInfo(data) {
    data.map((item) => {
        const { languages, population, capital } = item;
        const languagesByCountry = Object.values(languages).join(', ');

        refs.country.insertAdjacentHTML('beforeend', 
        `<div>${ representativeContry(item)}</div>
        <ul>
            <li>Capital: <span>${capital}</span></li>
            <li>Population: <span>${population}</span></li>
            <li>Languages: <span>${languagesByCountry}</span></li>
        </ul`)
    })
}
function representativeContry({name,flags}) {
        return    `<img
            width = "30px"
            height = "30px"
            src="${flags.svg}"
            alt="${name.official}">
            <h2>${name.official}</h2>`
}
function resetHtml() {
    refs.ul.innerHTML = '';
    refs.country.innerHTML = '';
}
function checkupByQuantity(data) {
        const quantityCountry = data.length;
        if (quantityCountry > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return
        }
        if (quantityCountry >= 2 && quantityCountry < 10) {
            createCountryList(data)
            return;
        }
            countryInfo(data)
}
// function fetchCountries() {
//     let name = refs.input.value.trim();
//     fetch(`https://restcountries.com/v3.1/name/${name}?fields=capital,name,population,flags,languages`)
//         .then(response => {
//             if (!response.ok) {
//             Notiflix.Notify.failure("Oops, there is no country with that name")
//             }
//         return response.json();
//     })
//         .then(data => {
//             const quantityCountry = data.length;
//         if (quantityCountry > 10) {
//             Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
//             return
//         }
//         if (quantityCountry >= 2 && quantityCountry < 10) {
//             createCountryList(data)
//             return;
//         }
//             countryInfo(data)
//     });
// }
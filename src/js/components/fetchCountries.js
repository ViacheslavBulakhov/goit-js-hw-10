export  function fetchCountries(name,Notiflix) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=capital,name,population,flags,languages`)
        .then(response => {
        if (!response.ok) {
        Notiflix.Notify.failure("Oops, there is no country with that name")
        }
        return response.json();
        })
}

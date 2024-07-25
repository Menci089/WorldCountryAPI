document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const backButton = document.getElementById('back-button');
    const resultsContainer = document.querySelector('.results');
    const extraInfoContainer = document.querySelector('.extra-info');
    const filterSelect = document.getElementById('filter');
    const sortSelect = document.getElementById('sort');

    let countries = [];
    let filteredCountries = [];
    let currentCountryElement = null;

    const fetchCountries = async () => {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        filteredCountries = countries;
        renderCountries(filteredCountries);
    };

    const renderCountries = (countries) => {
        resultsContainer.innerHTML = '';
        countries.forEach(country => {
            const countryDiv = document.createElement('div');
            countryDiv.className = 'result-item';
            countryDiv.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common}">
                <div>
                    <strong>${country.name.common}</strong>
                </div>
            `;
            countryDiv.addEventListener('click', () => showCountryDetails(country, countryDiv));
            resultsContainer.appendChild(countryDiv);
        });
    };

    const showCountryDetails = (country, countryElement) => {
        if (extraInfoContainer.parentElement === countryElement) {
            extraInfoContainer.classList.toggle('hidden');
            return;
        }

        if (extraInfoContainer.parentElement) {
            extraInfoContainer.parentElement.removeChild(extraInfoContainer);
        }

        extraInfoContainer.innerHTML = `
            <h2>${country.name.common}</h2>
            <p class="info-title">Capital:</p> <p>${country.capital ? country.capital.join(', ') : 'N/A'}</p>
            <p class="info-title">Region:</p> <p>${country.region}</p>
            <p class="info-title">Subregion:</p> <p>${country.subregion}</p>
            <p class="info-title">Population:</p> <p>${country.population.toLocaleString()}</p>
            <p class="info-title">Area:</p> <p>${country.area.toLocaleString()} km²</p>
            <p class="info-title">Languages:</p> <p>${Object.values(country.languages).join(', ')}</p>
            <p class="info-title">Currencies:</p> <p>${Object.values(country.currencies).map(curr => curr.name).join(', ')}</p>
               <div class="info-divider"></div> <!-- Pembatas ditambahkan di sini -->
        `;
        
        extraInfoContainer.classList.remove('hidden');
        countryElement.appendChild(extraInfoContainer);
        currentCountryElement = countryElement;
        backButton.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
    };

    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();
        if (query) {
            filteredCountries = countries.filter(country => country.name.common.toLowerCase().startsWith(query));
            renderCountries(filteredCountries);
        } else {
            filteredCountries = countries;
            renderCountries(filteredCountries);
        }
    };

    const handleFilter = () => {
        const region = filterSelect.value;
        if (region === 'all') {
            filteredCountries = countries;
        } else {
            filteredCountries = countries.filter(country => country.region.toLowerCase() === region.toLowerCase());
        }
        renderCountries(filteredCountries);
    };

    const handleSort = () => {
        const sortBy = sortSelect.value;
        filteredCountries.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.common.localeCompare(b.name.common);
            } else if (sortBy === 'population') {
                return b.population - a.population;
            } else if (sortBy === 'area') {
                return b.area - a.area;
            }
        });
        renderCountries(filteredCountries);
    };

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleSearch);
    filterSelect.addEventListener('change', handleFilter);
    sortSelect.addEventListener('change', handleSort);
    backButton.addEventListener('click', () => {
        extraInfoContainer.classList.add('hidden');
        if (currentCountryElement) {
            currentCountryElement.removeChild(extraInfoContainer);
            currentCountryElement = null;
        }
        resultsContainer.classList.remove('hidden');
        backButton.classList.add('hidden');
        searchInput.value = '';
        filteredCountries = countries;
        renderCountries(filteredCountries);
    });

    fetchCountries();
});

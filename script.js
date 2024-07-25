document.addEventListener('DOMContentLoaded', () => {
    populateCountrySelect();
});

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        fetchCountries(query);
        document.getElementById('back-button').style.display = 'block';
        document.getElementById('country-select').style.display = 'none';
        document.getElementById('autocomplete-results').style.display = 'none';
    }
});

document.getElementById('search-input').addEventListener('input', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        showAutocomplete(query);
    } else {
        document.getElementById('autocomplete-results').innerHTML = '';
        document.getElementById('back-button').style.display = 'none';
        document.getElementById('country-select').style.display = 'block';
    }
});

document.getElementById('country-select').addEventListener('change', () => {
    const selectedCountry = document.getElementById('country-select').value;
    if (selectedCountry) {
        fetchCountries(selectedCountry);
        document.getElementById('back-button').style.display = 'block';
        document.getElementById('country-select').style.display = 'none';
        document.getElementById('autocomplete-results').style.display = 'none';
    }
});

document.getElementById('back-button').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('autocomplete-results').innerHTML = '';
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('country-select').style.display = 'block';
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
        document.getElementById('autocomplete-results').innerHTML = '';
    }
});

async function fetchCountries(query) {
    const endpoint = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;
    const response = await fetch(endpoint);

    if (response.ok) {
        const data = await response.json();
        displayResults(data);
    } else {
        console.error('Error fetching data:', response.statusText);
    }
}

function displayResults(countries) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    countries.forEach(country => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.dataset.country = JSON.stringify(country);

        const img = country.flags.svg ? `<img src="${country.flags.svg}" alt="${country.name.common} flag">` : '';
        div.innerHTML = img;

        div.addEventListener('click', () => {
            const detailDiv = div.querySelector('.detail-item');
            if (detailDiv) {
                detailDiv.classList.toggle('show');
            } else {
                const newDetailDiv = document.createElement('div');
                newDetailDiv.className = 'detail-item show';

                const borders = country.borders ? country.borders.join(', ') : 'None';
                newDetailDiv.innerHTML = `
                    <h2>${country.name.common}</h2>
                    <p><span class="info-title">Capital:</span> ${country.capital ? country.capital.join(', ') : 'N/A'}</p>
                    <p><span class="info-title">Region:</span> ${country.region}</p>
                    <p><span class="info-title">Subregion:</span> ${country.subregion}</p>
                    <p><span class="info-title">Languages:</span> ${Object.values(country.languages).join(', ')}</p>
                    <p><span class="info-title">Currencies:</span> ${Object.values(country.currencies).map(c => c.name).join(', ')}</p>
                    <p><span class="info-title">Coordinates:</span> Latitude ${country.latlng ? country.latlng[0] : 'N/A'}, Longitude ${country.latlng ? country.latlng[1] : 'N/A'}</p>
                    <p><span class="info-title">Borders:</span> ${borders}</p>
                    <p><span class="info-title">Demonym:</span> ${country.demonyms ? Object.values(country.demonyms).join(', ') : 'N/A'}</p>
                    <p><span class="info-title">Top Level Domain:</span> ${country.tld ? country.tld.join(', ') : 'N/A'}</p>
                `;

                div.appendChild(newDetailDiv);
            }
        });

        resultsDiv.appendChild(div);
    });
}

async function populateCountrySelect() {
    const endpoint = 'https://restcountries.com/v3.1/all';
    const response = await fetch(endpoint);

    if (response.ok) {
        const data = await response.json();
        const select = document.getElementById('country-select');
        
        // Sort countries alphabetically by name
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            select.appendChild(option);
        });
    } else {
        console.error('Error fetching country list:', response.statusText);
    }
}

async function showAutocomplete(query) {
    const endpoint = 'https://restcountries.com/v3.1/all';
    const response = await fetch(endpoint);

    if (response.ok) {
        const data = await response.json();
        const results = data.filter(country => country.name.common.toLowerCase().startsWith(query.toLowerCase()));
        const autocompleteDiv = document.getElementById('autocomplete-results');
        autocompleteDiv.innerHTML = '';

        results.forEach(country => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = country.name.common;
            div.addEventListener('click', () => {
                document.getElementById('search-input').value = country.name.common;
                fetchCountries(country.name.common);
                document.getElementById('autocomplete-results').innerHTML = '';
            });

            autocompleteDiv.appendChild(div);
        });
    } else {
        console.error('Error fetching autocomplete data:', response.statusText);
    }
}

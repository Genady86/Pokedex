// Pokemon Karten anzeigen
function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        container.innerHTML += getPokemonCardTemplate(pokemonList[i]);
    }
}

// Pokemon suchen
function searchPokemon() {
    const searchInput = document.getElementById('search-input');
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue.length < 3) {
        return;
    }
    const filteredPokemon = allPokemon.filter((pokemon) => pokemon.name.includes(searchValue));
    renderPokemonCards(filteredPokemon);
    if (filteredPokemon.length == 0) {
        showNotFoundMessage();
    }
}

// Meldung bei keinem Treffer
function showNotFoundMessage() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '<li data-id="not-found">No match found.</li>';
}

// Search Button
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', searchPokemon);

// Load More Button
const loadMoreButton = document.getElementById('load-more-button');
loadMoreButton.addEventListener('click', loadPokemonList);

// Dark Mode wechseln
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    changeThemeButtonText();
}

// Text vom Theme Button ändern
function changeThemeButtonText() {
    const themeButton = document.getElementById('theme-button');

    if (document.body.classList.contains('dark-mode')) {
        themeButton.innerHTML = 'Light';
    } else {
        themeButton.innerHTML = 'Dark';
    }
}

const themeButton = document.getElementById('theme-button');
themeButton.addEventListener('click', toggleDarkMode);

// Erste Pokemon laden
loadPokemonList();

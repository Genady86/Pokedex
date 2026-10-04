function getTypeBackgroundColor(pokemon) {
    const type = pokemon.types[0].type.name;
    return TYPE_COLORS[type] || '#F5F5F5';
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

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

function showNotFoundMessage() {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '<li data-id="not-found">No match found.</li>';
}

async function fetchPokemonList() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    return await response.json();
}

async function loadPokemonList() {
    showLoadingSpinner();
    loadMoreButton.disabled = true;

    try {
        const data = await fetchPokemonList();
        await loadPokemonDetails(data.results);
        offset += limit;
        renderPokemonCards(allPokemon);
    } catch (error) {
        console.error('Pokemon could not be loaded:', error);
    }

    hideLoadingSpinner();
    loadMoreButton.disabled = false;
}

async function loadPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const pokemon = await response.json();

        allPokemon.push(pokemon);
    }
}

function renderPokemonCards(pokemonList) {
    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    for (let i = 0; i < pokemonList.length; i++) {
        container.innerHTML += getPokemonCardTemplate(pokemonList[i]);
    }
}

function getPokemonTypes(pokemon) {
    let pokemonTypes = '';

    for (let i = 0; i < pokemon.types.length; i++) {
        pokemonTypes += pokemon.types[i].type.name + ' ';
    }

    return pokemonTypes;
}

function getPokemonCardTemplate(pokemon) {
    const backgroundColor = getTypeBackgroundColor(pokemon);

    return `
        <li>
            <button
                class="pokemon-card"
                data-id="card"
                style="background-color: ${backgroundColor}"
                aria-label="Open ${pokemon.name}"
            >
                <h2>${pokemon.name}</h2>
                <p>#${pokemon.id}</p>
                <p>${getPokemonTypes(pokemon)}</p>

                <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                    data-id="card-image"
                >
            </button>
        </li>
    `;
}

const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', searchPokemon);

const loadMoreButton = document.getElementById('load-more-button');

loadMoreButton.addEventListener('click', loadPokemonList);

loadPokemonList();

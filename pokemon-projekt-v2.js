function getTypeBackgroundColor(pokemon) {
    const type = pokemon.types[0].type.name;
    return TYPE_COLORS[type] || '#F5F5F5';
}

async function loadPokemonList() {
    showLoadingSpinner();

    try {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        const response = await fetch(url);
        const data = await response.json();

        await loadPokemonDetails(data.results);
        renderPokemonCards();
    } catch (error) {
        console.error('Pokemon could not be loaded:', error);
    }

    hideLoadingSpinner();
}

async function loadPokemonDetails(pokemonList) {
    for (let i = 0; i < pokemonList.length; i++) {
        const response = await fetch(pokemonList[i].url);
        const pokemon = await response.json();

        allPokemon.push(pokemon);
    }
}

function renderPokemonCards() {
    const container = document.getElementById('pokemon-container');

    container.innerHTML = '';

    for (let i = 0; i < allPokemon.length; i++) {
        container.innerHTML += getPokemonCardTemplate(allPokemon[i]);
    }
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
                <p>${pokemon.types[0].type.name}</p>

                <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                    data-id="card-image"
                >
            </button>
        </li>
    `;
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('d-none');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
}

loadPokemonList();

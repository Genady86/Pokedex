// Hintergrundfarbe der Karte
function getTypeBackgroundColor(pokemon) {
    const type = pokemon.types[0].type.name;
    return TYPE_COLORS[type] || '#F5F5F5';
}

// Pokemon Typen holen
function getPokemonTypes(pokemon) {
    let pokemonTypes = '';
    for (let i = 0; i < pokemon.types.length; i++) {
        const type = pokemon.types[i].type.name;
        pokemonTypes += `<span class="type-badge">${type}</span>`;
    }
    return pokemonTypes;
}

// Wert von einem Stat holen
function getPokemonStat(pokemon, statName) {
    for (let i = 0; i < pokemon.stats.length; i++) {
        if (pokemon.stats[i].stat.name == statName) {
            return pokemon.stats[i].base_stat;
        }
    }
}

// Pokemon Werte
function getPokemonStats(pokemon) {
    return `
        <p>HP: ${getPokemonStat(pokemon, 'hp')}</p>
        <p>Attack: ${getPokemonStat(pokemon, 'attack')}</p>
        <p>Defense: ${getPokemonStat(pokemon, 'defense')}</p>
    `;
}

// Evolution anzeigen
function getEvolutionTemplate(evolutionData) {
    return `
        <p>Evolution: ${getEvolutionNames(evolutionData)}</p>
    `;
}

// Namen der Evolutionen holen
function getEvolutionNames(evolutionData) {
    const chain = evolutionData.chain;
    let names = chain.species.name;

    for (let i = 0; i < chain.evolves_to.length; i++) {
        const evolution = chain.evolves_to[i];
        names += ' > ' + evolution.species.name;
        names += getNextEvolutionNames(evolution.evolves_to);
    }

    return names;
}

// Weitere Evolutionen holen
function getNextEvolutionNames(evolutionList) {
    let names = '';

    for (let i = 0; i < evolutionList.length; i++) {
        names += ' > ' + evolutionList[i].species.name;
    }

    return names;
}

// HTML für den Dialog
function getPokemonDialogTemplate(pokemon, evolutionData) {
    return `
        <div class="pokemon-dialog-content">
            ${getPokemonDialogInfo(pokemon, evolutionData)}
            ${getPokemonDialogButtons()}
        </div>
    `;
}

// Inhalt vom Dialog
function getPokemonDialogInfo(pokemon, evolutionData) {
    return `
        <h2>${pokemon.name}</h2>
        <img
            class="pokemon-dialog-image"
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
        >
        ${getPokemonStats(pokemon)}
        ${getEvolutionTemplate(evolutionData)}
    `;
}

// Buttons im Dialog
function getPokemonDialogButtons() {
    return `
        <div class="pokemon-dialog-buttons">
            <button aria-label="Previous Pokemon" onclick="showPreviousPokemon()">←</button>
            <button aria-label="Close Pokemon details" onclick="closePokemonDialog()">Close</button>
            <button aria-label="Next Pokemon" onclick="showNextPokemon()">→</button>
        </div>
    `;
}

// HTML für eine Pokemon Karte
function getPokemonCardTemplate(pokemon) {
    const backgroundColor = getTypeBackgroundColor(pokemon);

    return `
        <li>
            ${getPokemonCardButton(pokemon, backgroundColor)}
        </li>
    `;
}

// Button der Pokemon Karte
function getPokemonCardButton(pokemon, backgroundColor) {
    return `
        <button class="pokemon-card" data-id="card"
            style="background-color: ${backgroundColor}"
            aria-label="Open ${pokemon.name}"
            onclick="openPokemonDialog(${pokemon.id})">
            ${getPokemonCardContent(pokemon)}
        </button>
    `;
}

// Inhalt der Pokemon Karte
function getPokemonCardContent(pokemon) {
    return `
        <h2>${pokemon.name}</h2>
        <p>#${pokemon.id}</p>
       <div class="pokemon-types">
    ${getPokemonTypes(pokemon)}
</div>
        ${getPokemonCardImage(pokemon)}
    `;
}

// Bild der Pokemon Karte
function getPokemonCardImage(pokemon) {
    return `
        <img
            src="${pokemon.sprites.front_default}"
            alt="${pokemon.name}"
            data-id="card-image"
        >
    `;
}

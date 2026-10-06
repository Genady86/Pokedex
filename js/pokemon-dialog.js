// Dialog aktualisieren
async function updatePokemonDialog() {
    const pokemon = allPokemon[currentPokemonIndex];
    const evolutionData = await loadEvolutionChain(pokemon);
    const dialog = document.getElementById('pokemon-dialog');

    dialog.innerHTML = getPokemonDialogTemplate(pokemon, evolutionData);
}

// Dialog öffnen
async function openPokemonDialog(pokemonId) {
    currentPokemonIndex = allPokemon.findIndex((pokemon) => pokemon.id == pokemonId);
    await updatePokemonDialog();

    const dialog = document.getElementById('pokemon-dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
}

// Dialog schließen
function closePokemonDialog() {
    const dialog = document.getElementById('pokemon-dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
}

// Dialog beim Klick daneben schließen
function closeDialogOnOutside(event) {
    const dialog = document.getElementById('pokemon-dialog');

    if (event.target == dialog) {
        closePokemonDialog();
    }
}

// Nächstes Pokemon anzeigen
async function showNextPokemon() {
    if (currentPokemonIndex < allPokemon.length - 1) {
        currentPokemonIndex++;
    }

    await updatePokemonDialog();
}

// Vorheriges Pokemon anzeigen
async function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    }

    await updatePokemonDialog();
}

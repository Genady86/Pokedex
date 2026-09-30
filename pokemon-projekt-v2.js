async function loadOnePokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const pokemon = await response.json();

        console.log(pokemon);
    } catch (error) {
        console.error('Pokémon konnte nicht geladen werden:', error);
    }
}

loadOnePokemon();

const container = document.getElementById("pokemonContainer");

    async function fetchPokemon(id) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      return data;
    }

    function createPokemonCard(pokemon) {
      const card = document.createElement("div");
      card.classList.add("pokemon-card");

      const img = document.createElement("img");
      img.src = pokemon.sprites.front_default;
      img.alt = pokemon.name;
      img.classList.add("pokemon-img");

      const name = document.createElement("div");
      name.classList.add("pokemon-name");
      name.textContent = pokemon.name;

      card.appendChild(img);
      card.appendChild(name);
      container.appendChild(card);
    }

    async function loadPokemons(count = 20) {
      for (let i = 1; i <= count; i++) {
        const pokemon = await fetchPokemon(i);
        createPokemonCard(pokemon);
      }
    }

    loadPokemons();
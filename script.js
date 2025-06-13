const container = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("pokemonModal");
const modalContent = document.getElementById("modalContent");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");
let allPokemon = [];

      async function fetchPokemon(id) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        return data;
      }

      function getTypeIcon(type) {
        const icons = {
          normal: "icons/normal.png",
          fire: "icons/fire.png",
          water: "icons/water.png",
          electric: "icons/electric.png",
          grass: "icons/grass.png",
          ice: "icons/ice.png",
          fighting: "icons/fighting.png",
          poison: "icons/poison.png",
          ground: "icons/ground.png",
          flying: "icons/flying.png",
          psychic: "icons/psychic.png",
          bug: "icons/bug.png",
          rock: "icons/rock.png",
          ghost: "icons/ghost.png",
          dragon: "icons/dragon.png",
          dark: "icons/dark.png",
          steel: "icons/steel.png",
          fairy: "icons/fairy.png"
        };
        return icons[type];
      }

      function createPokemonCard(pokemon) {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
        card.setAttribute("data-name", pokemon.name.toLowerCase());

        const img = document.createElement("img");
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        img.classList.add("pokemon-img");

        const name = document.createElement("div");
        name.classList.add("pokemon-name");
        name.textContent = pokemon.name;

        const typeContainer = document.createElement("div");
        typeContainer.classList.add("pokemon-type");

        pokemon.types.forEach(t => {
          const iconPath = getTypeIcon(t.type.name);
          if (iconPath) {
            const icon = document.createElement("img");
            icon.src = iconPath;
            icon.alt = t.type.name;
            icon.classList.add("type-icon");
            icon.title = t.type.name;
            typeContainer.appendChild(icon);
          }
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(typeContainer);

        card.addEventListener("click", () => {
          showModal(pokemon);
        });
        container.appendChild(card);
      }

      function showModal(pokemon) {
        modalDetails.innerHTML = `
          <h2>${pokemon.name.toUpperCase()}</h2>
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width: 120px; height: 120px;">
          <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
          <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
          <p><strong>Typ:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
          <p><strong>Attacken:</strong> ${pokemon.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
        `;
        modal.style.display = "flex";
      }

      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", e => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });

      async function loadPokemons(count = 20) {
        for (let i = 1; i <= count; i++) {
          const pokemon = await fetchPokemon(i);
          allPokemon.push(pokemon);
          createPokemonCard(pokemon);
        }
      }

      function filterPokemons(query) {
        const cards = document.querySelectorAll(".pokemon-card");
        cards.forEach(card => {
          const name = card.getAttribute("data-name");
          if (name.includes(query.toLowerCase())) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      }

      searchInput.addEventListener("input", e => {
        filterPokemons(e.target.value);
      });

      loadPokemons();
const $ = id => document.getElementById(id);
const container = $("pokemonContainer"),
  searchInput = $("searchInput"),
  modal = $("pokemonModal"),
  modalContent = $("modalContent"),
  modalDetails = $("modalDetails"),
  closeModal = $("closeModal");

let allPokemon = [], currentPokemonIndex = -1;
let currentOffset = 20;

const typeIcons = {
  normal: "icons/normal.png", fire: "icons/fire.png", water: "icons/water.png",
  electric: "icons/electric.png", grass: "icons/grass.png", ice: "icons/ice.png",
  fighting: "icons/fighting.png", poison: "icons/poison.png", ground: "icons/ground.png",
  flying: "icons/flying.png", psychic: "icons/psychic.png", bug: "icons/bug.png",
  rock: "icons/rock.png", ghost: "icons/ghost.png", dragon: "icons/dragon.png",
  dark: "icons/dark.png", steel: "icons/steel.png", fairy: "icons/fairy.png"
};
const getTypeIcon = type => typeIcons[type];

const fetchPokemon = async id =>
  (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();

const createPokemonCard = pokemon => {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.name = pokemon.name.toLowerCase();
  card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-img" />
      <div class="pokemon-name">${pokemon.name}</div>
      <div class="pokemon-type">
        ${pokemon.types.map(t => {
    const icon = getTypeIcon(t.type.name);
    return icon ? `<img src="${icon}" alt="${t.type.name}" title="${t.type.name}" class="type-icon" />` : "";
  }).join('')}
      </div>`;
  card.onclick = () => {
    currentPokemonIndex = allPokemon.findIndex(p => p.id === pokemon.id);
    showModal(pokemon);
  };
  container.appendChild(card);
};

const prevBtn = Object.assign(document.createElement("button"), {
  className: "prev-pokemon",
  id: "prevPokemon",
  textContent: "<",
  onclick: () => showModal(allPokemon[--currentPokemonIndex])
});
const nextBtn = Object.assign(document.createElement("button"), {
  id: "nextPokemon",
  textContent: ">",
  onclick: () => showModal(allPokemon[++currentPokemonIndex])
});
modalContent.append(prevBtn, nextBtn);

const showModal = pokemon => {
  modalDetails.innerHTML = `
      <h2>${pokemon.name.toUpperCase()}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width: 120px; height: 120px;">
      <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
      <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Typ:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
      <p><strong>Attacken:</strong> ${pokemon.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>`;

  prevBtn.style.display = currentPokemonIndex > 0 ? "block" : "none";
  nextBtn.style.display = currentPokemonIndex < allPokemon.length - 1 ? "block" : "none";
  modal.style.display = "flex";
};

closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

const loadPokemons = async (count = 20, offset = 0) => {
  for (let i = offset + 1; i <= offset + count; i++) {
    const pokemon = await fetchPokemon(i);
    allPokemon.push(pokemon);
    createPokemonCard(pokemon);
  }
};

const filterPokemons = query => {
  document.querySelectorAll(".pokemon-card").forEach(card => {
    card.style.display = card.dataset.name.includes(query.toLowerCase()) ? "block" : "none";
  });
};

searchInput.addEventListener("input", e => {
  const query = e.target.value.trim();
  if (query.length >= 3 || query.length === 0) {
    filterPokemons(query);
  }
});

$("loadMoreBtn").addEventListener("click", () => {
  loadPokemons(20, currentOffset);
  currentOffset += 20;
});

loadPokemons();


const $ = id => document.getElementById(id);
const container = $("pokemonContainer"),
  searchInput = $("searchInput"),
  modal = $("pokemonModal"),
  modalContent = $("modalContent"),
  modalDetails = $("modalDetails"),
  closeModal = $("closeModal"),
  loadMoreBtn = $("loadMoreButton"),
  loadingBar = $("loadingBar"),
  notFoundMsg = $("notFoundMessage");
const fullscreenSpinner = $("fullscreenSpinner");

let allPokemon = [], currentPokemonIndex = -1, loadedCount = 0;
const POKEMON_BATCH_SIZE = 20;

const fetchPokemon = async id => (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();

const getTypeIcon = type => ({
  normal: "icons/normal.png", fire: "icons/fire.png", water: "icons/water.png",
  electric: "icons/electric.png", grass: "icons/grass.png", ice: "icons/ice.png",
  fighting: "icons/fighting.png", poison: "icons/poison.png", ground: "icons/ground.png",
  flying: "icons/flying.png", psychic: "icons/psychic.png", bug: "icons/bug.png",
  rock: "icons/rock.png", ghost: "icons/ghost.png", dragon: "icons/dragon.png",
  dark: "icons/dark.png", steel: "icons/steel.png", fairy: "icons/fairy.png"
}[type]);

const getTypeIconsHTML = types =>
  types.map(t => {
    const icon = getTypeIcon(t.type.name);
    return icon ? `<img src="${icon}" alt="${t.type.name}" title="${t.type.name}" class="type-icon" />` : "";
  }).join('');

const createPokemonCard = pokemon => {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.name = pokemon.name.toLowerCase();
  card.innerHTML = getPokemonCardHTML(pokemon);
  card.onclick = () => {
    currentPokemonIndex = allPokemon.findIndex(p => p.id === pokemon.id);
    showModal(pokemon);
  };
  container.appendChild(card);
};

const showModal = pokemon => {
  modalDetails.innerHTML = getPokemonModalHTML(pokemon);

  if (!$("prevPokemon")) {
    const btn = document.createElement("button");
    btn.id = "prevPokemon";
    btn.textContent = "<";
    btn.className = "modal-nav left";
    btn.onclick = showPreviousPokemon;
    modalContent.appendChild(btn);
  }

  if (!$("nextPokemon")) {
    const btn = document.createElement("button");
    btn.id = "nextPokemon";
    btn.textContent = ">";
    btn.className = "modal-nav right";
    btn.onclick = showNextPokemon;
    modalContent.appendChild(btn);
  }

  $("prevPokemon").style.display = currentPokemonIndex > 0 ? "block" : "none";
  $("nextPokemon").style.display = currentPokemonIndex < allPokemon.length - 1 ? "block" : "none";

  modal.style.display = "flex";
};

const showPreviousPokemon = () => {
  if (currentPokemonIndex > 0) showModal(allPokemon[--currentPokemonIndex]);
};

const showNextPokemon = () => {
  if (currentPokemonIndex < allPokemon.length - 1) showModal(allPokemon[++currentPokemonIndex]);
};

const loadPokemons = async (count = POKEMON_BATCH_SIZE) => {
  loadingBar.style.display = "block";
  fullscreenSpinner.style.display = "flex";
  loadMoreBtn.disabled = true;

  for (let i = loadedCount + 1; i <= loadedCount + count; i++) {
    const pokemon = await fetchPokemon(i);
    allPokemon.push(pokemon);
    createPokemonCard(pokemon);
  }

  loadedCount += count;
  loadingBar.style.display = "none";
  fullscreenSpinner.style.display = "none";
  loadMoreBtn.disabled = false;
};

const filterPokemons = query => {
  let visibleCount = 0;
  document.querySelectorAll(".pokemon-card").forEach(card => {
    const name = card.dataset.name;
    const match = name.includes(query.toLowerCase());
    card.style.display = match ? "block" : "none";
    if (match) visibleCount++;
  });
  notFoundMsg.style.display = visibleCount === 0 ? "block" : "none";
};

closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

searchInput.addEventListener("input", e => {
  const query = e.target.value.trim();
  if (query.length >= 3) {
    filterPokemons(query);
  } else {
    filterPokemons(""); // reset
    notFoundMsg.style.display = "none";
  }
});

loadMoreBtn.addEventListener("click", () => loadPokemons());

loadPokemons();

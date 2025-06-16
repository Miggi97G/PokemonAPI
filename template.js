const getPokemonCardHTML = pokemon => `
  <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-img" />
  <div class="pokemon-name">${pokemon.name}</div>
  <div class="pokemon-type">${getTypeIconsHTML(pokemon.types)}</div>
`;

const getPokemonModalHTML = pokemon => `
  <h2>${pokemon.name.toUpperCase()}</h2>
  <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" style="width: 120px; height: 120px;">
  <p><strong>Name:</strong> ${pokemon.name}</p>
  <p><strong>Gewicht:</strong> ${pokemon.weight / 10} kg</p>
  <p><strong>Größe:</strong> ${pokemon.height / 10} m</p>
  <p><strong>Typ:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
  <p><strong>Attacken:</strong> ${pokemon.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
`;
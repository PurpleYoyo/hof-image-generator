import { allPokemon } from './pokemon.js';
import { modifyLabels, getRandomElement, saveConfiguration, readFile, toggleSidebar, downloadImage, getRandomInt } from './utils.js';
import { RGBToHex } from './colors.js';

const presetLinks = [
    'https://raw.githubusercontent.com/PurpleYoyo/hof-image-generator/refs/heads/main/smallchung.png',
];

const generationPresets = {
    3: {
        Vanilla: {
            'Emerald': {
                value: 'emerald',
                color1: '#84EFC6',
                color2: '#73DEB5',
                borders: true,
            },
            'FireRed/LeafGreen': {
                value: 'firered-leafgreen',
                color1: '#B5C6EF',
                color2: '#A5B5EF',
                borders: true,
            },
            'Ruby/Sapphire': {
                value: 'ruby-sapphire',
                color1: '#FFD6E7',
                color2: '#FFB5E7',
                borders: true,
            },
        },
        Romhacks: {
            'Heart & Soul': {
                value: 'heart-and-soul',
                color1: '#731810',
                color2: '#631010',
                borders: true,
            },
            'Unbound': {
                value: 'unbound',
                color1: '#BC84E9',
                color2: '#BC84E9',
                borders: true,
            },
            'Soulgold': {
                value: 'soulgold',
                color1: '#191547',
                color2: '#191547',
                borders: false,
            },
            'Ghost Grey': {
                value: 'ghost-grey',
                color1: '#F8f8F8',
                color2: '#F8f8F8',
                borders: true,
            },
        },
        Custom: {
            'Omega Ruby': {
                value: 'omega-ruby',
                color1: '#EF4D5D',
                color2: '#990A0C',
                borders: true,
            },
        },
    },
    4: {},
    5: {},
};

const sprites = {
    'Default': {
        value: 'default',
    },
    'Yellow': {
        value: 'yellow',
    },
    'Red/Blue': {
        value: 'red-blue',
    },
    'Crystal': {
        value: 'crystal',
    },
    'Gold': {
        value: 'gold',
    },
    'Silver': {
        value: 'silver',
    },
    'Emerald': {
        value: 'emerald',
    },
    'FireRed/LeafGreen': {
        value: 'firered-leafgreen',
    },
    'Ruby/Sapphire': {
        value: 'ruby-sapphire',
    },
    'HeartGold/SoulSilver': {
        value: 'heartgold-soulsilver',
    },
    'Platinum': {
        value: 'platinum',
    },
    'Diamond/Pearl': {
        value: 'diamond-pearl',
    },
    'Black/White': {
        value: 'black-white',
    },
};

const trainers = {
    'Red (Generation 3)': {
        value: 'red-g3',
    },
    'Red (Yellow)': {
        value: 'red-y',
    },
    'Red (Red/Blue)': {
        value: 'red-rb',
    },
    'Red (Generation 2)': {
        value: 'red-g2',
    },
    'Red (Generation 4)': {
        value: 'red-g4',
    },
    'Blue (Generation 1)': {
        value: 'blue-g1',
    },
    'Blue (Generation 2)': {
        value: 'blue-g2',
    },
    'Blue (Generation 3)': {
        value: 'blue-g3',
    },
    'Blue (Generation 4)': {
        value: 'blue-g4',
    },
    'Ethan (Gold/Silver)': {
        value: 'ethan-gs',
    },
    'Ethan (Crystal)': {
        value: 'ethan-c',
    },
    'Ethan (Generation 4)': {
        value: 'ethan-g4',
    },
    'Lyra (Generation 4)': {
        value: 'lyra-g4',
    },
    'Brendan (Ruby/Sapphire)': {
        value: 'brendan-rs',
    },
    'Brendan (Emerald)': {
        value: 'brendan-e',
    },
    'May (Ruby/Sapphire)': {
        value: 'may-rs',
    },
    'May (Emerald)': {
        value: 'may-e',
    },
    'Lucas (Diamond/Pearl': {
        value: 'lucas-dp',
    },
    'Lucas (Platinum)': {
        value: 'lucas-p',
    },
    'Dawn (Diamond/Pearl)': {
        value: 'dawn-dp',
    },
    'Dawn (Platinum)': {
        value: 'dawn-p',
    },
    'Hilbert': {
        value: 'hilbert',
    },
    'Hilda': {
        value: 'hilda',
    },
};

const games = [
    'Red',
    'Blue',
    'Yellow',
    'Green',
    'Gold',
    'Silver',
    'Crystal',
    'Ruby',
    'Sapphire',
    'Emerald',
    'FireRed',
    'LeafGreen',
    'Diamond',
    'Pearl',
    'Platinum',
    'Black',
    'White',
    'Black 2',
    'White 2',
    'X',
    'Y',
    'Omega Ruby',
    'Alpha Sapphire',
    'Sun',
    'Moon',
    'Ultra Sun',
    'Ultra Moon',
    'Sword',
    'Shield',
    'Let\'s Go Pikachu',
    'Let\'s Go Eevee',
    'Legends Arceus',
    'Scarlet',
    'Violet',
    'Legends Z-A',
    'Winds',
    'Waves',
    'Little Emerald',
    'FireRed Little Omega',
    'Mini Moon',
    'Ultra Small Sun',
    'Sippy Cup Sapphire',
    'Nosplit White 2',
    'Baby Blue',
    'Petit Pearl',
    'Gauntlet Gold',
    'Volcanic Red',
    'FireRed Omega',
    'Renegade Platinum',
    'Blaze Black',
    'Volt White',
    'Blaze Black 2',
    'Volt White 2',
    'Blaze Black 2 Redux',
    'Volt White 2 Redux',
    'Rising Ruby',
    'Sinking Sapphire',
    'Goblin Gold',
    'Inclement Emerald',
    'Photonic Sun',
    'Prismatic Moon',
    'Eternal X',
    'Wilting Y',
    'Sacred Gold',
    'Storm Silver',
    'Ancestral X',
    'Nouveau Y',
    'Emerald Imperium',
    'Radical Red',
    'Emerald Kaizo',
    'Platinum Kaizo',
    'Navy Sapphire',
    'Rho Ruby',
    'Rigorous Red',
    'Brutal Black',
    'Colors',
    'Cascade White',
    'Emerald But Bad',
    'Royal Sapphire',
    'Null',
    'Run and Bun',
    'Vintage White',
    'Vintage White Plus',
    'Wishy Washy White 2',
    'Wishy Washy White 2 Redux',
    'Blue Kaizo',
    'Crystal Kaizo',
    'Crystal Kaizo Plus',
    'Aether White 2',
    'Blinding White 2',
    'Autumn Red',
    'FireRed Deluxe',
    'Maximum Platinum',
    'Maximum Emerald',
    'Crystal Legacy',
    'Emerald Legacy',
    'Platinum Redux',
    'Luminescent Platinum',
    'Ghost Grey',
    'Heart and Soul',
    'Soulgold',
    'Unbound',
    'Pitch Black 2',
    'Meissa Moon',
    'Righteous Red',
    'Uranium',
    'Lucid',
    'Emerald Trashlocke',
    'Emerald Seaglass',
    'Lazarus',
    'Trash Can Y',
    'Vanta Black',
    'Amethyst',
    'Gaia',
    'RenHERgade Platinum',
    'Maximum Red',
    'Brilliant Diamond',
    'Shining Pearl',
    'Mariomon',
    'Garbage Green',
    'Infinite Fusion',
    'Nuzlomizer',
    'Monster Hunter Emerald',
    'Kalos Crystal',
    'Unova Red',
    'Emerald Cross',
    'Parallel Emerald',
    'Emerald Rogue',
    'Anil',
    'Blazing Emerald',
    'Colosseum',
    'XD: Gale of Darkness',
    'Dark Rising',
    'Insurgence',
    'Quetzal',
    'Divine Sword',
    'Blessed Shield',
    'Scorched Silver',
    'Crystal Clear',
    'Evolved',
    'Too Many Types',
    'Too Many Types 2',
    'Project Bug',
    'Project Bugn\'t',
    'Snakewood',
    'Yellow Kaizo',
    'Z',
    'Recharged Emerald',
];

const MIN_GENERATION = 3;
const MAX_GENERATION = 4;

export function buildTrainerDropdown() {
    const dropdown = document.getElementById('trainer-sprites');
    Object.keys(trainers).forEach((trainer) => {
        let option = document.createElement('option');
        option.value = trainers[trainer].value;
        option.text = trainer;
        dropdown.appendChild(option);
    });
}

export function buildSpriteDropdowns() {
    for (let i = 1; i < 7; i++) {
        const dropdown = document.getElementById(`sprites${i}`);
        Object.keys(sprites).forEach((game) => {
            let option = document.createElement('option');
            option.value = `${sprites[game].value}-option`;
            option.text = game;
            dropdown.appendChild(option);
        });
    }
}

export function buildPresetDropdowns() {
    for (let i = MIN_GENERATION; i < MAX_GENERATION + 1; i++) {
        const dropdown = document.getElementById(`g${i}-presets`);
        const presets = generationPresets[i];

        const none = document.createElement('option');
        none.value = 'none-option';
        none.text = 'None';
        
        dropdown.appendChild(none);

        Object.keys(presets).forEach((group) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group;

            Object.keys(presets[group]).forEach((game) => {
                const option = document.createElement('option');
                option.value = `${presets[group][game].value}-option`;
                option.text = game;

                optgroup.appendChild(option);
            });

            dropdown.appendChild(optgroup);
        });
    }
}

export function randomizeStartColors() {
    document.getElementById('color1').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
    document.getElementById('color2').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
}

export function buildPokemonSuggestions() {
    const datalist = document.getElementById('pokemon-suggestions');
    Object.entries(allPokemon).forEach(([name, _]) => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

export function buildGameSuggestions() {
    const datalist = document.getElementById('games');
    games.forEach((game) => {
        const option = document.createElement('option');
        option.value = game;
        datalist.appendChild(option);
    });
}

function resetInputs() {
    document.getElementById('darken').checked = false;
    document.getElementById('borders').checked = false;

    document.getElementById('trainer').checked = false;
    document.getElementById('trainer-resize').checked = true;
}

export function initializeEventListeners(start) {
    // Sidebar
    document.getElementById('open-sidebar').addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar').addEventListener('click', toggleSidebar);

    // Background
    for (const i of ['1', '3', '4']) {
        document.getElementById(`g${i}`).addEventListener('change', () => {
            document.getElementById(`g${i}-presets`).value = 'none-option';
            
            resetInputs();

            start();
        });
    }

    // Colors
    for (let i = 1; i < 3; i++) {
	    document.getElementById(`color${i}`).addEventListener('input', start);
	}

    // Borders
    document.getElementById('borders').addEventListener('input', () => { 
        for (let i = MIN_GENERATION; i < MAX_GENERATION + 1; i++) {
            document.getElementById(`g${i}-presets`).value = 'none-option';
        }

        start();
    });

    // Darken
    document.getElementById('darken').addEventListener('input', start);

    // Trainer
    document.getElementById('trainer').addEventListener('input', start);

    ['name', 'link', 'upload'].forEach((id) => {
	    document.getElementById(`trainer-${id}`).addEventListener('change', start);
	});

    ['link-text', 'resize', 'image', 'sprite'].forEach((id) => {
	    document.getElementById(`trainer-${id}`).addEventListener('input', start);
	});

    // Presets
    for (let i = MIN_GENERATION; i < MAX_GENERATION + 1; i++) {
        const dropdown = document.getElementById(`g${i}-presets`);
	    dropdown.addEventListener('input', () => {
            const value = dropdown.value.replace('-option', '');
            if (value === 'none') {
                return;
            }

            const presets = generationPresets[i];

            Object.keys(presets).forEach((group) => {
                Object.keys(presets[group]).forEach((game) => {
                    if (presets[group][game].value === value) {
                        const preset = presets[group][game];

                        document.getElementById('color1').value = preset.color1;
                        document.getElementById('color2').value = preset.color2;
                        document.getElementById('borders').checked = preset.borders;
                    }
                });
            });

            start();
        });
    }

    // Game
    document.getElementById('game-name').addEventListener('input', start);

    // Download
    document.getElementById('download').addEventListener('click', downloadImage);

    // Pokémon
    for (let i = 1; i < 7; i++) {
        document.getElementById(`name${i}`).addEventListener('change', start);
        document.getElementById(`link${i}`).addEventListener('change', start);
        document.getElementById(`upload${i}`).addEventListener('change', start);

        const input = document.getElementById(`sprites${i}`);
	    input.addEventListener('input', () => {
            modifyLabels(input, i);

            start();
        });

        document.getElementById(`link${i}-text`).addEventListener('input', start);
	}

	['resize', 'shiny', 'pokemon', 'image'].forEach((id) => {
        for (let i = 1; i < 7; i++) {
	        document.getElementById(`${id}${i}`).addEventListener('input', start);
	    }
	});

    // Save & Load Configuration
    document.getElementById('save-configuration').addEventListener('click', saveConfiguration);
    document.getElementById('load-configuration').addEventListener('input', () => {
        readFile(start);
    });
}

export function randomizePlaceholders() {
	for (let i = 1; i < 7; i++) {
		document.getElementById(`pokemon${i}`).placeholder = getRandomElement(Object.keys(allPokemon));

        document.getElementById(`link${i}-text`).placeholder = getRandomElement(presetLinks);
	}
}
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

const sprites = [
    'Default',
    'Yellow',
    'Red/Blue',
    'Crystal',
    'Gold',
    'Silver',
    'Emerald',
    'FireRed/LeafGreen',
    'Ruby/Sapphire',
    'HeartGold/SoulSilver',
    'Platinum',
    'Diamond/Pearl',
    'Black/White'
];

export function buildSpriteDropdowns() {
    for (let i = 1; i < 7; i++) {
        const dropdown = document.getElementById(`sprites${i}`);
        sprites.forEach((game) => {
            let option = document.createElement('option');
            option.value = `${game.toLowerCase().replace('/', '-')}-option`;
            option.text = game;
            dropdown.appendChild(option);
        });
    }
}

export function buildPresetDropdown() {
    [3].forEach((generation) => {
        const dropdown = document.getElementById(`g${generation}-presets`);
        const presets = generationPresets[generation];

        const none = document.createElement('option');
        none.value = 'none-option';
        none.text = 'None';

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
    });
}

export function randomizeStartColors() {
    document.getElementById('color1').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
    document.getElementById('color2').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
}

export function buildSuggestions() {
    const datalist = document.getElementById('pokemon-suggestions');
    Object.entries(allPokemon).forEach(([name, _]) => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

export function initializeEventListeners(start) {
    for (let i = 3; i < 5; i++) {
        document.getElementById(`g${i}`).addEventListener('change', () => {
            document.getElementById(`g${i}-presets`).value = 'none-option';

            start();
        });
    }

    for (let i = 1; i < 3; i++) {
	    document.getElementById(`color${i}`).addEventListener('input', start);
	}

	['shiny', 'pokemon', 'image'].forEach((id) => {
	    for (const i = 1; i < 7; i++) {
	        document.getElementById(`${id}${i}`).addEventListener('input', start);
	    }
	});

    document.getElementById('borders').addEventListener('input', start);

    for (let i = 1; i < 7; i++) {
        document.getElementById(`link${i}-text`).addEventListener('input', start);
	}

    for (let i = 1; i < 7; i++) {
        const input = document.getElementById(`sprites${i}`);
	    input.addEventListener('input', () => {
            modifyLabels(input, i);

            start();
        });

        document.getElementById(`name${i}`).addEventListener('change', start);
        document.getElementById(`link${i}`).addEventListener('change', start);
        document.getElementById(`upload${i}`).addEventListener('change', start);
	}

    const dropdown = document.getElementById('g3-presets');
	dropdown.addEventListener('input', () => {
        const value = dropdown.value.replace('-option', '');
        if (value === 'none') {
            return;
        }

        const presets = generationPresets[3];

        presets.forEach((group) => {
            group.forEach((game) => {
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

    document.getElementById('download').addEventListener('click', downloadImage);

    document.getElementById('save-configuration').addEventListener('click', saveConfiguration);
    document.getElementById('load-configuration').addEventListener('input', () => {
        readFile();

        start();
    });

    document.getElementById('open-sidebar').addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar').addEventListener('click', toggleSidebar);
}

export function randomizePlaceholders() {
	for (let i = 1; i < 7; i++) {
		document.getElementById(`pokemon${i}`).placeholder = getRandomElement(Object.keys(allPokemon));

        document.getElementById(`link${i}-text`).placeholder = getRandomElement(presetLinks);
	}
}
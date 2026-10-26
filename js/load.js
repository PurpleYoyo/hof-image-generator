import { allPokemon } from './pokemon.js';
import { modifyLabels, getRandomElement, saveConfiguration, readFile, toggleSidebar, downloadImage, applyPreset, getRandomInt } from './utils.js';
import { RGBToHex } from './colors.js';

const presetLinks = [
    'https://raw.githubusercontent.com/PurpleYoyo/hof-image-generator/refs/heads/main/smallchung.png',
];

const generationPresets = {
    3: {
        vanilla: [
            'Emerald',
            'FireRed/LeafGreen',
            'Ruby/Sapphire',
        ],
        romhacks: [
            'Heart & Soul',
            'Unbound',
            'Soulgold',
            'Ghost Grey',
        ],
        custom: [
            'Omega Ruby'
        ],
    },
    4: {},
    5: {},
};

const generationPresetGroups = {
    3: [
        'Vanilla',
        'Romhacks',
        'Custom',
    ],
    4: [],
    5: [],
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
        const presetGroups = generationPresetGroups[generation];

        presetGroups.forEach((name) => {
            const group = document.createElement('optgroup');
            group.label = name;

            const options = presets[name.toLowerCase()];
            options.forEach((game) => {
                let option = document.createElement('option');
                option.value = `${game.toLowerCase().replace('&', 'and').replace('/', '-').replace(' ', '-')}-option`;
                option.text = game;

                group.appendChild(option);
            });

            dropdown.appendChild(group);
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
    document.getElementById('g3').addEventListener('change', start);
    document.getElementById('g4').addEventListener('change', start);
    //document.getElementById('g5').addEventListener('change', start);

	document.getElementById('color1').addEventListener('input', start);
	document.getElementById('color2').addEventListener('input', start);
	['shiny', 'pokemon', 'image'].forEach((id) => {
	    for (let i = 1; i < 7; i++) {
	        document.getElementById(`${id}${i}`).addEventListener('input', start);
	    }
	});

    for (let i = 1; i < 7; i++) {
        document.getElementById(`link${i}-text`).addEventListener('input', start);
	}

    for (let i = 1; i < 7; i++) {
        const input = document.getElementById(`sprites${i}`);
	    input.addEventListener('input', () => {
            modifyLabels(input, i);
            start();
        });
	}

    const dropdown = document.getElementById('g3-presets');
	dropdown.addEventListener('input', () => {
        applyPreset(dropdown.value.replace('-option', ''));
        start();
    });

    for (let i = 1; i < 7; i++) {
        document.getElementById(`name${i}`).addEventListener('change', start);
        document.getElementById(`link${i}`).addEventListener('change', start);
        document.getElementById(`upload${i}`).addEventListener('change', start);
	}

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
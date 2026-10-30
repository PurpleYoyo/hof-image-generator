import { darkenColor, hexToRGB, RGBtoHSV, HSVtoRGB } from './colors.js';
import { generation1Games, generation2Games } from './pokemon.js';

export const validSpecialCharacters = {
    '!': { filename: 'ep' },
    ' ': { filename: 'sp' },
    '.': { filename: 'pd' },
    '\'': { filename: 'ap' },
    ',': { filename: 'co' },
    'é': { filename: 'ae' },
    '?': { filename: 'qm' },
    '"': { filename: 'qu' },
    '-': { filename: 'hy' },
};

export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) return;
    
    sidebar.style.width = sidebar.style.width === '250px' ? '0' : '250px';
}

export function saveConfiguration() {
    const data = {
        background: getGeneration(),
        colors: {
            color1: document.getElementById('color1').value,
            color2: document.getElementById('color2').value,
        },
        darken: document.getElementById('darken').checked,

        trainer: document.getElementById('trainer').checked,
        trainer_type: getTrainerType(),
        trainer_sprite: document.getElementById('trainer-sprites').value,
        trainer_link: document.getElementById('trainer-link-text').value,
        trainer_resize: document.getElementById('trainer-resize').checked,

        g3_preset: document.getElementById('g3-presets').value,
        g4_preset: document.getElementById('g3-presets').value,

        game: document.getElementById('game-name').value,

        pokemon: {},
    };

    for (let i = 1; i < 7; i++) {
        data.pokemon[i] = {
            type: getType(i),
            name: {
                pokemon: document.getElementById(`pokemon${i}`).value,
                sprite: document.getElementById(`sprites${i}`).value,
                shiny: document.getElementById(`shiny${i}`).checked,
            },
            link: {
                link: document.getElementById(`link${i}-text`).value,
            },
            resize: document.getElementById(`resize${i}`).checked,
        };
    }

    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    a.download = 'hof-config.json';
    a.click();
}

export function readFile(start) {
    const files = document.getElementById('load-configuration').files;

    if (files.length < 1) {
        return null;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const result = e.target.result;
        loadConfiguration(JSON.parse(result));

        start();
    }

    reader.readAsText(files[0])
}

function loadConfiguration(data) {
    document.getElementById(`g${data.background}`).checked = true;
    document.getElementById('color1').value = data.colors.color1;
    document.getElementById('color2').value = data.colors.color2;
    document.getElementById('darken').checked = data.darken;

    document.getElementById('trainer').checked = data.trainer;
    document.getElementById(`trainer-${data.trainer_type}`).checked = true;
    document.getElementById('trainer-sprites').value = data.trainer_sprite;
    document.getElementById('trainer-link-text').value = data.trainer_link;
    document.getElementById('trainer-resize').checked = data.trainer_resize;

    document.getElementById('g3-presets').value = data.g3_preset;
    document.getElementById('g3-presets').value = data.g4_preset;

    document.getElementById('game-name').value = data.game;

    for (let i = 1; i < 7; i++) {
        document.getElementById(`${data.pokemon[i].type}${i}`).checked = true;

        document.getElementById(`pokemon${i}`).value = data.pokemon[i].name.pokemon;
        document.getElementById(`sprites${i}`).value = data.pokemon[i].name.sprite;
        document.getElementById(`shiny${i}`).checked = data.pokemon[i].name.shiny;

        document.getElementById(`link${i}-text`).value = data.pokemon[i].link.link;

        document.getElementById(`resize${i}`).checked = data.pokemon[i].resize;
    }
}

export function downloadImage() {
    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL('image/png');

    const a = document.createElement('a');

    a.href = url;
    a.download = 'hall-of-fame.png';

    a.click()
}

export function modifyLabels(input, index) {
    let value = input.value.replace('-option', '');

    if (generation1Games.includes(value)) {
        document.getElementById(`shiny${index}-label`).textContent = 'Color?';
    }
    else if (generation2Games.includes(value)) {
        document.getElementById(`shiny${index}-label`).textContent = 'Gray?';
    }
    else {
        document.getElementById(`shiny${index}-label`).textContent = 'Shiny?';
    }
}

export function getRandomElement(arr) {
	return arr[Math.floor(arr.length * Math.random())];
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function getGeneration() {
    for (let i = 3; i < 5; i++) {
        if (document.getElementById(`g${i}`).checked) {
            return i.toString();
        }
    }

    return '3';
}

const allInputs = [
    'colors',
    'g1-presets-input',
    'g3-presets-input',
    'g4-presets-input',
    'darken-input',
    'borders-input',
];

const generationSpecificInputs = {
    '1': [
        'colors',
        'g1-presets-input',
    ],
    '3': [
        'colors',
        'g3-presets-input',
        'darken-input',
        'borders-input',
    ],
    '4': [
        'g4-presets-input',
        'borders-input',
    ],
    '5': [],
};

export function hideInputs(generation) {
    if (!document.getElementById('trainer').checked) {
        document.getElementById('trainer-sprite').classList.add('hidden');
    }
    else {
        document.getElementById('trainer-sprite').classList.remove('hidden');
    }

    for (const input of allInputs) {
        document.getElementById(input).classList.add('hidden');
    }

    for (const input of generationSpecificInputs[generation]) {
        document.getElementById(input).classList.remove('hidden');
    }

    const trainerType = getTrainerType();

    if (trainerType === 'name') {
        document.getElementById('trainer-resize-input').classList.add('hidden');
    }
    else {
        document.getElementById('trainer-resize-input').classList.remove('hidden');
    }

    switch (trainerType) {
        default:
        case 'name':
            document.getElementById('trainer-sprite-input').classList.remove('hidden');

            document.getElementById('trainer-link-input').classList.add('hidden');
            document.getElementById('trainer-upload-input').classList.add('hidden');
            
            break;
        case 'link':
            document.getElementById('trainer-link-input').classList.remove('hidden');

            document.getElementById('trainer-sprite-input').classList.add('hidden');
            document.getElementById('trainer-upload-input').classList.add('hidden');
            
            break;
        case 'upload':
            document.getElementById('trainer-upload-input').classList.remove('hidden');

            document.getElementById('trainer-link-input').classList.add('hidden');
            document.getElementById('trainer-sprite-input').classList.add('hidden');
            
            break;
    }

    for (let i = 1; i < 7; i++) {
        const selected = getType(i);

        if (selected === 'name') {
            document.getElementById(`resize${i}`).classList.add('hidden');
            document.getElementById(`resize${i}-label`).classList.add('hidden');
        }
        else {
            document.getElementById(`resize${i}`).classList.remove('hidden');
            document.getElementById(`resize${i}-label`).classList.remove('hidden');
        }

        switch (selected) {
            default:
            case 'name':
                document.getElementById(`name${i}-input`).classList.remove('hidden');

                document.getElementById(`link${i}-input`).classList.add('hidden');
                document.getElementById(`upload${i}-input`).classList.add('hidden');

                break;
            case 'link':
                document.getElementById(`link${i}-input`).classList.remove('hidden');

                document.getElementById(`name${i}-input`).classList.add('hidden');
                document.getElementById(`upload${i}-input`).classList.add('hidden');

                break;
            case 'upload':
                document.getElementById(`upload${i}-input`).classList.remove('hidden');

                document.getElementById(`link${i}-input`).classList.add('hidden');
                document.getElementById(`name${i}-input`).classList.add('hidden');

                break;
        }
    }
}

export function getType(index) {
    for (const input_type of ['name', 'link', 'upload']) {
        if (document.getElementById(`${input_type}${index}`).checked) {
            return input_type;
        }
    }
    
    return 'name';
}

export function getTrainerType() {
    for (const input_type of ['name', 'link', 'upload']) {
        if (document.getElementById(`trainer-${input_type}`).checked) {
            return input_type;
        }
    }
    
    return 'name';
}

export function getColors() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;

    return {
        color1: hexToRGB(color1),
        color2: hexToRGB(color2),
        color3: HSVtoRGB(darkenColor(RGBtoHSV(hexToRGB(color1)), true)),
        color4: HSVtoRGB(darkenColor(RGBtoHSV(hexToRGB(color2)), false)),
    }
}

export function getInputs(index) {
    return {
        type: getType(index),
        name: document.getElementById(`pokemon${index}`).value,
        sprite: document.getElementById(`sprites${index}`).value,
        resize: document.getElementById(`resize${index}`).checked,
    }
}

export function validateText(text) {
    if (text === '') {
        return false;
    }
    
    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        if (!isAlphaNumeric(character)) {
            if (!(character in validSpecialCharacters)) {
                return false;
            }
        }
    }

    return true;
}

function isAlphaNumeric(character) {
    return /^[a-zA-Z0-9]$/i.test(character);
}

export function isNumeric(character) {
    return /^[0-9]$/i.test(character);
}
import { darkenColor, hexToRGB, RGBtoHSV, HSVtoRGB } from './colors.js';

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

export function readFile() {
    const files = document.getElementById('load-configuration').files;

    if (files.length < 1) {
        return null;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const result = e.target.result;
        loadConfiguration(JSON.parse(result))
    }

    reader.readAsText(files[0])
}

function loadConfiguration(data) {
    document.getElementById(`g${data.background}`).checked = true;
    document.getElementById('color1').value = data.colors.color1;
    document.getElementById('color2').value = data.colors.color2;

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

export function modifyLabels(input, index, start) {
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

export function hideInputs(generation) {
    if (!document.getElementById('trainer').checked) {
        document.getElementById('trainer-sprite').classList.add('hidden');
    }
    else {
        document.getElementById('trainer-sprite').classList.remove('hidden');
    }

    if (generation !== '3') {
        document.getElementById('color1').classList.add('hidden');
        document.getElementById('color1-label').classList.add('hidden');
        document.getElementById('color2').classList.add('hidden');
        document.getElementById('color2-label').classList.add('hidden');

        document.getElementById('g3-presets').classList.add('hidden');
        document.getElementById('g3-presets-label').classList.add('hidden');
    }
    else {
        document.getElementById('color1').classList.remove('hidden');
        document.getElementById('color1-label').classList.remove('hidden');
        document.getElementById('color2').classList.remove('hidden');
        document.getElementById('color2-label').classList.remove('hidden');

        document.getElementById('g3-presets').classList.remove('hidden');
        document.getElementById('g3-presets-label').classList.remove('hidden');
    }

    const trainerType = getTrainerType();

    if (trainerType === 'name') {
        document.getElementById('trainer-resize').classList.add('hidden');
        document.getElementById('trainer-resize-label').classList.add('hidden');
    }
    else {
        document.getElementById('trainer-resize').classList.remove('hidden');
        document.getElementById('trainer-resize-label').classList.remove('hidden');
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
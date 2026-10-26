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

export function applyPreset(game) {
    let border = true;

    switch (game) {
        default:
        case 'emerald':
            document.getElementById('color1').value = '#84EFC6';
            document.getElementById('color2').value = '#73DEB5';
            break;
        case 'ruby-sapphire':
            document.getElementById('color1').value = '#FFD6E7';
            document.getElementById('color2').value = '#FFB5E7';
            break;
        case 'firered-leafgreen':
            document.getElementById('color1').value = '#B5C6EF';
            document.getElementById('color2').value = '#A5B5EF';
            break;
        case 'unbound':
            document.getElementById('color1').value = '#BC84E9';
            document.getElementById('color2').value = '#BC84E9';
            break;
        case 'heart-and-soul':
            document.getElementById('color1').value = '#731810';
            document.getElementById('color2').value = '#631010';
            break;
        case 'soulgold':
            document.getElementById('color1').value = '#191547';
            document.getElementById('color2').value = '#191547';
            border = false;
            break;
        case 'ghost-grey':
            document.getElementById('color1').value = '#F8f8F8';
            document.getElementById('color2').value = '#F8f8F8';
            break;
        case 'omega-ruby':
            document.getElementById('color1').value = '#EF4D5D';
            document.getElementById('color2').value = '#990A0C';
            break;
    }

    document.getElementById('borders').checked = border;
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
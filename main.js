const img = new Image();
const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];
const default_color3 = [57, 104, 86];
const default_color4 = [50, 97, 79];

function createDropdowns() {
    for (let i = 1; i < 7; i++) {
        const dropdown = document.getElementById(`sprites${i}`);
        ['Yellow', 'Red/Blue', 'Crystal', 'Gold', 'Silver', 'Emerald', 'FireRed/LeafGreen', 'Ruby/Sapphire', 'HeartGold/SoulSilver', 'Platinum', 'Diamond/Pearl', 'Black/White'].forEach((game) => {
            let option = document.createElement('option');
            option.value = game.toLowerCase().replace('/', '-');
            option.text = game;
            dropdown.appendChild(option);
        });
    }
}

window.addEventListener("load", (event) => {
    createDropdowns();
    start();
});

document.getElementById('color1').addEventListener('input', (event) => start());
document.getElementById('color2').addEventListener('input', (event) => start());
document.getElementById('scale').addEventListener('input', (event) => start());
['sprites', 'shiny', 'pokemon', 'image'].forEach((id) => {
    for (let i = 1; i < 7; i++) {
        document.getElementById(`${id}${i}`).addEventListener('input', (event) => start());
    }
});

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let color1;
let color2;
let color3;
let color4;
function getColors(generation) {
    if (generation === '3') {
        color1 = hexToRGB(document.getElementById('color1').value);
        color2 = hexToRGB(document.getElementById('color2').value);
        color3 = HSVtoRGB(darkenColor(RGBtoHSV(color1), true));
        color4 = HSVtoRGB(darkenColor(RGBtoHSV(color2), false));
    }
}

function getGeneration() {
    const radios = document.querySelectorAll('.generation');

    radios.forEach(radio => {
        if (radio.checked) {
            return radio.value;
        }
    });

    return '3';
}

function start() {
    hideInputs();
    renderPreview(getGeneration())
}

function hideInputs() {
    for (let i = 1; i < 7; i++) {
        if (document.getElementById(`pokemon${i}`).value === '') {
            document.getElementById(`image${i}`).classList.remove('hidden');
        }
        else {
            document.getElementById(`image${i}`).classList.add('hidden');
            document.getElementById(`or${i}`).classList.add('hidden');
        }

        if (document.getElementById(`image${i}`).value === '') {
            document.getElementById(`pokemon${i}`).classList.remove('hidden');
            document.getElementById(`sprites${i}`).classList.remove('hidden');
            document.getElementById(`shiny${i}`).classList.remove('hidden');
            document.getElementById(`shiny${i}-label`).classList.remove('hidden');
            document.getElementById(`sprites${i}-label`).classList.remove('hidden');
        }
        else {
            document.getElementById(`pokemon${i}`).classList.add('hidden');
            document.getElementById(`sprites${i}`).classList.add('hidden');
            document.getElementById(`shiny${i}`).classList.add('hidden');
            document.getElementById(`shiny${i}-label`).classList.add('hidden');
            document.getElementById(`sprites${i}-label`).classList.add('hidden');
            document.getElementById(`or${i}`).classList.add('hidden');
        }

        if (document.getElementById(`pokemon${i}`).value === ''
            && document.getElementById(`image${i}`).value === '') {
                document.getElementById(`or${i}`).classList.remove('hidden');
            }
    }
}

function renderPreview(generation) {
    const scale = parseInt(document.getElementById('scale').value);

    img.src = `g${generation}-template.png`;
    img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        drawPreview(generation);
    }
}

function drawPreview(generation) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
        
    switch (generation) {
        default:
        case '3':
            recolorGen3HOF(data)
            break;
    }

    ctx.putImageData(imageData, 0, 0);

    placePokemon(generation);
}

function recolorGen3HOF(data) {
    getColors('3')

    for (let i = 0; i < data.length; i += 4) {
        if (
            data[i] === default_color1[0]
            && data[i + 1] === default_color1[1]
            && data[i + 2] === default_color1[2]
        ) {
            data[i] = color1[0];
            data[i + 1] = color1[1];
            data[i + 2] = color1[2];
        }
        
        if (
            data[i] === default_color2[0]
            && data[i + 1] === default_color2[1]
            && data[i + 2] === default_color2[2]
        ) {
            data[i] = color2[0];
            data[i + 1] = color2[1];
            data[i + 2] = color2[2];
        }

        if (
            data[i] === default_color3[0]
            && data[i + 1] === default_color3[1]
            && data[i + 2] === default_color3[2]
        ) {
            data[i] = color3[0];
            data[i + 1] = color3[1];
            data[i + 2] = color3[2];
        }
        
        if (
            data[i] === default_color4[0]
            && data[i + 1] === default_color4[1]
            && data[i + 2] === default_color4[2]
        ) {
            data[i] = color4[0];
            data[i + 1] = color4[1];
            data[i + 2] = color4[2];
        }
    }
}

const showdownLinks = {
    'yellow':       'gen1',
    'red-blue':     'gen1rb',
    'gold':         'gen2g',
    'silver':       'gen2s',
    'crystal':      'gen2',
};

function makeSpriteLink(index, generation) {
    const pokemon = document.getElementById(`pokemon${index}`).value
    const sprite = document.getElementById(`sprites${index}`).value
    const shiny = document.getElementById(`shiny${index}`).value

    if (generation == '1') {
        shiny.checked = false;
    }

    if (['gold', 'silver'].includes(sprite)
        && shiny.checked) {
        sprite = 'crystal';
    }

    console.log(parseInt(generation));
    if (parseInt(generation) > 2) {
        return `https://img.pokemondb.net/sprites/${sprite}/${shiny.checked ? 'shiny' : 'normal'}/${pokemon}.png`;
    }
    else {
        return `https://play.pokemonshowdown.com/sprites/${showdownLinks}${shiny.checked ? '-shiny' : ''}/${pokemon}.png`;
    }
}

const gen3SpritePositions = {
    1: { x: 24, y: 8 },
    2: { x: 88, y: 8 },
    3: { x: 152, y: 8 },
    4: { x: 8, y: 56 },
    5: { x: 88, y: 56 },
    6: { x: 168, y: 56 },
};

function placePokemon(generation) {
    switch (generation) {
        default:
        case '3':
            for (let i = 1; i < 7; i++) {
                let pokemon = new Image();
                pokemon.src = makeSpriteLink(i, generation);
                const x = gen3SpritePositions[i].x;
                const y = gen3SpritePositions[i].y;
                ctx.drawImage(pokemon, x, y);
            }
            break;
    }
}

function darkenColor(hsb, light) {
    let [h, s, b] = hsb;

    if (light) {
        b *= 0.53;
    }
    else {
        b *= 0.49;        
    }

    return [h, s, b];
}

function hexToRGB(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    result = [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];

    return result;
}

function RGBtoHSV(rgb) {
    let [r, g, b] = rgb;

    let max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [
        h,
        s,
        v
    ];
}

function HSVtoRGB(hsv) {
    let [h, s, v] = hsv;

    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}
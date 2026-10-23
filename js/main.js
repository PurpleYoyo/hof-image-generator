import { allPokemon, pokemonIntroductionGeneration, hyphenatedBasePokemon } from './pokemon_data.js';
import { darkenColor, hexToRGB, RGBToHex, RGBtoHSV, HSVtoRGB } from './colors.js'

const img = new Image();

const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];
const default_color3 = [57, 104, 86];
const default_color4 = [50, 97, 79];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let color1;
let color2;
let color3;
let color4;

const generationSpriteSizes = {
    '3':    64,
    '4':    80,
    '5':    96,
};

const gameGeneration = {
	'yellow':				1,
	'red-blue':				1,
	'gold':					2,
	'silver':				2,
	'crystal':				2,
	'ruby-sapphire':		3,
	'emerald':				3,
	'firered-leafgreen':	3,
	'diamond-pearl':		4,
	'platinum':				4,
	'heartgold-soulsilver':	4,
	'black-white':			5,
};

const generationRomanNumerals = {
	1: 'i',
	2: 'ii',
	3: 'iii',
	4: 'iv',
	5: 'v',
	6: 'vi',
	7: 'vii',
	8: 'viii',
	9: 'ix',
};

const gen3SpritePositions = {
    1: { x: 48, y: 16 },
    2: { x: 176, y: 16 },
    3: { x: 304, y: 16 },
    4: { x: 16, y: 112 },
    5: { x: 176, y: 112 },
    6: { x: 304, y: 112 },
};

const gen4SpritePositions = {
    1: { x: -16, y: 80 },
    2: { x: 48, y: 96 },
    3: { x: 112, y: 112 },
    4: { x: 240 , y: 112 },
    5: { x: 304, y: 96 },
    6: { x: 368, y: 80 },
};

const generationBackgroundSizes = {
    '3': {
        'x': 480,
        'y': 320,
    },
    '4': {
        'x': 510,
        'y': 376,
    },
};

const presetLinks = [
    'https://raw.githubusercontent.com/PurpleYoyo/hof-image-generator/refs/heads/main/smallchung.png',
];

const generation1Games = ['red-blue', 'yellow'];
const generation2Games = ['gold', 'silver', 'crystal'];

window.addEventListener("load", (event) => {
    buildDropdowns();
    randomizeStartColors();
	buildSuggestions();
	initializeEventListeners();
	randomizePlaceholders();
    start();
});

function buildDropdowns() {
    for (let i = 1; i < 7; i++) {
        const dropdown = document.getElementById(`sprites${i}`);
        ['Default', 'Yellow', 'Red/Blue', 'Crystal', 'Gold', 'Silver', 'Emerald', 'FireRed/LeafGreen', 'Ruby/Sapphire', 'HeartGold/SoulSilver', 'Platinum', 'Diamond/Pearl', 'Black/White'].forEach((game) => {
            let option = document.createElement('option');
            option.value = `${game.toLowerCase().replace('/', '-')}-option`;
            option.text = game;
            dropdown.appendChild(option);
        });
    }
}

function randomizeStartColors() {
    document.getElementById('color1').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
    document.getElementById('color2').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function buildSuggestions() {
    const datalist = document.getElementById('pokemon-suggestions');
    Object.entries(allPokemon).forEach(([name, _]) => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });
}

function initializeEventListeners() {
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
	    input.addEventListener('input', () => modifyLabels(input, i));
	}

	['emerald', 'firered-leafgreen', 'ruby-sapphire', 'heart-and-soul', 'unbound', 'soulgold'].forEach((game) => {
	    document.getElementById(`preset-${game}`).addEventListener('click', () => applyPreset(game));
	});

    for (let i = 1; i < 7; i++) {
        document.getElementById(`name${i}`).addEventListener('change', start);
        document.getElementById(`link${i}`).addEventListener('change', start);
        document.getElementById(`upload${i}`).addEventListener('change', start);
	}

    document.getElementById('download').addEventListener('click', downloadImage);

    document.getElementById('save-configuration').addEventListener('click', saveConfiguration);
    document.getElementById('load-configuration').addEventListener('input', readFile);

    document.getElementById('open-sidebar').addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar').addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) return;
    
    sidebar.style.width = sidebar.style.width === '250px' ? '0' : '250px';
}

function saveConfiguration() {
    const data = {
        'background': getGeneration(),
        'colors': {
            'color1': document.getElementById('color1').value,
            'color2': document.getElementById('color2').value,
        },
        'pokemon': {},
    };

    for (let i = 1; i < 7; i++) {
        data.pokemon[i] = {
            'type': getType(i),
            'name': {
                'pokemon': document.getElementById(`pokemon${i}`).value,
                'sprite': document.getElementById(`sprites${i}`).value,
                'shiny': document.getElementById(`shiny${i}`).checked,
            },
            'link': {
                'link': document.getElementById(`link${i}-text`).value,
            },
            'resize': document.getElementById(`resize${i}`).checked,
            // TODO: drawing priority
        };
    }

    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    a.download = 'hof-config.json';
    a.click();
}

function readFile() {
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

    start();
}

function downloadImage() {
    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL('image/png');

    const a = document.createElement('a');

    a.href = url;
    a.download = 'hall-of-fame.png';

    a.click()
}

function modifyLabels(input, index) {
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

    start();
}

function randomizePlaceholders() {
	for (let i = 1; i < 7; i++) {
		document.getElementById(`pokemon${i}`).placeholder = randomPokemon();

        document.getElementById(`link${i}-text`).placeholder = randomLink();
	}
}

function randomPokemon() {
	let keys = Object.keys(allPokemon);

	return keys[Math.floor(keys.length * Math.random())];
};

function randomLink() {
	return presetLinks[Math.floor(presetLinks.length * Math.random())];
};

function applyPreset(game) {
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
            break;
    }

    start();
}

function start() {
    const generation = getGeneration();

    hideInputs(generation);
    renderPreview(generation);
}

function getGeneration() {
    for (let i = 3; i < 5; i++) {
        if (document.getElementById(`g${i}`).checked) {
            return i.toString();
        }
    }

    return '3';
}

function hideInputs(generation) {
    if (generation !== '3') {
        document.getElementById('color1').classList.add('hidden');
        document.getElementById('color2').classList.add('hidden');

        document.getElementById('g3-presets').classList.add('hidden');
    }
    else {
        document.getElementById('color1').classList.remove('hidden');
        document.getElementById('color2').classList.remove('hidden');

        document.getElementById('g3-presets').classList.remove('hidden');
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

function getType(index) {
    for (const input_type of ['name', 'link', 'upload']) {
        if (document.getElementById(`${input_type}${index}`).checked) {
            return input_type;
        }
    }
    
    return 'name';
}

function renderPreview(generation) {
    const preview = document.getElementById('preview');
    preview.style.width = generationBackgroundSizes[generation].x;
    preview.style.height = generationBackgroundSizes[generation].y;

    img.crossOrigin = 'Anonymous';
    img.src = `images/g${generation}-template.png`;
    
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        case '4':
            break;
    }

    ctx.putImageData(imageData, 0, 0);

    placePokemon(generation);

    copyCanvasToImage();
}

function copyCanvasToImage() {
    const img = document.getElementById('preview');

    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL('image/png');

    img.src = url;
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

function getColors(generation) {
    if (generation === '3') {
        color1 = hexToRGB(document.getElementById('color1').value);
        color2 = hexToRGB(document.getElementById('color2').value);
        color3 = HSVtoRGB(darkenColor(RGBtoHSV(color1), true));
        color4 = HSVtoRGB(darkenColor(RGBtoHSV(color2), false));
    }
}

function placePokemon(generation) {
    let positions;

    switch (generation) {
        default:
        case '3':    
            positions = gen3SpritePositions;
            break;
        case '4':
            positions = gen4SpritePositions;
            break;
    }

    for (let i = 1; i < 7; i++) {
        let pokemon = new Image();
		pokemon.crossOrigin = 'Anonymous';

        const src = buildSpriteLink(i);
        if (src === null) {
            continue;
        }
		pokemon.src = src;
        
        let x = positions[i].x;
        let y = positions[i].y;

        const relativeSpriteSize = generationSpriteSizes[generation] * 2;
        
        pokemon.onload = () => {
            let dWidth = pokemon.width * 2;
            let dHeight = pokemon.height * 2;

            if (pokemon.width !== pokemon.height) {
                if (document.getElementById(`resize${i}`).checked) {
			        dWidth = relativeSpriteSize;
			        dHeight = relativeSpriteSize;
                }
                else {
                    return alert(`Pokemon ${i} sprite has invalid dimensions.`);
                }
            }
            else {
                const sizeDifference = dWidth - relativeSpriteSize;

                x -= sizeDifference / 2;
                y -= sizeDifference / 2;

                const dimensions = placeSpecialCases(document.getElementById(`pokemon${i}`).value);
                if (dimensions !== null) {
                    dWidth = dimensions.width
                    dHeight = dimensions.height

                    x += dimensions.x_offset
                    y += dimensions.y_offset
                }
            }

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(pokemon, x, y, dWidth, dHeight);

            copyCanvasToImage();
        }
    }
}

function placeSpecialCases(name) {
    if (name === 'blaziken-mega') {
        return {
            'width': 160,
            'height': 160,
            'x_offset': 48,
            'y_offset': 0,
        };
    }

    return null;
}

function buildSpriteLink(index) {
    const selected = getType(index);

    switch (selected) {
        default:
        case 'name':
            const pokemon = document.getElementById(`pokemon${index}`).value;
            const sprite = document.getElementById(`sprites${index}`).value.replace('-option', '');
            const shiny = document.getElementById(`shiny${index}`);

            if (!(pokemon in allPokemon)) {
                return null;
            }

            const basePokemon = getBasePokemon(pokemon);
            if (pokemon in pokemonIntroductionGeneration) {
                const generation = gameGeneration[sprite];
                if (generation < pokemonIntroductionGeneration[basePokemon]) {
                    return null;
                }
            }
            else {
                console.log(`${basePokemon} (${pokemon}) not in pokemonIntroductionGeneration.`);
            }
        
	        const number = allPokemon[pokemon];
	        const romanNumeral = generationRomanNumerals[gameGeneration[sprite]];
        
	        if ((generation1Games.concat(generation2Games)).includes(sprite)) {
                let is_gray;

                if (generation1Games.includes(sprite)) {
                    is_gray = shiny.checked ? '' : 'gray/';
                }

                if (generation2Games.includes(sprite)) {
                    is_gray = shiny.checked ? 'gray/' : '';
                }
            
                return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-${romanNumeral}/${sprite}/transparent/${is_gray}${number}.png`;
            }
        
	        let is_shiny = shiny.checked ? 'shiny/' : '';
        
            if (sprite === 'default') {
                return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${is_shiny}${number}.png`;
            }
        
	        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-${romanNumeral}/${sprite}/${is_shiny}${number}.png`;
        case 'link':
            const value = document.getElementById(`link${index}-text`).value;

            return value === '' ? null : value;
        case 'upload':
            const image = document.getElementById(`image${index}`).files[0];
	
	        if (image) {
    	        return URL.createObjectURL(image);
  	        }

            return null;
    }
}

function getBasePokemon(name) {
    if (hyphenatedBasePokemon.includes(name)) {
        return name;
    }

    return name.split('-')[0];
}
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
	'heartgold-soulsiver':	4,
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
    1: { x: 24, y: 8 },
    2: { x: 88, y: 8 },
    3: { x: 152, y: 8 },
    4: { x: 8, y: 56 },
    5: { x: 88, y: 56 },
    6: { x: 168, y: 56 },
};

const gen4SpritePositions = {
    1: { x: -8, y: 40 },
    2: { x: 24, y: 48 },
    3: { x: 56, y: 56 },
    4: { x: 120 , y: 56 },
    5: { x: 152, y: 48 },
    6: { x: 184, y: 40 },
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
}

function saveConfiguration() {
    const data = {
        'pokemon1': document.getElementById('pokemon1').value
    };

    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    a.download = 'hof-config.json';
    a.click();
}

function readFile() {
    const files = document.getElementById('load-configuration').files;

    if (files.length < 1) {
        console.log(1);
        return null;
    }
    console.log(2);

    const fr = new FileReader();

    fr.onload = function(e) {
        const result = e.target.result;
        loadConfiguration(JSON.parse(result))
    }
}

function loadConfiguration(json) {
    console.log(3);
    console.log(json);
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
    img.src = `g${generation}-template.png`;
    img.crossOrigin = 'Anonymous';
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
        
        let x = positions[i].x * 2;
        let y = positions[i].y * 2;

        if (document.getElementById(`sprites${i}`).value === 'default-option'
            && getType(i) === 'name') {
            x -= 32;
            y -= 32;
        }
        
        pokemon.onload = () => {
            let dWidth = pokemon.width * 2;
            let dHeight = pokemon.height * 2;

            if (pokemon.width != pokemon.height) {
                if (document.getElementById(`resize${i}`).checked) {
			        dWidth = 128;
			        dHeight = 128;
                }
                else {
                    return alert(`Pokemon ${i} sprite has invalid dimensions.`);
                }
            }
            else {
                dWidth = dWidth;
		        dHeight = dWidth;
            }

            if (document.getElementById(`pokemon${i}`).value === 'blaziken-mega'
                && getType(i) === 'name') {
                dWidth = 160;
                dHeight = 160;

                x += 48;
                y -= 8;
            }

            ctx.imageSmoothingEnabled  = false;
            ctx.drawImage(pokemon, x, y, dWidth, dHeight);

            copyCanvasToImage();
        }
    }
}

function buildSpriteLink(index) {
    const selected = getType(index);

    switch (selected) {
        default:
        case 'name':
            const pokemon = document.getElementById(`pokemon${index}`).value;
            const sprite = document.getElementById(`sprites${index}`).value.replace('-option', '');
            const shiny = document.getElementById(`shiny${index}`).value;

            if (!(pokemon in allPokemon)) {
                return null;
            }

            if (pokemon in pokemonIntroductionGeneration) {
                const generation = gameGeneration[sprite];

                if (generation < pokemonIntroductionGeneration[pokemon]) {
                    return null;
                }
            }
            else {
                console.log(`${pokemon} not in pokemonIntroductionGeneration.`);
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

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function RGBToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const allPokemon = {
    "bulbasaur": 1,
    "ivysaur": 2,
    "venusaur": 3,
    "charmander": 4,
    "charmeleon": 5,
    "charizard": 6,
    "squirtle": 7,
    "wartortle": 8,
    "blastoise": 9,
    "caterpie": 10,
    "metapod": 11,
    "butterfree": 12,
    "weedle": 13,
    "kakuna": 14,
    "beedrill": 15,
    "pidgey": 16,
    "pidgeotto": 17,
    "pidgeot": 18,
    "rattata": 19,
    "raticate": 20,
    "spearow": 21,
    "fearow": 22,
    "ekans": 23,
    "arbok": 24,
    "pikachu": 25,
    "raichu": 26,
    "sandshrew": 27,
    "sandslash": 28,
    "nidoran-f": 29,
    "nidorina": 30,
    "nidoqueen": 31,
    "nidoran-m": 32,
    "nidorino": 33,
    "nidoking": 34,
    "clefairy": 35,
    "clefable": 36,
    "vulpix": 37,
    "ninetales": 38,
    "jigglypuff": 39,
    "wigglytuff": 40,
    "zubat": 41,
    "golbat": 42,
    "oddish": 43,
    "gloom": 44,
    "vileplume": 45,
    "paras": 46,
    "parasect": 47,
    "venonat": 48,
    "venomoth": 49,
    "diglett": 50,
    "dugtrio": 51,
    "meowth": 52,
    "persian": 53,
    "psyduck": 54,
    "golduck": 55,
    "mankey": 56,
    "primeape": 57,
    "growlithe": 58,
    "arcanine": 59,
    "poliwag": 60,
    "poliwhirl": 61,
    "poliwrath": 62,
    "abra": 63,
    "kadabra": 64,
    "alakazam": 65,
    "machop": 66,
    "machoke": 67,
    "machamp": 68,
    "bellsprout": 69,
    "weepinbell": 70,
    "victreebel": 71,
    "tentacool": 72,
    "tentacruel": 73,
    "geodude": 74,
    "graveler": 75,
    "golem": 76,
    "ponyta": 77,
    "rapidash": 78,
    "slowpoke": 79,
    "slowbro": 80,
    "magnemite": 81,
    "magneton": 82,
    "farfetchd": 83,
    "doduo": 84,
    "dodrio": 85,
    "seel": 86,
    "dewgong": 87,
    "grimer": 88,
    "muk": 89,
    "shellder": 90,
    "cloyster": 91,
    "gastly": 92,
    "haunter": 93,
    "gengar": 94,
    "onix": 95,
    "drowzee": 96,
    "hypno": 97,
    "krabby": 98,
    "kingler": 99,
    "voltorb": 100,
    "electrode": 101,
    "exeggcute": 102,
    "exeggutor": 103,
    "cubone": 104,
    "marowak": 105,
    "hitmonlee": 106,
    "hitmonchan": 107,
    "lickitung": 108,
    "koffing": 109,
    "weezing": 110,
    "rhyhorn": 111,
    "rhydon": 112,
    "chansey": 113,
    "tangela": 114,
    "kangaskhan": 115,
    "horsea": 116,
    "seadra": 117,
    "goldeen": 118,
    "seaking": 119,
    "staryu": 120,
    "starmie": 121,
    "mr-mime": 122,
    "scyther": 123,
    "jynx": 124,
    "electabuzz": 125,
    "magmar": 126,
    "pinsir": 127,
    "tauros": 128,
    "magikarp": 129,
    "gyarados": 130,
    "lapras": 131,
    "ditto": 132,
    "eevee": 133,
    "vaporeon": 134,
    "jolteon": 135,
    "flareon": 136,
    "porygon": 137,
    "omanyte": 138,
    "omastar": 139,
    "kabuto": 140,
    "kabutops": 141,
    "aerodactyl": 142,
    "snorlax": 143,
    "articuno": 144,
    "zapdos": 145,
    "moltres": 146,
    "dratini": 147,
    "dragonair": 148,
    "dragonite": 149,
    "mewtwo": 150,
    "mew": 151,
    "chikorita": 152,
    "bayleef": 153,
    "meganium": 154,
    "cyndaquil": 155,
    "quilava": 156,
    "typhlosion": 157,
    "totodile": 158,
    "croconaw": 159,
    "feraligatr": 160,
    "sentret": 161,
    "furret": 162,
    "hoothoot": 163,
    "noctowl": 164,
    "ledyba": 165,
    "ledian": 166,
    "spinarak": 167,
    "ariados": 168,
    "crobat": 169,
    "chinchou": 170,
    "lanturn": 171,
    "pichu": 172,
    "cleffa": 173,
    "igglybuff": 174,
    "togepi": 175,
    "togetic": 176,
    "natu": 177,
    "xatu": 178,
    "mareep": 179,
    "flaaffy": 180,
    "ampharos": 181,
    "bellossom": 182,
    "marill": 183,
    "azumarill": 184,
    "sudowoodo": 185,
    "politoed": 186,
    "hoppip": 187,
    "skiploom": 188,
    "jumpluff": 189,
    "aipom": 190,
    "sunkern": 191,
    "sunflora": 192,
    "yanma": 193,
    "wooper": 194,
    "quagsire": 195,
    "espeon": 196,
    "umbreon": 197,
    "murkrow": 198,
    "slowking": 199,
    "misdreavus": 200,
    "unown": 201,
    "wobbuffet": 202,
    "girafarig": 203,
    "pineco": 204,
    "forretress": 205,
    "dunsparce": 206,
    "gligar": 207,
    "steelix": 208,
    "snubbull": 209,
    "granbull": 210,
    "qwilfish": 211,
    "scizor": 212,
    "shuckle": 213,
    "heracross": 214,
    "sneasel": 215,
    "teddiursa": 216,
    "ursaring": 217,
    "slugma": 218,
    "magcargo": 219,
    "swinub": 220,
    "piloswine": 221,
    "corsola": 222,
    "remoraid": 223,
    "octillery": 224,
    "delibird": 225,
    "mantine": 226,
    "skarmory": 227,
    "houndour": 228,
    "houndoom": 229,
    "kingdra": 230,
    "phanpy": 231,
    "donphan": 232,
    "porygon2": 233,
    "stantler": 234,
    "smeargle": 235,
    "tyrogue": 236,
    "hitmontop": 237,
    "smoochum": 238,
    "elekid": 239,
    "magby": 240,
    "miltank": 241,
    "blissey": 242,
    "raikou": 243,
    "entei": 244,
    "suicune": 245,
    "larvitar": 246,
    "pupitar": 247,
    "tyranitar": 248,
    "lugia": 249,
    "ho-oh": 250,
    "celebi": 251,
    "treecko": 252,
    "grovyle": 253,
    "sceptile": 254,
    "torchic": 255,
    "combusken": 256,
    "blaziken": 257,
    "mudkip": 258,
    "marshtomp": 259,
    "swampert": 260,
    "poochyena": 261,
    "mightyena": 262,
    "zigzagoon": 263,
    "linoone": 264,
    "wurmple": 265,
    "silcoon": 266,
    "beautifly": 267,
    "cascoon": 268,
    "dustox": 269,
    "lotad": 270,
    "lombre": 271,
    "ludicolo": 272,
    "seedot": 273,
    "nuzleaf": 274,
    "shiftry": 275,
    "taillow": 276,
    "swellow": 277,
    "wingull": 278,
    "pelipper": 279,
    "ralts": 280,
    "kirlia": 281,
    "gardevoir": 282,
    "surskit": 283,
    "masquerain": 284,
    "shroomish": 285,
    "breloom": 286,
    "slakoth": 287,
    "vigoroth": 288,
    "slaking": 289,
    "nincada": 290,
    "ninjask": 291,
    "shedinja": 292,
    "whismur": 293,
    "loudred": 294,
    "exploud": 295,
    "makuhita": 296,
    "hariyama": 297,
    "azurill": 298,
    "nosepass": 299,
    "skitty": 300,
    "delcatty": 301,
    "sableye": 302,
    "mawile": 303,
    "aron": 304,
    "lairon": 305,
    "aggron": 306,
    "meditite": 307,
    "medicham": 308,
    "electrike": 309,
    "manectric": 310,
    "plusle": 311,
    "minun": 312,
    "volbeat": 313,
    "illumise": 314,
    "roselia": 315,
    "gulpin": 316,
    "swalot": 317,
    "carvanha": 318,
    "sharpedo": 319,
    "wailmer": 320,
    "wailord": 321,
    "numel": 322,
    "camerupt": 323,
    "torkoal": 324,
    "spoink": 325,
    "grumpig": 326,
    "spinda": 327,
    "trapinch": 328,
    "vibrava": 329,
    "flygon": 330,
    "cacnea": 331,
    "cacturne": 332,
    "swablu": 333,
    "altaria": 334,
    "zangoose": 335,
    "seviper": 336,
    "lunatone": 337,
    "solrock": 338,
    "barboach": 339,
    "whiscash": 340,
    "corphish": 341,
    "crawdaunt": 342,
    "baltoy": 343,
    "claydol": 344,
    "lileep": 345,
    "cradily": 346,
    "anorith": 347,
    "armaldo": 348,
    "feebas": 349,
    "milotic": 350,
    "castform": 351,
    "kecleon": 352,
    "shuppet": 353,
    "banette": 354,
    "duskull": 355,
    "dusclops": 356,
    "tropius": 357,
    "chimecho": 358,
    "absol": 359,
    "wynaut": 360,
    "snorunt": 361,
    "glalie": 362,
    "spheal": 363,
    "sealeo": 364,
    "walrein": 365,
    "clamperl": 366,
    "huntail": 367,
    "gorebyss": 368,
    "relicanth": 369,
    "luvdisc": 370,
    "bagon": 371,
    "shelgon": 372,
    "salamence": 373,
    "beldum": 374,
    "metang": 375,
    "metagross": 376,
    "regirock": 377,
    "regice": 378,
    "registeel": 379,
    "latias": 380,
    "latios": 381,
    "kyogre": 382,
    "groudon": 383,
    "rayquaza": 384,
    "jirachi": 385,
    "deoxys-normal": 386,
    "turtwig": 387,
    "grotle": 388,
    "torterra": 389,
    "chimchar": 390,
    "monferno": 391,
    "infernape": 392,
    "piplup": 393,
    "prinplup": 394,
    "empoleon": 395,
    "starly": 396,
    "staravia": 397,
    "staraptor": 398,
    "bidoof": 399,
    "bibarel": 400,
    "kricketot": 401,
    "kricketune": 402,
    "shinx": 403,
    "luxio": 404,
    "luxray": 405,
    "budew": 406,
    "roserade": 407,
    "cranidos": 408,
    "rampardos": 409,
    "shieldon": 410,
    "bastiodon": 411,
    "burmy": 412,
    "wormadam-plant": 413,
    "mothim": 414,
    "combee": 415,
    "vespiquen": 416,
    "pachirisu": 417,
    "buizel": 418,
    "floatzel": 419,
    "cherubi": 420,
    "cherrim": 421,
    "shellos": 422,
    "gastrodon": 423,
    "ambipom": 424,
    "drifloon": 425,
    "drifblim": 426,
    "buneary": 427,
    "lopunny": 428,
    "mismagius": 429,
    "honchkrow": 430,
    "glameow": 431,
    "purugly": 432,
    "chingling": 433,
    "stunky": 434,
    "skuntank": 435,
    "bronzor": 436,
    "bronzong": 437,
    "bonsly": 438,
    "mime-jr": 439,
    "happiny": 440,
    "chatot": 441,
    "spiritomb": 442,
    "gible": 443,
    "gabite": 444,
    "garchomp": 445,
    "munchlax": 446,
    "riolu": 447,
    "lucario": 448,
    "hippopotas": 449,
    "hippowdon": 450,
    "skorupi": 451,
    "drapion": 452,
    "croagunk": 453,
    "toxicroak": 454,
    "carnivine": 455,
    "finneon": 456,
    "lumineon": 457,
    "mantyke": 458,
    "snover": 459,
    "abomasnow": 460,
    "weavile": 461,
    "magnezone": 462,
    "lickilicky": 463,
    "rhyperior": 464,
    "tangrowth": 465,
    "electivire": 466,
    "magmortar": 467,
    "togekiss": 468,
    "yanmega": 469,
    "leafeon": 470,
    "glaceon": 471,
    "gliscor": 472,
    "mamoswine": 473,
    "porygon-z": 474,
    "gallade": 475,
    "probopass": 476,
    "dusknoir": 477,
    "froslass": 478,
    "rotom": 479,
    "uxie": 480,
    "mesprit": 481,
    "azelf": 482,
    "dialga": 483,
    "palkia": 484,
    "heatran": 485,
    "regigigas": 486,
    "giratina-altered": 487,
    "cresselia": 488,
    "phione": 489,
    "manaphy": 490,
    "darkrai": 491,
    "shaymin-land": 492,
    "arceus": 493,
    "victini": 494,
    "snivy": 495,
    "servine": 496,
    "serperior": 497,
    "tepig": 498,
    "pignite": 499,
    "emboar": 500,
    "oshawott": 501,
    "dewott": 502,
    "samurott": 503,
    "patrat": 504,
    "watchog": 505,
    "lillipup": 506,
    "herdier": 507,
    "stoutland": 508,
    "purrloin": 509,
    "liepard": 510,
    "pansage": 511,
    "simisage": 512,
    "pansear": 513,
    "simisear": 514,
    "panpour": 515,
    "simipour": 516,
    "munna": 517,
    "musharna": 518,
    "pidove": 519,
    "tranquill": 520,
    "unfezant": 521,
    "blitzle": 522,
    "zebstrika": 523,
    "roggenrola": 524,
    "boldore": 525,
    "gigalith": 526,
    "woobat": 527,
    "swoobat": 528,
    "drilbur": 529,
    "excadrill": 530,
    "audino": 531,
    "timburr": 532,
    "gurdurr": 533,
    "conkeldurr": 534,
    "tympole": 535,
    "palpitoad": 536,
    "seismitoad": 537,
    "throh": 538,
    "sawk": 539,
    "sewaddle": 540,
    "swadloon": 541,
    "leavanny": 542,
    "venipede": 543,
    "whirlipede": 544,
    "scolipede": 545,
    "cottonee": 546,
    "whimsicott": 547,
    "petilil": 548,
    "lilligant": 549,
    "basculin-red-striped": 550,
    "sandile": 551,
    "krokorok": 552,
    "krookodile": 553,
    "darumaka": 554,
    "darmanitan-standard": 555,
    "maractus": 556,
    "dwebble": 557,
    "crustle": 558,
    "scraggy": 559,
    "scrafty": 560,
    "sigilyph": 561,
    "yamask": 562,
    "cofagrigus": 563,
    "tirtouga": 564,
    "carracosta": 565,
    "archen": 566,
    "archeops": 567,
    "trubbish": 568,
    "garbodor": 569,
    "zorua": 570,
    "zoroark": 571,
    "minccino": 572,
    "cinccino": 573,
    "gothita": 574,
    "gothorita": 575,
    "gothitelle": 576,
    "solosis": 577,
    "duosion": 578,
    "reuniclus": 579,
    "ducklett": 580,
    "swanna": 581,
    "vanillite": 582,
    "vanillish": 583,
    "vanilluxe": 584,
    "deerling": 585,
    "sawsbuck": 586,
    "emolga": 587,
    "karrablast": 588,
    "escavalier": 589,
    "foongus": 590,
    "amoonguss": 591,
    "frillish-male": 592,
    "jellicent-male": 593,
    "alomomola": 594,
    "joltik": 595,
    "galvantula": 596,
    "ferroseed": 597,
    "ferrothorn": 598,
    "klink": 599,
    "klang": 600,
    "klinklang": 601,
    "tynamo": 602,
    "eelektrik": 603,
    "eelektross": 604,
    "elgyem": 605,
    "beheeyem": 606,
    "litwick": 607,
    "lampent": 608,
    "chandelure": 609,
    "axew": 610,
    "fraxure": 611,
    "haxorus": 612,
    "cubchoo": 613,
    "beartic": 614,
    "cryogonal": 615,
    "shelmet": 616,
    "accelgor": 617,
    "stunfisk": 618,
    "mienfoo": 619,
    "mienshao": 620,
    "druddigon": 621,
    "golett": 622,
    "golurk": 623,
    "pawniard": 624,
    "bisharp": 625,
    "bouffalant": 626,
    "rufflet": 627,
    "braviary": 628,
    "vullaby": 629,
    "mandibuzz": 630,
    "heatmor": 631,
    "durant": 632,
    "deino": 633,
    "zweilous": 634,
    "hydreigon": 635,
    "larvesta": 636,
    "volcarona": 637,
    "cobalion": 638,
    "terrakion": 639,
    "virizion": 640,
    "tornadus-incarnate": 641,
    "thundurus-incarnate": 642,
    "reshiram": 643,
    "zekrom": 644,
    "landorus-incarnate": 645,
    "kyurem": 646,
    "keldeo-ordinary": 647,
    "meloetta-aria": 648,
    "genesect": 649,
    "chespin": 650,
    "quilladin": 651,
    "chesnaught": 652,
    "fennekin": 653,
    "braixen": 654,
    "delphox": 655,
    "froakie": 656,
    "frogadier": 657,
    "greninja": 658,
    "bunnelby": 659,
    "diggersby": 660,
    "fletchling": 661,
    "fletchinder": 662,
    "talonflame": 663,
    "scatterbug": 664,
    "spewpa": 665,
    "vivillon": 666,
    "litleo": 667,
    "pyroar-male": 668,
    "flabebe": 669,
    "floette": 670,
    "florges": 671,
    "skiddo": 672,
    "gogoat": 673,
    "pancham": 674,
    "pangoro": 675,
    "furfrou": 676,
    "espurr": 677,
    "meowstic-male": 678,
    "honedge": 679,
    "doublade": 680,
    "aegislash-shield": 681,
    "spritzee": 682,
    "aromatisse": 683,
    "swirlix": 684,
    "slurpuff": 685,
    "inkay": 686,
    "malamar": 687,
    "binacle": 688,
    "barbaracle": 689,
    "skrelp": 690,
    "dragalge": 691,
    "clauncher": 692,
    "clawitzer": 693,
    "helioptile": 694,
    "heliolisk": 695,
    "tyrunt": 696,
    "tyrantrum": 697,
    "amaura": 698,
    "aurorus": 699,
    "sylveon": 700,
    "hawlucha": 701,
    "dedenne": 702,
    "carbink": 703,
    "goomy": 704,
    "sliggoo": 705,
    "goodra": 706,
    "klefki": 707,
    "phantump": 708,
    "trevenant": 709,
    "pumpkaboo-average": 710,
    "gourgeist-average": 711,
    "bergmite": 712,
    "avalugg": 713,
    "noibat": 714,
    "noivern": 715,
    "xerneas": 716,
    "yveltal": 717,
    "zygarde-50": 718,
    "diancie": 719,
    "hoopa": 720,
    "volcanion": 721,
    "rowlet": 722,
    "dartrix": 723,
    "decidueye": 724,
    "litten": 725,
    "torracat": 726,
    "incineroar": 727,
    "popplio": 728,
    "brionne": 729,
    "primarina": 730,
    "pikipek": 731,
    "trumbeak": 732,
    "toucannon": 733,
    "yungoos": 734,
    "gumshoos": 735,
    "grubbin": 736,
    "charjabug": 737,
    "vikavolt": 738,
    "crabrawler": 739,
    "crabominable": 740,
    "oricorio-baile": 741,
    "cutiefly": 742,
    "ribombee": 743,
    "rockruff": 744,
    "lycanroc-midday": 745,
    "wishiwashi-solo": 746,
    "mareanie": 747,
    "toxapex": 748,
    "mudbray": 749,
    "mudsdale": 750,
    "dewpider": 751,
    "araquanid": 752,
    "fomantis": 753,
    "lurantis": 754,
    "morelull": 755,
    "shiinotic": 756,
    "salandit": 757,
    "salazzle": 758,
    "stufful": 759,
    "bewear": 760,
    "bounsweet": 761,
    "steenee": 762,
    "tsareena": 763,
    "comfey": 764,
    "oranguru": 765,
    "passimian": 766,
    "wimpod": 767,
    "golisopod": 768,
    "sandygast": 769,
    "palossand": 770,
    "pyukumuku": 771,
    "type-null": 772,
    "silvally": 773,
    "minior-red-meteor": 774,
    "komala": 775,
    "turtonator": 776,
    "togedemaru": 777,
    "mimikyu-disguised": 778,
    "bruxish": 779,
    "drampa": 780,
    "dhelmise": 781,
    "jangmo-o": 782,
    "hakamo-o": 783,
    "kommo-o": 784,
    "tapu-koko": 785,
    "tapu-lele": 786,
    "tapu-bulu": 787,
    "tapu-fini": 788,
    "cosmog": 789,
    "cosmoem": 790,
    "solgaleo": 791,
    "lunala": 792,
    "nihilego": 793,
    "buzzwole": 794,
    "pheromosa": 795,
    "xurkitree": 796,
    "celesteela": 797,
    "kartana": 798,
    "guzzlord": 799,
    "necrozma": 800,
    "magearna": 801,
    "marshadow": 802,
    "poipole": 803,
    "naganadel": 804,
    "stakataka": 805,
    "blacephalon": 806,
    "zeraora": 807,
    "meltan": 808,
    "melmetal": 809,
    "grookey": 810,
    "thwackey": 811,
    "rillaboom": 812,
    "scorbunny": 813,
    "raboot": 814,
    "cinderace": 815,
    "sobble": 816,
    "drizzile": 817,
    "inteleon": 818,
    "skwovet": 819,
    "greedent": 820,
    "rookidee": 821,
    "corvisquire": 822,
    "corviknight": 823,
    "blipbug": 824,
    "dottler": 825,
    "orbeetle": 826,
    "nickit": 827,
    "thievul": 828,
    "gossifleur": 829,
    "eldegoss": 830,
    "wooloo": 831,
    "dubwool": 832,
    "chewtle": 833,
    "drednaw": 834,
    "yamper": 835,
    "boltund": 836,
    "rolycoly": 837,
    "carkol": 838,
    "coalossal": 839,
    "applin": 840,
    "flapple": 841,
    "appletun": 842,
    "silicobra": 843,
    "sandaconda": 844,
    "cramorant": 845,
    "arrokuda": 846,
    "barraskewda": 847,
    "toxel": 848,
    "toxtricity-amped": 849,
    "sizzlipede": 850,
    "centiskorch": 851,
    "clobbopus": 852,
    "grapploct": 853,
    "sinistea": 854,
    "polteageist": 855,
    "hatenna": 856,
    "hattrem": 857,
    "hatterene": 858,
    "impidimp": 859,
    "morgrem": 860,
    "grimmsnarl": 861,
    "obstagoon": 862,
    "perrserker": 863,
    "cursola": 864,
    "sirfetchd": 865,
    "mr-rime": 866,
    "runerigus": 867,
    "milcery": 868,
    "alcremie": 869,
    "falinks": 870,
    "pincurchin": 871,
    "snom": 872,
    "frosmoth": 873,
    "stonjourner": 874,
    "eiscue-ice": 875,
    "indeedee-male": 876,
    "morpeko-full-belly": 877,
    "cufant": 878,
    "copperajah": 879,
    "dracozolt": 880,
    "arctozolt": 881,
    "dracovish": 882,
    "arctovish": 883,
    "duraludon": 884,
    "dreepy": 885,
    "drakloak": 886,
    "dragapult": 887,
    "zacian": 888,
    "zamazenta": 889,
    "eternatus": 890,
    "kubfu": 891,
    "urshifu-single-strike": 892,
    "zarude": 893,
    "regieleki": 894,
    "regidrago": 895,
    "glastrier": 896,
    "spectrier": 897,
    "calyrex": 898,
    "wyrdeer": 899,
    "kleavor": 900,
    "ursaluna": 901,
    "basculegion-male": 902,
    "sneasler": 903,
    "overqwil": 904,
    "enamorus-incarnate": 905,
    "sprigatito": 906,
    "floragato": 907,
    "meowscarada": 908,
    "fuecoco": 909,
    "crocalor": 910,
    "skeledirge": 911,
    "quaxly": 912,
    "quaxwell": 913,
    "quaquaval": 914,
    "lechonk": 915,
    "oinkologne-male": 916,
    "tarountula": 917,
    "spidops": 918,
    "nymble": 919,
    "lokix": 920,
    "pawmi": 921,
    "pawmo": 922,
    "pawmot": 923,
    "tandemaus": 924,
    "maushold-family-of-four": 925,
    "fidough": 926,
    "dachsbun": 927,
    "smoliv": 928,
    "dolliv": 929,
    "arboliva": 930,
    "squawkabilly-green-plumage": 931,
    "nacli": 932,
    "naclstack": 933,
    "garganacl": 934,
    "charcadet": 935,
    "armarouge": 936,
    "ceruledge": 937,
    "tadbulb": 938,
    "bellibolt": 939,
    "wattrel": 940,
    "kilowattrel": 941,
    "maschiff": 942,
    "mabosstiff": 943,
    "shroodle": 944,
    "grafaiai": 945,
    "bramblin": 946,
    "brambleghast": 947,
    "toedscool": 948,
    "toedscruel": 949,
    "klawf": 950,
    "capsakid": 951,
    "scovillain": 952,
    "rellor": 953,
    "rabsca": 954,
    "flittle": 955,
    "espathra": 956,
    "tinkatink": 957,
    "tinkatuff": 958,
    "tinkaton": 959,
    "wiglett": 960,
    "wugtrio": 961,
    "bombirdier": 962,
    "finizen": 963,
    "palafin-zero": 964,
    "varoom": 965,
    "revavroom": 966,
    "cyclizar": 967,
    "orthworm": 968,
    "glimmet": 969,
    "glimmora": 970,
    "greavard": 971,
    "houndstone": 972,
    "flamigo": 973,
    "cetoddle": 974,
    "cetitan": 975,
    "veluza": 976,
    "dondozo": 977,
    "tatsugiri-curly": 978,
    "annihilape": 979,
    "clodsire": 980,
    "farigiraf": 981,
    "dudunsparce-two-segment": 982,
    "kingambit": 983,
    "great-tusk": 984,
    "scream-tail": 985,
    "brute-bonnet": 986,
    "flutter-mane": 987,
    "slither-wing": 988,
    "sandy-shocks": 989,
    "iron-treads": 990,
    "iron-bundle": 991,
    "iron-hands": 992,
    "iron-jugulis": 993,
    "iron-moth": 994,
    "iron-thorns": 995,
    "frigibax": 996,
    "arctibax": 997,
    "baxcalibur": 998,
    "gimmighoul": 999,
    "gholdengo": 1000,
    "wo-chien": 1001,
    "chien-pao": 1002,
    "ting-lu": 1003,
    "chi-yu": 1004,
    "roaring-moon": 1005,
    "iron-valiant": 1006,
    "koraidon": 1007,
    "miraidon": 1008,
    "walking-wake": 1009,
    "iron-leaves": 1010,
    "dipplin": 1011,
    "poltchageist": 1012,
    "sinistcha": 1013,
    "okidogi": 1014,
    "munkidori": 1015,
    "fezandipiti": 1016,
    "ogerpon": 1017,
    "archaludon": 1018,
    "hydrapple": 1019,
    "gouging-fire": 1020,
    "raging-bolt": 1021,
    "iron-boulder": 1022,
    "iron-crown": 1023,
    "terapagos": 1024,
    "pecharunt": 1025,
    "deoxys-attack": 10001,
    "deoxys-defense": 10002,
    "deoxys-speed": 10003,
    "wormadam-sandy": 10004,
    "wormadam-trash": 10005,
    "shaymin-sky": 10006,
    "giratina-origin": 10007,
    "rotom-heat": 10008,
    "rotom-wash": 10009,
    "rotom-frost": 10010,
    "rotom-fan": 10011,
    "rotom-mow": 10012,
    "castform-sunny": 10013,
    "castform-rainy": 10014,
    "castform-snowy": 10015,
    "basculin-blue-striped": 10016,
    "darmanitan-zen": 10017,
    "meloetta-pirouette": 10018,
    "tornadus-therian": 10019,
    "thundurus-therian": 10020,
    "landorus-therian": 10021,
    "kyurem-black": 10022,
    "kyurem-white": 10023,
    "keldeo-resolute": 10024,
    "meowstic-female": 10025,
    "aegislash-blade": 10026,
    "pumpkaboo-small": 10027,
    "pumpkaboo-large": 10028,
    "pumpkaboo-super": 10029,
    "gourgeist-small": 10030,
    "gourgeist-large": 10031,
    "gourgeist-super": 10032,
    "venusaur-mega": 10033,
    "charizard-mega-x": 10034,
    "charizard-mega-y": 10035,
    "blastoise-mega": 10036,
    "alakazam-mega": 10037,
    "gengar-mega": 10038,
    "kangaskhan-mega": 10039,
    "pinsir-mega": 10040,
    "gyarados-mega": 10041,
    "aerodactyl-mega": 10042,
    "mewtwo-mega-x": 10043,
    "mewtwo-mega-y": 10044,
    "ampharos-mega": 10045,
    "scizor-mega": 10046,
    "heracross-mega": 10047,
    "houndoom-mega": 10048,
    "tyranitar-mega": 10049,
    "blaziken-mega": 10050,
    "gardevoir-mega": 10051,
    "mawile-mega": 10052,
    "aggron-mega": 10053,
    "medicham-mega": 10054,
    "manectric-mega": 10055,
    "banette-mega": 10056,
    "absol-mega": 10057,
    "garchomp-mega": 10058,
    "lucario-mega": 10059,
    "abomasnow-mega": 10060,
    "floette-eternal": 10061,
    "latias-mega": 10062,
    "latios-mega": 10063,
    "swampert-mega": 10064,
    "sceptile-mega": 10065,
    "sableye-mega": 10066,
    "altaria-mega": 10067,
    "gallade-mega": 10068,
    "audino-mega": 10069,
    "sharpedo-mega": 10070,
    "slowbro-mega": 10071,
    "steelix-mega": 10072,
    "pidgeot-mega": 10073,
    "glalie-mega": 10074,
    "diancie-mega": 10075,
    "metagross-mega": 10076,
    "kyogre-primal": 10077,
    "groudon-primal": 10078,
    "rayquaza-mega": 10079,
    "pikachu-rock-star": 10080,
    "pikachu-belle": 10081,
    "pikachu-pop-star": 10082,
    "pikachu-phd": 10083,
    "pikachu-libre": 10084,
    "pikachu-cosplay": 10085,
    "hoopa-unbound": 10086,
    "camerupt-mega": 10087,
    "lopunny-mega": 10088,
    "salamence-mega": 10089,
    "beedrill-mega": 10090,
    "rattata-alola": 10091,
    "raticate-alola": 10092,
    "raticate-totem-alola": 10093,
    "pikachu-original-cap": 10094,
    "pikachu-hoenn-cap": 10095,
    "pikachu-sinnoh-cap": 10096,
    "pikachu-unova-cap": 10097,
    "pikachu-kalos-cap": 10098,
    "pikachu-alola-cap": 10099,
    "raichu-alola": 10100,
    "sandshrew-alola": 10101,
    "sandslash-alola": 10102,
    "vulpix-alola": 10103,
    "ninetales-alola": 10104,
    "diglett-alola": 10105,
    "dugtrio-alola": 10106,
    "meowth-alola": 10107,
    "persian-alola": 10108,
    "geodude-alola": 10109,
    "graveler-alola": 10110,
    "golem-alola": 10111,
    "grimer-alola": 10112,
    "muk-alola": 10113,
    "exeggutor-alola": 10114,
    "marowak-alola": 10115,
    "greninja-battle-bond": 10116,
    "greninja-ash": 10117,
    "zygarde-10-power-construct": 10118,
    "zygarde-50-power-construct": 10119,
    "zygarde-complete": 10120,
    "gumshoos-totem": 10121,
    "vikavolt-totem": 10122,
    "oricorio-pom-pom": 10123,
    "oricorio-pau": 10124,
    "oricorio-sensu": 10125,
    "lycanroc-midnight": 10126,
    "wishiwashi-school": 10127,
    "lurantis-totem": 10128,
    "salazzle-totem": 10129,
    "minior-orange-meteor": 10130,
    "minior-yellow-meteor": 10131,
    "minior-green-meteor": 10132,
    "minior-blue-meteor": 10133,
    "minior-indigo-meteor": 10134,
    "minior-violet-meteor": 10135,
    "minior-red": 10136,
    "minior-orange": 10137,
    "minior-yellow": 10138,
    "minior-green": 10139,
    "minior-blue": 10140,
    "minior-indigo": 10141,
    "minior-violet": 10142,
    "mimikyu-busted": 10143,
    "mimikyu-totem-disguised": 10144,
    "mimikyu-totem-busted": 10145,
    "kommo-o-totem": 10146,
    "magearna-original": 10147,
    "pikachu-partner-cap": 10148,
    "marowak-totem": 10149,
    "ribombee-totem": 10150,
    "rockruff-own-tempo": 10151,
    "lycanroc-dusk": 10152,
    "araquanid-totem": 10153,
    "togedemaru-totem": 10154,
    "necrozma-dusk": 10155,
    "necrozma-dawn": 10156,
    "necrozma-ultra": 10157,
    "pikachu-starter": 10158,
    "eevee-starter": 10159,
    "pikachu-world-cap": 10160,
    "meowth-galar": 10161,
    "ponyta-galar": 10162,
    "rapidash-galar": 10163,
    "slowpoke-galar": 10164,
    "slowbro-galar": 10165,
    "farfetchd-galar": 10166,
    "weezing-galar": 10167,
    "mr-mime-galar": 10168,
    "articuno-galar": 10169,
    "zapdos-galar": 10170,
    "moltres-galar": 10171,
    "slowking-galar": 10172,
    "corsola-galar": 10173,
    "zigzagoon-galar": 10174,
    "linoone-galar": 10175,
    "darumaka-galar": 10176,
    "darmanitan-galar-standard": 10177,
    "darmanitan-galar-zen": 10178,
    "yamask-galar": 10179,
    "stunfisk-galar": 10180,
    "zygarde-10": 10181,
    "cramorant-gulping": 10182,
    "cramorant-gorging": 10183,
    "toxtricity-low-key": 10184,
    "eiscue-noice": 10185,
    "indeedee-female": 10186,
    "morpeko-hangry": 10187,
    "zacian-crowned": 10188,
    "zamazenta-crowned": 10189,
    "eternatus-eternamax": 10190,
    "urshifu-rapid-strike": 10191,
    "zarude-dada": 10192,
    "calyrex-ice": 10193,
    "calyrex-shadow": 10194,
    "venusaur-gmax": 10195,
    "charizard-gmax": 10196,
    "blastoise-gmax": 10197,
    "butterfree-gmax": 10198,
    "pikachu-gmax": 10199,
    "meowth-gmax": 10200,
    "machamp-gmax": 10201,
    "gengar-gmax": 10202,
    "kingler-gmax": 10203,
    "lapras-gmax": 10204,
    "eevee-gmax": 10205,
    "snorlax-gmax": 10206,
    "garbodor-gmax": 10207,
    "melmetal-gmax": 10208,
    "rillaboom-gmax": 10209,
    "cinderace-gmax": 10210,
    "inteleon-gmax": 10211,
    "corviknight-gmax": 10212,
    "orbeetle-gmax": 10213,
    "drednaw-gmax": 10214,
    "coalossal-gmax": 10215,
    "flapple-gmax": 10216,
    "appletun-gmax": 10217,
    "sandaconda-gmax": 10218,
    "toxtricity-amped-gmax": 10219,
    "centiskorch-gmax": 10220,
    "hatterene-gmax": 10221,
    "grimmsnarl-gmax": 10222,
    "alcremie-gmax": 10223,
    "copperajah-gmax": 10224,
    "duraludon-gmax": 10225,
    "urshifu-single-strike-gmax": 10226,
    "urshifu-rapid-strike-gmax": 10227,
    "toxtricity-low-key-gmax": 10228,
    "growlithe-hisui": 10229,
    "arcanine-hisui": 10230,
    "voltorb-hisui": 10231,
    "electrode-hisui": 10232,
    "typhlosion-hisui": 10233,
    "qwilfish-hisui": 10234,
    "sneasel-hisui": 10235,
    "samurott-hisui": 10236,
    "lilligant-hisui": 10237,
    "zorua-hisui": 10238,
    "zoroark-hisui": 10239,
    "braviary-hisui": 10240,
    "sliggoo-hisui": 10241,
    "goodra-hisui": 10242,
    "avalugg-hisui": 10243,
    "decidueye-hisui": 10244,
    "dialga-origin": 10245,
    "palkia-origin": 10246,
    "basculin-white-striped": 10247,
    "basculegion-female": 10248,
    "enamorus-therian": 10249,
    "tauros-paldea-combat-breed": 10250,
    "tauros-paldea-blaze-breed": 10251,
    "tauros-paldea-aqua-breed": 10252,
    "wooper-paldea": 10253,
    "oinkologne-female": 10254,
    "dudunsparce-three-segment": 10255,
    "palafin-hero": 10256,
    "maushold-family-of-three": 10257,
    "tatsugiri-droopy": 10258,
    "tatsugiri-stretchy": 10259,
    "squawkabilly-blue-plumage": 10260,
    "squawkabilly-yellow-plumage": 10261,
    "squawkabilly-white-plumage": 10262,
    "gimmighoul-roaming": 10263,
    "koraidon-limited-build": 10264,
    "koraidon-sprinting-build": 10265,
    "koraidon-swimming-build": 10266,
    "koraidon-gliding-build": 10267,
    "miraidon-low-power-mode": 10268,
    "miraidon-drive-mode": 10269,
    "miraidon-aquatic-mode": 10270,
    "miraidon-glide-mode": 10271,
    "ursaluna-bloodmoon": 10272,
    "ogerpon-wellspring-mask": 10273,
    "ogerpon-hearthflame-mask": 10274,
    "ogerpon-cornerstone-mask": 10275,
    "terapagos-terastal": 10276,
    "terapagos-stellar": 10277,
    "clefable-mega": 10278,
    "victreebel-mega": 10279,
    "starmie-mega": 10280,
    "dragonite-mega": 10281,
    "meganium-mega": 10282,
    "feraligatr-mega": 10283,
    "skarmory-mega": 10284,
    "froslass-mega": 10285,
    "emboar-mega": 10286,
    "excadrill-mega": 10287,
    "scolipede-mega": 10288,
    "scrafty-mega": 10289,
    "eelektross-mega": 10290,
    "chandelure-mega": 10291,
    "chesnaught-mega": 10292,
    "delphox-mega": 10293,
    "greninja-mega": 10294,
    "pyroar-mega": 10295,
    "floette-mega": 10296,
    "malamar-mega": 10297,
    "barbaracle-mega": 10298,
    "dragalge-mega": 10299,
    "hawlucha-mega": 10300,
    "zygarde-mega": 10301,
    "drampa-mega": 10302,
    "falinks-mega": 10303,
    "raichu-mega-x": 10304,
    "raichu-mega-y": 10305,
    "chimecho-mega": 10306,
    "absol-mega-z": 10307,
    "staraptor-mega": 10308,
    "garchomp-mega-z": 10309,
    "lucario-mega-z": 10310,
    "heatran-mega": 10311,
    "darkrai-mega": 10312,
    "golurk-mega": 10313,
    "meowstic-male-mega": 10314,
    "crabominable-mega": 10315,
    "golisopod-mega": 10316,
    "magearna-mega": 10317,
    "magearna-original-mega": 10318,
    "zeraora-mega": 10319,
    "scovillain-mega": 10320,
    "glimmora-mega": 10321,
    "tatsugiri-curly-mega": 10322,
    "tatsugiri-droopy-mega": 10323,
    "tatsugiri-stretchy-mega": 10324,
    "baxcalibur-mega": 10325,
    "meowstic-female-mega": 10326
};

const pokemonIntroductionGeneration = {
    "bulbasaur": 1,
    "ivysaur": 1,
    "venusaur": 1,
    "charmander": 1,
    "charmeleon": 1,
    "charizard": 1,
    "squirtle": 1,
    "wartortle": 1,
    "blastoise": 1,
    "caterpie": 1,
    "metapod": 1,
    "butterfree": 1,
    "weedle": 1,
    "kakuna": 1,
    "beedrill": 1,
    "pidgey": 1,
    "pidgeotto": 1,
    "pidgeot": 1,
    "rattata": 1,
    "raticate": 1,
    "spearow": 1,
    "fearow": 1,
    "ekans": 1,
    "arbok": 1,
    "pikachu": 1,
    "raichu": 1,
    "sandshrew": 1,
    "sandslash": 1,
    "nidoran-f": 1,
    "nidorina": 1,
    "nidoqueen": 1,
    "nidoran-m": 1,
    "nidorino": 1,
    "nidoking": 1,
    "clefairy": 1,
    "clefable": 1,
    "vulpix": 1,
    "ninetales": 1,
    "jigglypuff": 1,
    "wigglytuff": 1,
    "zubat": 1,
    "golbat": 1,
    "oddish": 1,
    "gloom": 1,
    "vileplume": 1,
    "paras": 1,
    "parasect": 1,
    "venonat": 1,
    "venomoth": 1,
    "diglett": 1,
    "dugtrio": 1,
    "meowth": 1,
    "persian": 1,
    "psyduck": 1,
    "golduck": 1,
    "mankey": 1,
    "primeape": 1,
    "growlithe": 1,
    "arcanine": 1,
    "poliwag": 1,
    "poliwhirl": 1,
    "poliwrath": 1,
    "abra": 1,
    "kadabra": 1,
    "alakazam": 1,
    "machop": 1,
    "machoke": 1,
    "machamp": 1,
    "bellsprout": 1,
    "weepinbell": 1,
    "victreebel": 1,
    "tentacool": 1,
    "tentacruel": 1,
    "geodude": 1,
    "graveler": 1,
    "golem": 1,
    "ponyta": 1,
    "rapidash": 1,
    "slowpoke": 1,
    "slowbro": 1,
    "magnemite": 1,
    "magneton": 1,
    "farfetchd": 1,
    "doduo": 1,
    "dodrio": 1,
    "seel": 1,
    "dewgong": 1,
    "grimer": 1,
    "muk": 1,
    "shellder": 1,
    "cloyster": 1,
    "gastly": 1,
    "haunter": 1,
    "gengar": 1,
    "onix": 1,
    "drowzee": 1,
    "hypno": 1,
    "krabby": 1,
    "kingler": 1,
    "voltorb": 1,
    "electrode": 1,
    "exeggcute": 1,
    "exeggutor": 1,
    "cubone": 1,
    "marowak": 1,
    "hitmonlee": 1,
    "hitmonchan": 1,
    "lickitung": 1,
    "koffing": 1,
    "weezing": 1,
    "rhyhorn": 1,
    "rhydon": 1,
    "chansey": 1,
    "tangela": 1,
    "kangaskhan": 1,
    "horsea": 1,
    "seadra": 1,
    "goldeen": 1,
    "seaking": 1,
    "staryu": 1,
    "starmie": 1,
    "mr-mime": 1,
    "scyther": 1,
    "jynx": 1,
    "electabuzz": 1,
    "magmar": 1,
    "pinsir": 1,
    "tauros": 1,
    "magikarp": 1,
    "gyarados": 1,
    "lapras": 1,
    "ditto": 1,
    "eevee": 1,
    "vaporeon": 1,
    "jolteon": 1,
    "flareon": 1,
    "porygon": 1,
    "omanyte": 1,
    "omastar": 1,
    "kabuto": 1,
    "kabutops": 1,
    "aerodactyl": 1,
    "snorlax": 1,
    "articuno": 1,
    "zapdos": 1,
    "moltres": 1,
    "dratini": 1,
    "dragonair": 1,
    "dragonite": 1,
    "mewtwo": 1,
    "mew": 1,
    "chikorita": 2,
    "bayleef": 2,
    "meganium": 2,
    "cyndaquil": 2,
    "quilava": 2,
    "typhlosion": 2,
    "totodile": 2,
    "croconaw": 2,
    "feraligatr": 2,
    "sentret": 2,
    "furret": 2,
    "hoothoot": 2,
    "noctowl": 2,
    "ledyba": 2,
    "ledian": 2,
    "spinarak": 2,
    "ariados": 2,
    "crobat": 2,
    "chinchou": 2,
    "lanturn": 2,
    "pichu": 2,
    "cleffa": 2,
    "igglybuff": 2,
    "togepi": 2,
    "togetic": 2,
    "natu": 2,
    "xatu": 2,
    "mareep": 2,
    "flaaffy": 2,
    "ampharos": 2,
    "bellossom": 2,
    "marill": 2,
    "azumarill": 2,
    "sudowoodo": 2,
    "politoed": 2,
    "hoppip": 2,
    "skiploom": 2,
    "jumpluff": 2,
    "aipom": 2,
    "sunkern": 2,
    "sunflora": 2,
    "yanma": 2,
    "wooper": 2,
    "quagsire": 2,
    "espeon": 2,
    "umbreon": 2,
    "murkrow": 2,
    "slowking": 2,
    "misdreavus": 2,
    "unown": 2,
    "wobbuffet": 2,
    "girafarig": 2,
    "pineco": 2,
    "forretress": 2,
    "dunsparce": 2,
    "gligar": 2,
    "steelix": 2,
    "snubbull": 2,
    "granbull": 2,
    "qwilfish": 2,
    "scizor": 2,
    "shuckle": 2,
    "heracross": 2,
    "sneasel": 2,
    "teddiursa": 2,
    "ursaring": 2,
    "slugma": 2,
    "magcargo": 2,
    "swinub": 2,
    "piloswine": 2,
    "corsola": 2,
    "remoraid": 2,
    "octillery": 2,
    "delibird": 2,
    "mantine": 2,
    "skarmory": 2,
    "houndour": 2,
    "houndoom": 2,
    "kingdra": 2,
    "phanpy": 2,
    "donphan": 2,
    "porygon2": 2,
    "stantler": 2,
    "smeargle": 2,
    "tyrogue": 2,
    "hitmontop": 2,
    "smoochum": 2,
    "elekid": 2,
    "magby": 2,
    "miltank": 2,
    "blissey": 2,
    "raikou": 2,
    "entei": 2,
    "suicune": 2,
    "larvitar": 2,
    "pupitar": 2,
    "tyranitar": 2,
    "lugia": 2,
    "ho-oh": 2,
    "celebi": 2,
    "treecko": 3,
    "grovyle": 3,
    "sceptile": 3,
    "torchic": 3,
    "combusken": 3,
    "blaziken": 3,
    "mudkip": 3,
    "marshtomp": 3,
    "swampert": 3,
    "poochyena": 3,
    "mightyena": 3,
    "zigzagoon": 3,
    "linoone": 3,
    "wurmple": 3,
    "silcoon": 3,
    "beautifly": 3,
    "cascoon": 3,
    "dustox": 3,
    "lotad": 3,
    "lombre": 3,
    "ludicolo": 3,
    "seedot": 3,
    "nuzleaf": 3,
    "shiftry": 3,
    "taillow": 3,
    "swellow": 3,
    "wingull": 3,
    "pelipper": 3,
    "ralts": 3,
    "kirlia": 3,
    "gardevoir": 3,
    "surskit": 3,
    "masquerain": 3,
    "shroomish": 3,
    "breloom": 3,
    "slakoth": 3,
    "vigoroth": 3,
    "slaking": 3,
    "nincada": 3,
    "ninjask": 3,
    "shedinja": 3,
    "whismur": 3,
    "loudred": 3,
    "exploud": 3,
    "makuhita": 3,
    "hariyama": 3,
    "azurill": 3,
    "nosepass": 3,
    "skitty": 3,
    "delcatty": 3,
    "sableye": 3,
    "mawile": 3,
    "aron": 3,
    "lairon": 3,
    "aggron": 3,
    "meditite": 3,
    "medicham": 3,
    "electrike": 3,
    "manectric": 3,
    "plusle": 3,
    "minun": 3,
    "volbeat": 3,
    "illumise": 3,
    "roselia": 3,
    "gulpin": 3,
    "swalot": 3,
    "carvanha": 3,
    "sharpedo": 3,
    "wailmer": 3,
    "wailord": 3,
    "numel": 3,
    "camerupt": 3,
    "torkoal": 3,
    "spoink": 3,
    "grumpig": 3,
    "spinda": 3,
    "trapinch": 3,
    "vibrava": 3,
    "flygon": 3,
    "cacnea": 3,
    "cacturne": 3,
    "swablu": 3,
    "altaria": 3,
    "zangoose": 3,
    "seviper": 3,
    "lunatone": 3,
    "solrock": 3,
    "barboach": 3,
    "whiscash": 3,
    "corphish": 3,
    "crawdaunt": 3,
    "baltoy": 3,
    "claydol": 3,
    "lileep": 3,
    "cradily": 3,
    "anorith": 3,
    "armaldo": 3,
    "feebas": 3,
    "milotic": 3,
    "castform": 3,
    "kecleon": 3,
    "shuppet": 3,
    "banette": 3,
    "duskull": 3,
    "dusclops": 3,
    "tropius": 3,
    "chimecho": 3,
    "absol": 3,
    "wynaut": 3,
    "snorunt": 3,
    "glalie": 3,
    "spheal": 3,
    "sealeo": 3,
    "walrein": 3,
    "clamperl": 3,
    "huntail": 3,
    "gorebyss": 3,
    "relicanth": 3,
    "luvdisc": 3,
    "bagon": 3,
    "shelgon": 3,
    "salamence": 3,
    "beldum": 3,
    "metang": 3,
    "metagross": 3,
    "regirock": 3,
    "regice": 3,
    "registeel": 3,
    "latias": 3,
    "latios": 3,
    "kyogre": 3,
    "groudon": 3,
    "rayquaza": 3,
    "jirachi": 3,
    "deoxys": 3,
    "turtwig": 4,
    "grotle": 4,
    "torterra": 4,
    "chimchar": 4,
    "monferno": 4,
    "infernape": 4,
    "piplup": 4,
    "prinplup": 4,
    "empoleon": 4,
    "starly": 4,
    "staravia": 4,
    "staraptor": 4,
    "bidoof": 4,
    "bibarel": 4,
    "kricketot": 4,
    "kricketune": 4,
    "shinx": 4,
    "luxio": 4,
    "luxray": 4,
    "budew": 4,
    "roserade": 4,
    "cranidos": 4,
    "rampardos": 4,
    "shieldon": 4,
    "bastiodon": 4,
    "burmy": 4,
    "wormadam": 4,
    "mothim": 4,
    "combee": 4,
    "vespiquen": 4,
    "pachirisu": 4,
    "buizel": 4,
    "floatzel": 4,
    "cherubi": 4,
    "cherrim": 4,
    "shellos": 4,
    "gastrodon": 4,
    "ambipom": 4,
    "drifloon": 4,
    "drifblim": 4,
    "buneary": 4,
    "lopunny": 4,
    "mismagius": 4,
    "honchkrow": 4,
    "glameow": 4,
    "purugly": 4,
    "chingling": 4,
    "stunky": 4,
    "skuntank": 4,
    "bronzor": 4,
    "bronzong": 4,
    "bonsly": 4,
    "mime-jr": 4,
    "happiny": 4,
    "chatot": 4,
    "spiritomb": 4,
    "gible": 4,
    "gabite": 4,
    "garchomp": 4,
    "munchlax": 4,
    "riolu": 4,
    "lucario": 4,
    "hippopotas": 4,
    "hippowdon": 4,
    "skorupi": 4,
    "drapion": 4,
    "croagunk": 4,
    "toxicroak": 4,
    "carnivine": 4,
    "finneon": 4,
    "lumineon": 4,
    "mantyke": 4,
    "snover": 4,
    "abomasnow": 4,
    "weavile": 4,
    "magnezone": 4,
    "lickilicky": 4,
    "rhyperior": 4,
    "tangrowth": 4,
    "electivire": 4,
    "magmortar": 4,
    "togekiss": 4,
    "yanmega": 4,
    "leafeon": 4,
    "glaceon": 4,
    "gliscor": 4,
    "mamoswine": 4,
    "porygon-z": 4,
    "gallade": 4,
    "probopass": 4,
    "dusknoir": 4,
    "froslass": 4,
    "rotom": 4,
    "uxie": 4,
    "mesprit": 4,
    "azelf": 4,
    "dialga": 4,
    "palkia": 4,
    "heatran": 4,
    "regigigas": 4,
    "giratina": 4,
    "cresselia": 4,
    "phione": 4,
    "manaphy": 4,
    "darkrai": 4,
    "shaymin": 4,
    "arceus": 4,
    "victini": 5,
    "snivy": 5,
    "servine": 5,
    "serperior": 5,
    "tepig": 5,
    "pignite": 5,
    "emboar": 5,
    "oshawott": 5,
    "dewott": 5,
    "samurott": 5,
    "patrat": 5,
    "watchog": 5,
    "lillipup": 5,
    "herdier": 5,
    "stoutland": 5,
    "purrloin": 5,
    "liepard": 5,
    "pansage": 5,
    "simisage": 5,
    "pansear": 5,
    "simisear": 5,
    "panpour": 5,
    "simipour": 5,
    "munna": 5,
    "musharna": 5,
    "pidove": 5,
    "tranquill": 5,
    "unfezant": 5,
    "blitzle": 5,
    "zebstrika": 5,
    "roggenrola": 5,
    "boldore": 5,
    "gigalith": 5,
    "woobat": 5,
    "swoobat": 5,
    "drilbur": 5,
    "excadrill": 5,
    "audino": 5,
    "timburr": 5,
    "gurdurr": 5,
    "conkeldurr": 5,
    "tympole": 5,
    "palpitoad": 5,
    "seismitoad": 5,
    "throh": 5,
    "sawk": 5,
    "sewaddle": 5,
    "swadloon": 5,
    "leavanny": 5,
    "venipede": 5,
    "whirlipede": 5,
    "scolipede": 5,
    "cottonee": 5,
    "whimsicott": 5,
    "petilil": 5,
    "lilligant": 5,
    "basculin": 5,
    "sandile": 5,
    "krokorok": 5,
    "krookodile": 5,
    "darumaka": 5,
    "darmanitan": 5,
    "maractus": 5,
    "dwebble": 5,
    "crustle": 5,
    "scraggy": 5,
    "scrafty": 5,
    "sigilyph": 5,
    "yamask": 5,
    "cofagrigus": 5,
    "tirtouga": 5,
    "carracosta": 5,
    "archen": 5,
    "archeops": 5,
    "trubbish": 5,
    "garbodor": 5,
    "zorua": 5,
    "zoroark": 5,
    "minccino": 5,
    "cinccino": 5,
    "gothita": 5,
    "gothorita": 5,
    "gothitelle": 5,
    "solosis": 5,
    "duosion": 5,
    "reuniclus": 5,
    "ducklett": 5,
    "swanna": 5,
    "vanillite": 5,
    "vanillish": 5,
    "vanilluxe": 5,
    "deerling": 5,
    "sawsbuck": 5,
    "emolga": 5,
    "karrablast": 5,
    "escavalier": 5,
    "foongus": 5,
    "amoonguss": 5,
    "frillish": 5,
    "jellicent": 5,
    "alomomola": 5,
    "joltik": 5,
    "galvantula": 5,
    "ferroseed": 5,
    "ferrothorn": 5,
    "klink": 5,
    "klang": 5,
    "klinklang": 5,
    "tynamo": 5,
    "eelektrik": 5,
    "eelektross": 5,
    "elgyem": 5,
    "beheeyem": 5,
    "litwick": 5,
    "lampent": 5,
    "chandelure": 5,
    "axew": 5,
    "fraxure": 5,
    "haxorus": 5,
    "cubchoo": 5,
    "beartic": 5,
    "cryogonal": 5,
    "shelmet": 5,
    "accelgor": 5,
    "stunfisk": 5,
    "mienfoo": 5,
    "mienshao": 5,
    "druddigon": 5,
    "golett": 5,
    "golurk": 5,
    "pawniard": 5,
    "bisharp": 5,
    "bouffalant": 5,
    "rufflet": 5,
    "braviary": 5,
    "vullaby": 5,
    "mandibuzz": 5,
    "heatmor": 5,
    "durant": 5,
    "deino": 5,
    "zweilous": 5,
    "hydreigon": 5,
    "larvesta": 5,
    "volcarona": 5,
    "cobalion": 5,
    "terrakion": 5,
    "virizion": 5,
    "tornadus": 5,
    "thundurus": 5,
    "reshiram": 5,
    "zekrom": 5,
    "landorus": 5,
    "kyurem": 5,
    "keldeo": 5,
    "meloetta": 5,
    "genesect": 5,
    "chespin": 6,
    "quilladin": 6,
    "chesnaught": 6,
    "fennekin": 6,
    "braixen": 6,
    "delphox": 6,
    "froakie": 6,
    "frogadier": 6,
    "greninja": 6,
    "bunnelby": 6,
    "diggersby": 6,
    "fletchling": 6,
    "fletchinder": 6,
    "talonflame": 6,
    "scatterbug": 6,
    "spewpa": 6,
    "vivillon": 6,
    "litleo": 6,
    "pyroar": 6,
    "flabebe": 6,
    "floette": 6,
    "florges": 6,
    "skiddo": 6,
    "gogoat": 6,
    "pancham": 6,
    "pangoro": 6,
    "furfrou": 6,
    "espurr": 6,
    "meowstic": 6,
    "honedge": 6,
    "doublade": 6,
    "aegislash": 6,
    "spritzee": 6,
    "aromatisse": 6,
    "swirlix": 6,
    "slurpuff": 6,
    "inkay": 6,
    "malamar": 6,
    "binacle": 6,
    "barbaracle": 6,
    "skrelp": 6,
    "dragalge": 6,
    "clauncher": 6,
    "clawitzer": 6,
    "helioptile": 6,
    "heliolisk": 6,
    "tyrunt": 6,
    "tyrantrum": 6,
    "amaura": 6,
    "aurorus": 6,
    "sylveon": 6,
    "hawlucha": 6,
    "dedenne": 6,
    "carbink": 6,
    "goomy": 6,
    "sliggoo": 6,
    "goodra": 6,
    "klefki": 6,
    "phantump": 6,
    "trevenant": 6,
    "pumpkaboo": 6,
    "gourgeist": 6,
    "bergmite": 6,
    "avalugg": 6,
    "noibat": 6,
    "noivern": 6,
    "xerneas": 6,
    "yveltal": 6,
    "zygarde": 6,
    "diancie": 6,
    "hoopa": 6,
    "volcanion": 6,
    "rowlet": 7,
    "dartrix": 7,
    "decidueye": 7,
    "litten": 7,
    "torracat": 7,
    "incineroar": 7,
    "popplio": 7,
    "brionne": 7,
    "primarina": 7,
    "pikipek": 7,
    "trumbeak": 7,
    "toucannon": 7,
    "yungoos": 7,
    "gumshoos": 7,
    "grubbin": 7,
    "charjabug": 7,
    "vikavolt": 7,
    "crabrawler": 7,
    "crabominable": 7,
    "oricorio": 7,
    "cutiefly": 7,
    "ribombee": 7,
    "rockruff": 7,
    "lycanroc": 7,
    "wishiwashi": 7,
    "mareanie": 7,
    "toxapex": 7,
    "mudbray": 7,
    "mudsdale": 7,
    "dewpider": 7,
    "araquanid": 7,
    "fomantis": 7,
    "lurantis": 7,
    "morelull": 7,
    "shiinotic": 7,
    "salandit": 7,
    "salazzle": 7,
    "stufful": 7,
    "bewear": 7,
    "bounsweet": 7,
    "steenee": 7,
    "tsareena": 7,
    "comfey": 7,
    "oranguru": 7,
    "passimian": 7,
    "wimpod": 7,
    "golisopod": 7,
    "sandygast": 7,
    "palossand": 7,
    "pyukumuku": 7,
    "type-null": 7,
    "silvally": 7,
    "minior": 7,
    "komala": 7,
    "turtonator": 7,
    "togedemaru": 7,
    "mimikyu": 7,
    "bruxish": 7,
    "drampa": 7,
    "dhelmise": 7,
    "jangmo-o": 7,
    "hakamo-o": 7,
    "kommo-o": 7,
    "tapu-koko": 7,
    "tapu-lele": 7,
    "tapu-bulu": 7,
    "tapu-fini": 7,
    "cosmog": 7,
    "cosmoem": 7,
    "solgaleo": 7,
    "lunala": 7,
    "nihilego": 7,
    "buzzwole": 7,
    "pheromosa": 7,
    "xurkitree": 7,
    "celesteela": 7,
    "kartana": 7,
    "guzzlord": 7,
    "necrozma": 7,
    "magearna": 7,
    "marshadow": 7,
    "poipole": 7,
    "naganadel": 7,
    "stakataka": 7,
    "blacephalon": 7,
    "zeraora": 7,
    "meltan": 7,
    "melmetal": 7,
    "grookey": 8,
    "thwackey": 8,
    "rillaboom": 8,
    "scorbunny": 8,
    "raboot": 8,
    "cinderace": 8,
    "sobble": 8,
    "drizzile": 8,
    "inteleon": 8,
    "skwovet": 8,
    "greedent": 8,
    "rookidee": 8,
    "corvisquire": 8,
    "corviknight": 8,
    "blipbug": 8,
    "dottler": 8,
    "orbeetle": 8,
    "nickit": 8,
    "thievul": 8,
    "gossifleur": 8,
    "eldegoss": 8,
    "wooloo": 8,
    "dubwool": 8,
    "chewtle": 8,
    "drednaw": 8,
    "yamper": 8,
    "boltund": 8,
    "rolycoly": 8,
    "carkol": 8,
    "coalossal": 8,
    "applin": 8,
    "flapple": 8,
    "appletun": 8,
    "silicobra": 8,
    "sandaconda": 8,
    "cramorant": 8,
    "arrokuda": 8,
    "barraskewda": 8,
    "toxel": 8,
    "toxtricity": 8,
    "sizzlipede": 8,
    "centiskorch": 8,
    "clobbopus": 8,
    "grapploct": 8,
    "sinistea": 8,
    "polteageist": 8,
    "hatenna": 8,
    "hattrem": 8,
    "hatterene": 8,
    "impidimp": 8,
    "morgrem": 8,
    "grimmsnarl": 8,
    "obstagoon": 8,
    "perrserker": 8,
    "cursola": 8,
    "sirfetchd": 8,
    "mr-rime": 8,
    "runerigus": 8,
    "milcery": 8,
    "alcremie": 8,
    "falinks": 8,
    "pincurchin": 8,
    "snom": 8,
    "frosmoth": 8,
    "stonjourner": 8,
    "eiscue": 8,
    "indeedee": 8,
    "morpeko": 8,
    "cufant": 8,
    "copperajah": 8,
    "dracozolt": 8,
    "arctozolt": 8,
    "dracovish": 8,
    "arctovish": 8,
    "duraludon": 8,
    "dreepy": 8,
    "drakloak": 8,
    "dragapult": 8,
    "zacian": 8,
    "zamazenta": 8,
    "eternatus": 8,
    "kubfu": 8,
    "urshifu": 8,
    "zarude": 8,
    "regieleki": 8,
    "regidrago": 8,
    "glastrier": 8,
    "spectrier": 8,
    "calyrex": 8,
    "wyrdeer": 8,
    "kleavor": 8,
    "ursaluna": 8,
    "basculegion": 8,
    "sneasler": 8,
    "overqwil": 8,
    "enamorus": 8,
    "sprigatito": 9,
    "floragato": 9,
    "meowscarada": 9,
    "fuecoco": 9,
    "crocalor": 9,
    "skeledirge": 9,
    "quaxly": 9,
    "quaxwell": 9,
    "quaquaval": 9,
    "lechonk": 9,
    "oinkologne": 9,
    "tarountula": 9,
    "spidops": 9,
    "nymble": 9,
    "lokix": 9,
    "pawmi": 9,
    "pawmo": 9,
    "pawmot": 9,
    "tandemaus": 9,
    "maushold": 9,
    "fidough": 9,
    "dachsbun": 9,
    "smoliv": 9,
    "dolliv": 9,
    "arboliva": 9,
    "squawkabilly": 9,
    "nacli": 9,
    "naclstack": 9,
    "garganacl": 9,
    "charcadet": 9,
    "armarouge": 9,
    "ceruledge": 9,
    "tadbulb": 9,
    "bellibolt": 9,
    "wattrel": 9,
    "kilowattrel": 9,
    "maschiff": 9,
    "mabosstiff": 9,
    "shroodle": 9,
    "grafaiai": 9,
    "bramblin": 9,
    "brambleghast": 9,
    "toedscool": 9,
    "toedscruel": 9,
    "klawf": 9,
    "capsakid": 9,
    "scovillain": 9,
    "rellor": 9,
    "rabsca": 9,
    "flittle": 9,
    "espathra": 9,
    "tinkatink": 9,
    "tinkatuff": 9,
    "tinkaton": 9,
    "wiglett": 9,
    "wugtrio": 9,
    "bombirdier": 9,
    "finizen": 9,
    "palafin": 9,
    "varoom": 9,
    "revavroom": 9,
    "cyclizar": 9,
    "orthworm": 9,
    "glimmet": 9,
    "glimmora": 9,
    "greavard": 9,
    "houndstone": 9,
    "flamigo": 9,
    "cetoddle": 9,
    "cetitan": 9,
    "veluza": 9,
    "dondozo": 9,
    "tatsugiri": 9,
    "annihilape": 9,
    "clodsire": 9,
    "farigiraf": 9,
    "dudunsparce": 9,
    "kingambit": 9,
    "great-tusk": 9,
    "scream-tail": 9,
    "brute-bonnet": 9,
    "flutter-mane": 9,
    "slither-wing": 9,
    "sandy-shocks": 9,
    "iron-treads": 9,
    "iron-bundle": 9,
    "iron-hands": 9,
    "iron-jugulis": 9,
    "iron-moth": 9,
    "iron-thorns": 9,
    "frigibax": 9,
    "arctibax": 9,
    "baxcalibur": 9,
    "gimmighoul": 9,
    "gholdengo": 9,
    "wo-chien": 9,
    "chien-pao": 9,
    "ting-lu": 9,
    "chi-yu": 9,
    "roaring-moon": 9,
    "iron-valiant": 9,
    "koraidon": 9,
    "miraidon": 9,
    "walking-wake": 9,
    "iron-leaves": 9,
    "dipplin": 9,
    "poltchageist": 9,
    "sinistcha": 9,
    "okidogi": 9,
    "munkidori": 9,
    "fezandipiti": 9,
    "ogerpon": 9,
    "archaludon": 9,
    "hydrapple": 9,
    "gouging-fire": 9,
    "raging-bolt": 9,
    "iron-boulder": 9,
    "iron-crown": 9,
    "terapagos": 9,
    "pecharunt": 9
};
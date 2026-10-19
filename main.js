const img = new Image();
let default_color1 = [132, 239, 198];
let default_color2 = [115, 222, 181];
let default_color3 = [57, 104, 86];
let default_color4 = [50, 97, 79];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomizeStartColors() {
    document.getElementById('color1').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
    document.getElementById('color2').value = RGBToHex(getRandomInt(255), getRandomInt(255), getRandomInt(255));
}

function createDropdowns() {
    for (let i = 1; i < 7; i++) {
        const dropdown = document.getElementById(`sprites${i}`);
        ['Default', 'Yellow', 'Red/Blue', 'Crystal', 'Gold', 'Silver', 'Emerald', 'FireRed/LeafGreen', 'Ruby/Sapphire', 'HeartGold/SoulSilver', 'Platinum', 'Diamond/Pearl', 'Black/White'].forEach((game) => {
            let option = document.createElement('option');
            option.value = game.toLowerCase().replace('/', '-');
            option.text = game;
            dropdown.appendChild(option);
        });
    }
}

window.addEventListener("load", (event) => {
    createDropdowns();
    randomizeStartColors();
    start();
});

function scalePreview() {
    const scale = parseInt(document.getElementById('scale').value);

    canvas.style.width *= scale;
}

document.getElementById('color1').addEventListener('input', start);
document.getElementById('color2').addEventListener('input', start);
document.getElementById('scale').addEventListener('input', scalePreview);
['sprites', 'shiny', 'pokemon', 'image'].forEach((id) => {
    for (let i = 1; i < 7; i++) {
        document.getElementById(`${id}${i}`).addEventListener('input', start);
    }
});

['emerald', 'firered-leafgreen', 'ruby-sapphire', 'heart-and-soul', 'unbound'].forEach((game) => {
    document.getElementById(`preset-${game}`).addEventListener('click', () => applyPreset(game));
});

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
    }

    start();
}

const canvas = document.getElementById('preview');

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
    const generation = getGeneration();

    hideInputs(generation);
    renderPreview(generation);
}

function hideInputs(generation) {
    if (generation !== '3') {
        document.getElementById('color1').classList.add('hidden');
        document.getElementById('color2').classList.add('hidden');

        ['emerald', 'firered-leafgreen', 'ruby-sapphire', 'heart-and-soul', 'unbound'].forEach((game) => {
            document.getElementById(`preset-${game}`).classList.add('hidden');
        });
    }
    else {
        document.getElementById('color1').classList.remove('hidden');
        document.getElementById('color2').classList.remove('hidden');

        ['emerald', 'firered-leafgreen', 'ruby-sapphire', 'heart-and-soul', 'unbound'].forEach((game) => {
            document.getElementById(`preset-${game}`).classList.remove('hidden');
        });
    }

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
    img.src = `g${generation}-template.png`;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        drawPreview(generation, ctx);
    }
}

function drawPreview(generation, ctx) {
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

    placePokemon(generation, ctx);
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

function makeSpriteLink(index, image) {
    const pokemon = document.getElementById(`pokemon${index}`).value
    const sprite = document.getElementById(`sprites${index}`).value
    const shiny = document.getElementById(`shiny${index}`).value

    if (!allPokemon.includes(pokemon)) {
        return null;
    }

    if (['red-blue', 'yellow'].includes(sprite)) {
        shiny.checked = false;
    }

    if (['gold', 'silver'].includes(sprite)
        && shiny.checked) {
        sprite = 'crystal';
    }

    if (sprite === 'default') {
        image.crossOrigin = 'Anonymous';
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny.checked ? 'shiny/' : ''}${nameToNumber(pokemon)}.png`;
    }

    if (['red-blue', 'yellow', 'gold', 'silver', 'crystal'].includes(sprite)) {
        return `https://play.pokemonshowdown.com/sprites/${showdownLinks[sprite]}${shiny.checked ? '-shiny' : ''}/${pokemon}.png`;
    }
    else {
        image.crossOrigin = 'Anonymous';
        return `https://img.pokemondb.net/sprites/${sprite}/${shiny.checked ? 'shiny' : 'normal'}/${pokemon}.png`;
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

const gen4SpritePositions = {
    1: { x: -8, y: 40 },
    2: { x: 24, y: 48 },
    3: { x: 56, y: 56 },
    4: { x: 120 , y: 56 },
    5: { x: 152, y: 48 },
    6: { x: 184, y: 40 },
};

function placePokemon(generation, ctx) {
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
        const src = makeSpriteLink(i, pokemon);
        if (src === null) {
            continue;
        }
        const x = positions[i].x;
        const y = positions[i].y;
        pokemon.src = src;
        pokemon.onload = () => {
            ctx.drawImage(pokemon, x, y);
        }
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

function nameToNumber(name) {
    if (allPokemon.includes(name)) {
        return allPokemon.indexOf(name) + 1;
    }

    return 1;
}

const allPokemon = [
    'bulbasaur',
	'ivysaur',
	'venusaur',
	'charmander',
	'charmeleon',
	'charizard',
	'squirtle',
	'wartortle',
	'blastoise',
	'caterpie',
	'metapod',
	'butterfree',
	'weedle',
	'kakuna',
	'beedrill',
	'pidgey',
	'pidgeotto',
	'pidgeot',
	'rattata',
	'raticate',
	'spearow',
	'fearow',
	'ekans',
	'arbok',
	'pikachu',
	'raichu',
	'sandshrew',
	'sandslash',
	'nidoran-f',
	'nidorina',
	'nidoqueen',
	'nidoran-m',
	'nidorino',
	'nidoking',
	'clefairy',
	'clefable',
	'vulpix',
	'ninetales',
	'jigglypuff',
	'wigglytuff',
	'zubat',
	'golbat',
	'oddish',
	'gloom',
	'vileplume',
	'paras',
	'parasect',
	'venonat',
	'venomoth',
	'diglett',
	'dugtrio',
	'meowth',
	'persian',
	'psyduck',
	'golduck',
	'mankey',
	'primeape',
	'growlithe',
	'arcanine',
	'poliwag',
	'poliwhirl',
	'poliwrath',
	'abra',
	'kadabra',
	'alakazam',
	'machop',
	'machoke',
	'machamp',
	'bellsprout',
	'weepinbell',
	'victreebel',
	'tentacool',
	'tentacruel',
	'geodude',
	'graveler',
	'golem',
	'ponyta',
	'rapidash',
	'slowpoke',
	'slowbro',
	'magnemite',
	'magneton',
	'farfetchd',
	'doduo',
	'dodrio',
	'seel',
	'dewgong',
	'grimer',
	'muk',
	'shellder',
	'cloyster',
	'gastly',
	'haunter',
	'gengar',
	'onix',
	'drowzee',
	'hypno',
	'rabby',
	'ingler',
	'voltorb',
	'electrode',
	'exeggcute',
	'exeggutor',
	'cubone',
	'marowak',
	'hitmonlee',
	'hitmonchan',
	'lickitung',
	'koffing',
	'weezing',
	'rhyhorn',
	'rhydon',
	'chansey',
	'tangela',
	'kangaskhan',
	'horsea',
	'seadra',
	'goldeen',
	'seaking',
	'staryu',
	'starmie',
	'mr-mime',
	'scyther',
	'jynx',
	'electabuzz',
	'magmar',
	'pinsir',
	'tauros',
	'magikarp',
	'gyarados',
	'lapras',
	'ditto',
	'eevee',
	'vaporeon',
	'jolteon',
	'flareon',
	'porygon',
	'omanyte',
	'omastar',
	'kabuto',
	'kabutops',
	'aerodactyl',
	'snorlax',
	'articuno',
	'zapdos',
	'moltres',
	'dratini',
	'dragonair',
	'dragonite',
	'mewtwo',
	'mew',
	'chikorita',
	'bayleef',
	'meganium',
	'cyndaquil',
	'quilava',
	'typhlosion',
	'totodile',
	'croconaw',
	'feraligatr',
	'sentret',
	'furret',
	'hoothoot',
	'noctowl',
	'ledyba',
	'ledian',
	'spinarak',
	'ariados',
	'crobat',
	'chinchou',
	'lanturn',
	'pichu',
	'cleffa',
	'igglybuff',
	'togepi',
	'togetic',
	'natu',
	'xatu',
	'mareep',
	'flaaffy',
	'ampharos',
	'bellossom',
	'marill',
	'azumarill',
	'sudowoodo',
	'politoed',
	'hoppip',
	'skiploom',
	'jumpluff',
	'aipom',
	'sunkern',
	'sunflora',
	'yanma',
	'wooper',
	'quagsire',
	'espeon',
	'umbreon',
	'murkrow',
	'slowking',
	'misdreavus',
	'unown',
	'wobbuffet',
	'girafarig',
	'pineco',
	'forretress',
	'dunsparce',
	'gligar',
	'steelix',
	'snubbull',
	'granbull',
	'qwilfish',
	'scizor',
	'shuckle',
	'heracross',
	'sneasel',
	'teddiursa',
	'ursaring',
	'slugma',
	'magcargo',
	'swinub',
	'piloswine',
	'corsola',
	'remoraid',
	'octillery',
	'delibird',
	'mantine',
	'skarmory',
	'houndour',
	'houndoom',
	'kingdra',
	'phanpy',
	'donphan',
	'porygon2',
	'stantler',
	'smeargle',
	'tyrogue',
	'hitmontop',
	'smoochum',
	'elekid',
	'magby',
	'miltank',
	'blissey',
	'raikou',
	'entei',
	'suicune',
	'larvitar',
	'pupitar',
	'tyranitar',
	'lugia',
	'ho-oh',
	'celebi',
	'treecko',
	'grovyle',
	'sceptile',
	'torchic',
	'combusken',
	'blaziken',
	'mudkip',
	'marshtomp',
	'swampert',
	'poochyena',
	'mightyena',
	'zigzagoon',
	'linoone',
	'wurmple',
	'silcoon',
	'beautifly',
	'cascoon',
	'dustox',
	'lotad',
	'lombre',
	'ludicolo',
	'seedot',
	'nuzleaf',
	'shiftry',
	'taillow',
	'swellow',
	'wingull',
	'pelipper',
	'ralts',
	'kirlia',
	'gardevoir',
	'surskit',
	'masquerain',
	'shroomish',
	'breloom',
	'slakoth',
	'vigoroth',
	'slaking',
	'nincada',
	'ninjask',
	'shedinja',
	'whismur',
	'loudred',
	'exploud',
	'makuhita',
	'hariyama',
	'azurill',
	'nosepass',
	'skitty',
	'delcatty',
	'sableye',
	'mawile',
	'aron',
	'lairon',
	'aggron',
	'meditite',
	'medicham',
	'electrike',
	'manectric',
	'plusle',
	'minun',
	'volbeat',
	'illumise',
	'roselia',
	'gulpin',
	'swalot',
	'carvanha',
	'sharpedo',
	'wailmer',
	'wailord',
	'numel',
	'camerupt',
	'torkoal',
	'spoink',
	'grumpig',
	'spinda',
	'trapinch',
	'vibrava',
	'flygon',
	'cacnea',
	'cacturne',
	'swablu',
	'altaria',
	'zangoose',
	'seviper',
	'lunatone',
	'solrock',
	'barboach',
	'whiscash',
	'corphish',
	'crawdaunt',
	'baltoy',
	'claydol',
	'lileep',
	'cradily',
	'anorith',
	'armaldo',
	'feebas',
	'milotic',
	'castform-normal',
	'kecleon',
	'shuppet',
	'banette',
	'duskull',
	'dusclops',
	'tropius',
	'chimecho',
	'absol',
	'wynaut',
	'snorunt',
	'glalie',
	'spheal',
	'sealeo',
	'walrein',
	'clamperl',
	'huntail',
	'gorebyss',
	'relicanth',
	'luvdisc',
	'bagon',
	'shelgon',
	'salamence',
	'beldum',
	'metang',
	'metagross',
	'regirock',
	'regice',
	'registeel',
	'latias',
	'latios',
	'kyogre',
	'groudon',
	'rayquaza',
	'jirachi',
	'deoxys-normal',
	'turtwig',
	'grotle',
	'torterra',
	'chimchar',
	'monferno',
	'infernape',
	'piplup',
	'prinplup',
	'empoleon',
	'starly',
	'staravia',
	'staraptor',
	'bidoof',
	'bibarel',
	'kricketot',
	'kricketune',
	'shinx',
	'luxio',
	'luxray',
	'budew',
	'roserade',
	'cranidos',
	'rampardos',
	'shieldon',
	'bastiodon',
	'burmy',
	'wormadam-plant',
	'mothim-plant',
	'combee',
	'vespiquen',
	'pachirisu',
	'buizel',
	'floatzel',
	'cherubi',
	'cherrim-overcast',
	'shellos-west',
	'gastrodon-west',
	'ambipom',
	'drifloon',
	'drifblim',
	'buneary',
	'lopunny',
	'mismagius',
	'honchkrow',
	'glameow',
	'purugly',
	'chingling',
	'stunky',
	'skuntank',
	'bronzor',
	'bronzong',
	'bonsly',
	'mime-jr',
	'happiny',
	'chatot',
	'spiritomb',
	'gible',
	'gabite',
	'garchomp',
	'munchlax',
	'riolu',
	'lucario',
	'hippopotas',
	'hippowdon',
	'skorupi',
	'drapion',
	'croagunk',
	'toxicroak',
	'carnivine',
	'finneon',
	'lumineon',
	'mantyke',
	'snover',
	'abomasnow',
	'weavile',
	'magnezone',
	'lickilicky',
	'rhyperior',
	'tangrowth',
	'electivire',
	'magmortar',
	'togekiss',
	'yanmega',
	'leafeon',
	'glaceon',
	'gliscor',
	'mamoswine',
	'porygon-z',
	'gallade',
	'probopass',
	'dusknoir',
	'froslass',
	'rotom',
	'uxie',
	'mesprit',
	'azelf',
	'dialga',
	'palkia',
	'heatran',
	'regigigas',
	'giratina-altered',
	'cresselia',
	'phione',
	'manaphy',
	'darkrai',
	'shaymin-land',
	'arceus-normal',
	'victini',
	'snivy',
	'servine',
	'serperior',
	'tepig',
	'pignite',
	'emboar',
	'oshawott',
	'dewott',
	'samurott',
	'patrat',
	'watchog',
	'lillipup',
	'herdier',
	'stoutland',
	'purrloin',
	'liepard',
	'pansage',
	'simisage',
	'pansear',
	'simisear',
	'panpour',
	'simipour',
	'munna',
	'musharna',
	'pidove',
	'tranquill',
	'unfezant',
	'blitzle',
	'zebstrika',
	'roggenrola',
	'boldore',
	'gigalith',
	'woobat',
	'swoobat',
	'drilbur',
	'excadrill',
	'audino',
	'timburr',
	'gurdurr',
	'conkeldurr',
	'tympole',
	'palpitoad',
	'seismitoad',
	'throh',
	'sawk',
	'sewaddle',
	'swadloon',
	'leavanny',
	'venipede',
	'whirlipede',
	'scolipede',
	'cottonee',
	'whimsicott',
	'petilil',
	'lilligant',
	'basculin',
	'sandile',
	'krokorok',
	'krookodile',
	'darumaka',
	'darmanitan-standard',
	'maractus',
	'dwebble',
	'crustle',
	'scraggy',
	'scrafty',
	'sigilyph',
	'yamask',
	'cofagrigus',
	'tirtouga',
	'carracosta',
	'archen',
	'archeops',
	'trubbish',
	'garbodor',
	'zorua',
	'zoroark',
	'minccino',
	'cinccino',
	'gothita',
	'gothorita',
	'gothitelle',
	'solosis',
	'duosion',
	'reuniclus',
	'ducklett',
	'swanna',
	'vanillite',
	'vanillish',
	'vanilluxe',
	'deerling-spring',
	'sawsbuck-spring',
	'emolga',
	'karrablast',
	'escavalier',
	'foongus',
	'amoonguss',
	'frillish',
	'jellicent',
	'alomomola',
	'joltik',
	'galvantula',
	'ferroseed',
	'ferrothorn',
	'klink',
	'klang',
	'klinklang',
	'tynamo',
	'eelektrik',
	'eelektross',
	'elgyem',
	'beheeyem',
	'litwick',
	'lampent',
	'chandelure',
	'axew',
	'fraxure',
	'haxorus',
	'cubchoo',
	'beartic',
	'cryogonal',
	'shelmet',
	'accelgor',
	'stunfisk',
	'mienfoo',
	'mienshao',
	'druddigon',
	'golett',
	'golurk',
	'pawniard',
	'bisharp',
	'bouffalant',
	'rufflet',
	'braviary',
	'vullaby',
	'mandibuzz',
	'heatmor',
	'durant',
	'deino',
	'zweilous',
	'hydreigon',
	'larvesta',
	'volcarona',
	'cobalion',
	'terrakion',
	'virizion',
	'tornadus',
	'thundurus',
	'reshiram',
	'zekrom',
	'landorus',
	'kyurem',
	'keldeo',
	'meloetta',
	'genesect',
	'chespin',
	'quilladin',
	'chesnaught',
	'fennekin',
	'braixen',
	'delphox',
	'froakie',
	'frogadier',
	'greninja',
	'bunnelby',
	'diggersby',
	'fletchling',
	'fletchinder',
	'talonflame',
	'scatterbug',
	'spewpa-icy-snow',
	'vivillon-icy-snow',
	'litleo',
	'pyroar',
	'flabebe-red',
	'floette-red',
	'florges',
	'skiddo',
	'gogoat',
	'pancham',
	'pangoro',
	'furfrou-natural',
	'espurr',
	'meowstic-m',
	'honedge',
	'doublade',
	'aegislash-shield',
	'spritzee',
	'aromatisse',
	'swirlix',
	'slurpuff',
	'inkay',
	'malamar',
	'binacle',
	'barbaracle',
	'skrelp',
	'dragalge',
	'clauncher',
	'clawitzer',
	'helioptile',
	'heliolisk',
	'tyrunt',
	'tyrantrum',
	'amaura',
	'aurorus',
	'sylveon',
	'hawlucha',
	'dedenne',
	'carbink',
	'goomy',
	'sliggoo',
	'goodra',
	'klefki',
	'phantump',
	'trevenant',
	'pumpkaboo-average',
	'gourgeist-average',
	'bergmite',
	'avalugg',
	'noibat',
	'noivern',
	'xerneas-neutral',
	'yveltal',
	'zygarde-50',
	'diancie',
	'hoopa-confined',
	'volcanion',
	'rowlet',
	'dartrix',
	'decidueye',
	'litten',
	'torracat',
	'incineroar',
	'popplio',
	'brionne',
	'primarina',
	'pikipek',
	'trumbeak',
	'toucannon',
	'yungoos',
	'gumshoos',
	'grubbin',
	'charjabug',
	'vikavolt',
	'crabrawler',
	'crabominable',
	'oricorio-baile',
	'cutiefly',
	'ribombee',
	'rockruff',
	'lycanroc-midday',
	'wishiwashi-solo',
	'mareanie',
	'toxapex',
	'mudbray',
	'mudsdale',
	'dewpider',
	'araquanid',
	'fomantis',
	'lurantis',
	'morelull',
	'shiinotic',
	'salandit',
	'salazzle',
	'stufful',
	'bewear',
	'bounsweet',
	'steenee',
	'tsareena',
	'comfey',
	'oranguru',
	'passimian',
	'wimpod',
	'golisopod',
	'sandygast',
	'palossand',
	'pyukumuku',
	'type-null',
	'silvally-normal',
	'minior-meteor-red',
	'komala',
	'turtonator',
	'togedemaru',
	'mimikyu-disguised',
	'bruxish',
	'drampa',
	'dhelmise',
	'jangmo-o',
	'hakamo-o',
	'kommo-o',
	'tapu-koko',
	'tapu-lele',
	'tapu-bulu',
	'tapu-fini',
	'cosmog',
	'cosmoem',
	'solgaleo',
	'lunala',
	'nihilego',
	'buzzwole',
	'pheromosa',
	'xurkitree',
	'celesteela',
	'kartana',
	'guzzlord',
	'necrozma',
	'magearna',
	'marshadow',
	'poipole',
	'naganadel',
	'stakataka',
	'blacephalon',
	'zeraora',
	'meltan',
	'melmetal',
	'grookey',
	'thwackey',
	'rillaboom',
	'scorbunny',
	'raboot',
	'cinderace',
	'sobble',
	'drizzile',
	'inteleon',
	'skwovet',
	'greedent',
	'rookidee',
	'corvisquire',
	'corviknight',
	'blipbug',
	'dottler',
	'orbeetle',
	'nickit',
	'thievul',
	'gossifleur',
	'eldegoss',
	'wooloo',
	'dubwool',
	'chewtle',
	'drednaw',
	'yamper',
	'boltund',
	'rolycoly',
	'carkol',
	'coalossal',
	'applin',
	'flapple',
	'appletun',
	'silicobra',
	'sandaconda',
	'cramorant',
	'arrokuda',
	'barraskewda',
	'toxel',
	'toxtricity',
	'sizzlipede',
	'centiskorch',
	'clobbopus',
	'grapploct',
	'sinistea',
	'polteageist',
	'hatenna',
	'hattrem',
	'hatterene',
	'impidimp',
	'morgrem',
	'grimmsnarl',
	'obstagoon',
	'perrserker',
	'cursola',
	'sirfetchd',
	'mr-rime',
	'runerigus',
	'milcery',
	'alcremie',
	'falinks',
	'pincurchin',
	'snom',
	'frosmoth',
	'stonjourner',
	'eiscue',
	'indeedee',
	'morpeko',
	'cufant',
	'copperajah',
	'dracozolt',
	'arctozolt',
	'dracovish',
	'arctovish',
	'duraludon',
	'dreepy',
	'drakloak',
	'dragapult',
	'zacian',
	'zamazenta',
	'eternatus',
	'kubfu',
	'urshifu',
	'zarude',
	'regieleki',
	'regidrago',
	'glastrier',
	'spectrier',
	'calyrex',
	'wyrdeer',
	'kleavor',
	'ursaluna',
	'basculegion',
	'sneasler',
	'overqwil',
	'enamorus',
	'sprigatito',
	'floragato',
	'meowscarada',
	'fuecoco',
	'crocalor',
	'skeledirge',
	'quaxly',
	'quaxwell',
	'quaquaval',
	'lechonk',
	'oinkologne',
	'tarountula',
	'spidops',
	'nymble',
	'lokix',
	'pawmi',
	'pawmo',
	'pawmot',
	'tandemaus',
	'maushold',
	'fidough',
	'dachsbun',
	'smoliv',
	'dolliv',
	'arboliva',
	'squawkabilly',
	'nacli',
	'naclstack',
	'garganacl',
	'charcadet',
	'armarouge',
	'ceruledge',
	'tadbulb',
	'bellibolt',
	'wattrel',
	'kilowattrel',
	'maschiff',
	'mabosstiff',
	'shroodle',
	'grafaiai',
	'bramblin',
	'brambleghast',
	'toedscool',
	'toedscruel',
	'klawf',
	'capsakid',
	'scovillain',
	'rellor',
	'rabsca',
	'flittle',
	'espathra',
	'tinkatink',
	'tinkatuff',
	'tinkaton',
	'wiglett',
	'wugtrio',
	'bombirdier',
	'finizen',
	'palafin',
	'varoom',
	'revavroom',
	'cyclizar',
	'orthworm',
	'glimmet',
	'glimmora',
	'greavard',
	'houndstone',
	'flamigo',
	'cetoddle',
	'cetitan',
	'veluza',
	'dondozo',
	'tatsugiri',
	'annihilape',
	'clodsire',
	'farigiraf',
	'dudunsparce',
	'kingambit',
	'great-tusk',
	'scream-tail',
	'brute-bonnet',
	'flutter-mane',
	'slither-wing',
	'sandy-shocks',
	'iron-treads',
	'iron-bundle',
	'iron-hands',
	'iron-jugulis',
	'iron-moth',
	'iron-thorns',
	'frigibax',
	'arctibax',
	'baxcalibur',
	'gimmighoul',
	'gholdengo',
	'wo-chien',
	'chien-pao',
	'ting-lu',
	'chi-yu',
	'roaring-moon',
	'iron-valiant',
	'koraidon',
	'miraidon',
	'walking-wake',
	'iron-leaves',
	'dipplin',
	'poltchageist',
	'sinistcha',
	'okidogo',
	'munkidori',
	'fezandipiti',
	'ogerpon',
	'archaludon',
	'hydrapple',
	'gouging-fire',
	'raging-bolt',
	'iron-boulder',
	'iron-crown',
	'terapagos',
	'pecharunt'
];
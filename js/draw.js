import { allPokemon, pokemonIntroductionGeneration, getBasePokemon, generation1Games, generation2Games } from './pokemon.js';
import { buildSpriteDropdowns, buildPresetDropdowns, randomizeStartColors, buildSuggestions, initializeEventListeners, randomizePlaceholders, buildTrainerDropdown } from './load.js';
import { getGeneration, getType, hideInputs, getColors, getInputs, getTrainerType, validSpecialCharacters, validateText, isNumeric } from './utils.js';

const img = new Image();

const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];
const default_color3 = [57, 104, 86];
const default_color4 = [50, 97, 79];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const CHARACTER_HEIGHT = 22;

const generationTextHeights = {
    '3': { y: 288 },
    '4': { y: 348 },
};

const generationSpriteSizes = {
    '3': 64,
    '4': 80,
    '5': 96,
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
};

const spritePositions = {
    '3': {
        1: { x: 48, y: 16 },
        2: { x: 176, y: 16 },
        3: { x: 304, y: 16 },
        4: { x: 16, y: 112 },
        5: { x: 176, y: 112 },
        6: { x: 336, y: 112 },
    },
    '4': {
        1: { x: -16, y: 80 },
        2: { x: 48, y: 96 },
        3: { x: 112, y: 112 },
        4: { x: 240 , y: 112 },
        5: { x: 304, y: 96 },
        6: { x: 368, y: 80 },
    },
    '5': {},
};

const drawingOrder = {
    '3': [1, 2, 3, 4, 5, 6],
    '4': [1, 2, 3, 6, 5, 4],
    '5': [],
};

const recoloringFunctions = {
    '3': recolorGen3Background,
    '4': recolorGen4Background,
    '5': recolorGen5Background,
};

const gemerationTrainerPositions = {
    '3': { x: 160, y: 64 },
    '4': { x: 176, y: 128 },
};

window.addEventListener('load', (event) => {
    buildSpriteDropdowns();
    buildPresetDropdowns();
    buildTrainerDropdown();
    randomizeStartColors();
	buildSuggestions();
	initializeEventListeners(start);
	randomizePlaceholders();
    start();
});

function start() {
    const generation = getGeneration();

    hideInputs(generation);
    drawBackground(generation);
}

function drawBackground(generation) {
    const border = document.getElementById('borders').checked;

    img.crossOrigin = 'Anonymous';
    img.src = border ? `images/g${generation}-template.png` : `images/g${generation}-template-borderless.png`;
    
    img.onload = () => {
        const preview = document.getElementById('preview');
        preview.style.width = img.width;
        preview.style.height = img.height;

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        recolorBackground(generation);
    }
}

function recolorBackground(generation) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
        
    recoloringFunctions[generation](data);

    ctx.putImageData(imageData, 0, 0);

    drawSprites(generation);
}

function copyCanvasToImage() {
    const img = document.getElementById('preview');

    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL('image/png');

    img.src = url;
}

function recolorGen3Background(data) {
    const colors = getColors();

    const color1 = colors.color1;
    const color2 = colors.color2;
    const color3 = colors.color3;
    const color4 = colors.color4;

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
function recolorGen4Background(data) {}

function recolorGen5Background(data) {}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const pokemon = new Image();
	    pokemon.crossOrigin = 'Anonymous';

        pokemon.onload = () => resolve(pokemon);
        pokemon.onerror = () => reject(`Error loading: ${src}`);
        
	    pokemon.src = src;
    });
}

function drawSprites(generation) {
    const images = [];
    for (const i of drawingOrder[generation]) {
        const src = buildSpriteLink(i);
        if (src === null) {
            continue;
        }

		images.push(
            loadImage(src).then(image => {
                return {
                    index: i,
                    image: image,
                }
            }).catch(error => {
                console.error(error);
                return null;
            })
        );
    }

    Promise.all(images).then((images) => {
        for (const pokemon of images) {
            const image = pokemon.image;
            const index = pokemon.index;

            if (image === null) {
                continue;
            }

            const dimensions = placeSprite(image, index, generation);

            if (dimensions === null) {
                continue;
            }

            if (document.getElementById('darken').checked && generation === '3') {
                ctx.filter = 'opacity(0.7)';
            }

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                image,
                dimensions.x,
                dimensions.y,
                dimensions.dWidth,
                dimensions.dHeight
            ); 
        };

        if (document.getElementById('trainer').checked) {
            drawTrainer(generation);
        }
        else {
            copyCanvasToImage();
        }
    });
}

function placeSprite(image, index, generation) {
    const relativeSpriteSize = generationSpriteSizes[generation] * 2;

    const inputs = getInputs(index);

    let x = spritePositions[generation][index].x;
    let y = spritePositions[generation][index].y;
    
    let dWidth = image.width * 2;
    let dHeight = image.height * 2;

    if (inputs.type === 'name') {
        if (['default-option', 'black-white-option'].includes(inputs.sprite)) {
            dWidth = 160;
            dHeight = 160;
        }

        const sizeDifference = dWidth - relativeSpriteSize;

        x -= sizeDifference / 2;
        y -= sizeDifference / 2;

        const dimensions = placeSpecialCases(inputs.name);
        if (dimensions !== null) {
            return {
                x: x + dimensions.x_offset,
                y: y + dimensions.y_offset,
                dWidth: dimensions.width,
                dHeight: dimensions.height,
            }
        }
    }
    else {
        if (inputs.resize || image.width === image.height) {
	        dWidth = relativeSpriteSize;
	        dHeight = relativeSpriteSize;
        }
        else {
            alert(`Pokemon ${index} sprite has invalid dimensions.`);
            return null;
        }
    }

    return {
        x: x,
        y: y,
        dWidth: dWidth,
        dHeight: dHeight,
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

function drawTrainer(generation) {
    const position = gemerationTrainerPositions[generation];

    const trainer = new Image();

    trainer.onload = () => {
        let dWidth = trainer.width;
        let dHeight = trainer.height;

        if (document.getElementById('trainer-resize').checked || trainer.width === trainer.height) {
	        dWidth = 160;
	        dHeight = 160;
        }
        else {
            alert('Trainer sprite has invalid dimensions.');
            return null;
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(trainer, position.x, position.y, dWidth, dHeight);

        if (validateText(document.getElementById('game-name').value)) {
            drawText(game, generation);
        }
        else {
            copyCanvasToImage();
        }
    }

    const src = buildTrainerLink();

    if (src === null) {
        return;
    }

    trainer.src = src;
}

function buildTrainerLink() {
    const trainerType = getTrainerType();

    switch (trainerType) {
        default:
        case 'name':
            const name = document.getElementById('trainer-sprite').value;

            if (name === '') {
                return null;
            }
        
            return `images/trainers/${name}.png`;
        case 'link':
            const value = document.getElementById('trainer-link-text').value;

            return value === '' ? null : value;
        case 'upload':
            const image = document.getElementById('trainer-image').files[0];
	
	        if (image) {
    	        return URL.createObjectURL(image);
  	        }

            return null;
    }
}

function drawText(text, generation) {
    const characters = [];

    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        let src;

        if (character in validSpecialCharacters) {
            src = `images/characters/special/${validSpecialCharacters[character].filename}.png`;
        }
        else if (isNumeric(character)) {
            src = `images/characters/numbers/${character}.png`;
        }
        else if (character === character.toUpperCase()) {
            src = `images/characters/uppercase/${character.toLowerCase()}.png`;
        }
        else if (character === character.toLowerCase()) {
            src = `images/characters/lowercase/${character}.png`;
        }

        characters.push(
            loadImage(src).then(image => {
                return {
                    character: character,
                    image: image
                };
            }).catch(error => {
                console.error(error);
                return null;
            })
        );
    }

    Promise.all(characters).then((images) => {
        const totalWidth = getTextWidth(text);

        let x = parseInt((canvas.width - totalWidth) / 2);

        for (const char of images) {
            if (char === null) {
                continue;
            }

            const character = char.character;
            const image = char.image;

            const width = getCharacterWidth(character);

            let y = generationTextHeights[generation].y;

            if (['y', 'g', 'p', 'j', 'q', ','].includes(character)) {
                y += 4;
            }
            else if (['\''].includes(character)) {
                y -= 14;
            }

            const height = character === 'j' ? 26 : CHARACTER_HEIGHT;

            ctx.drawImage(
                image,
                x,
                y,
                width,
                height
            );

            x += width;
        }
    });

    copyCanvasToImage();
}

function getTextWidth(text) {
    let width = 0;

    for (let i = 0; i < text.length; i++) {
        width += getCharacterWidth(text.charAt(i));
    }

    return width;
}

function getCharacterWidth(character) {
    if ([' ', '.'].includes(character)) {
        return 6;
    }

    if (['i', 'l', '!'].includes(character)) {
        return 8;
    }

    if (['j'].includes(character)) {
        return 10;
    }

    return 12;
}
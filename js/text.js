export const validSpecialCharacters = {
    '1': {
        '×': { filename: 'ti' },
        '(': { filename: 'lp' },
        ')': { filename: 'rp' },
        ':': { filename: 'cl' },
        ';': { filename: 'sc' },
        '[': { filename: 'lb' },
        ']': { filename: 'rb' },
        ',': { filename: 'co' },
        '.': { filename: 'pd' },
        '/': { filename: 'rs' },
        '♀': { filename: 'fe' },
        '♂': { filename: 'ma' },
        '!': { filename: 'ep' },
        '?': { filename: 'qm' },
        '-': { filename: 'hy' },
        ' ': { filename: 'sp' },
    },
    '2': {
        '×': { filename: 'ti' },
        '(': { filename: 'lp' },
        ')': { filename: 'rp' },
        ':': { filename: 'cl' },
        ';': { filename: 'sc' },
        '[': { filename: 'lb' },
        ']': { filename: 'rb' },
        ',': { filename: 'co' },
        '.': { filename: 'pd' },
        '/': { filename: 'rs' },
        '♀': { filename: 'fe' },
        '♂': { filename: 'ma' },
        '!': { filename: 'ep' },
        '?': { filename: 'qm' },
        '-': { filename: 'hy' },
        ' ': { filename: 'sp' },
    },
    '3': {
        '!': { filename: 'ep' },
        ' ': { filename: 'sp' },
        '.': { filename: 'pd' },
        '\'': { filename: 'ap' },
        ',': { filename: 'co' },
        'é': { filename: 'ae' },
        '?': { filename: 'qm' },
        '"': { filename: 'qu' },
        '-': { filename: 'hy' },
        'Nº': { filename: 'no' },
        '…': { filename: 'el' },
        '♀': { filename: 'fe' },
        '♂': { filename: 'ma' },
        '/': { filename: 'rs' },
    },
    '4': {
        '!': { filename: 'ep' },
        ' ': { filename: 'sp' },
        '.': { filename: 'pd' },
        '\'': { filename: 'ap' },
        ',': { filename: 'co' },
        'é': { filename: 'ae' },
        '?': { filename: 'qm' },
        '"': { filename: 'qu' },
        '-': { filename: 'hy' },
        'Nº': { filename: 'no' },
        '…': { filename: 'el' },
        '♀': { filename: 'fe' },
        '♂': { filename: 'ma' },
        '/': { filename: 'rs' },
    },
    '5': {
        '!': { filename: 'ep' },
        ' ': { filename: 'sp' },
        '.': { filename: 'pd' },
        '\'': { filename: 'ap' },
        ',': { filename: 'co' },
        'é': { filename: 'ae' },
        '?': { filename: 'qm' },
        '"': { filename: 'qu' },
        '-': { filename: 'hy' },
        'Nº': { filename: 'no' },
        '…': { filename: 'el' },
        '♀': { filename: 'fe' },
        '♂': { filename: 'ma' },
        '/': { filename: 'rs' },
    },
};

export const characterWidths = {
    '1': {
        default: 14,
        '×': 10,
        '(': 8,
        ')': 8,
        ':': 4,
        ';': 4,
        '[': 6,
        ']': 6,
        ',': 4,
        '.': 4,
        '♀': 10,
        '!': 8,
        '?': 16,
        '-': 12,
        'j': 6,
        ' ': 3,
    },
    '2': {
        default: 14,
        '×': 10,
        '(': 8,
        ')': 8,
        ':': 4,
        ';': 4,
        '[': 6,
        ']': 6,
        ',': 4,
        '.': 4,
        '♀': 10,
        '!': 8,
        '?': 16,
        '-': 12,
        'j': 6,
        ' ': 3,
    },
    '3': {
        default: 12,
        ' ': 6,
        '.': 6,
        '\'': 6,
        'i': 8,
        'l': 8,
        '!': 8,
        'j': 10,
        '…': 12,
    },
    '4': {
        default: 12,
    },
    '5': {
        default: 12,
    },
};

export const characterHeights = {
    '1': {
        default: 14,
        '×': 10,
        ':': 12,
        ',': 8,
        '.': 4,
        '♀': 16,
        '♂': 16,
        '!': 16,
        '-': 2,
        ' ': 3,
    },
    '2': {
        default: 14,
        '×': 10,
        ':': 12,
        ',': 8,
        '.': 4,
        '♀': 16,
        '♂': 16,
        '!': 16,
        '-': 2,
        ' ': 3,
    },
    '3': {
        default: 22,
        'j': 26,
        '…': 4,
    },
    '4': {
        default: 22,
    },
    '5': {
        default: 22,
    },
};

export const characterYShifts = {
    '1': {
        '-': -7,
        'g': 2,
        'j': 2,
        'p': 2,
        'q': 2,
        'y': 2,
    },
    '2': {
        '-': -7,
        'g': 2,
        'j': 2,
        'p': 2,
        'q': 2,
        'y': 2,
    },
    '3': {
        'y': 4,
        'g': 4,
        'p': 4,
        'j': 4,
        'q': 4,
        ',': 4,
        '\'': -14,
        '"': -14,
    },
    '4': {},
    '5': {},
};

export function getTextWidth(text, generation) {
    let width = 0;

    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);
        width += characterWidths[generation][character] ?? characterWidths[generation].default;
    }

    const spaceBetween = generation === '3' ? 0 : 1;
    return width + (spaceBetween * text.length);
}

export function validateText(text, generation) {
    if (text === '') {
        return true;
    }
    
    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);

        if (!isAlphaNumeric(character)) {
            if (!(character in validSpecialCharacters[generation])) {
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

export function getInvalidMessage(generation) {
    let characters = [];

    for (const c of Object.keys(validSpecialCharacters[generation])) {
        characters.push(c);
    }

    return 'Game name may only include letters, number, and the following special characters: ' + characters.join(', ');
}
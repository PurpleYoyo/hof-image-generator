export const characterWidths = {
    '3': {
        default: 12,
        ' ': 6,
        '.': 6,
        '\'': 6,
        'i': 8,
        'l': 8,
        '!': 8,
        'j': 10,
    },
};

export const characterHeights = {
    '3': {
        default: 22,
        'j': 26,
    },
};

export const characterYShifts = {
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
};

export function getTextWidth(text, generation) {
    let width = 0;

    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);
        width += characterWidths[generation][character] ?? characterWidths[generation].default;
    }

    return width;
}
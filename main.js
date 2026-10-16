const img = new Image();
const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];
const default_color3 = [57, 104, 86];
const default_color4 = [50, 97, 79];

window.addEventListener("load", (event) => {
    renderPreview(getGeneration());
});

document.getElementById('color1').addEventListener('input', (event) => renderPreview(getGeneration()));
document.getElementById('color2').addEventListener('input', (event) => renderPreview(getGeneration()));

function getGeneration() {
    const radios = document.querySelectorAll('.generation');

    radios.forEach(radio => {
        if (radio.checked) {
            return radio.value;
        }
    });

    return '3';
}

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

function renderPreview(generation) {
    img.src = `g${generation}-template.png`;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }

    if (generation === '3') {
        drawGen3Preview();
    }
}

function drawGen3Preview() {
    ctx.drawImage(img, 0, 0);

    const color1 = hexToRGB(document.getElementById('color1').value);
    const color2 = hexToRGB(document.getElementById('color2').value);
    const color3 = HSVtoRGB(darkenColor(RGBtoHSV(color1), true));
    const color4 = HSVtoRGB(darkenColor(RGBtoHSV(color2), false));

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
        
    for (let i = 0; i < data.length; i += 4) {
        console.log(data[i]);
        console.log(data[i+1]);
        console.log(data[i+2]);
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

    ctx.putImageData(imageData, 0, 0);
}

function darkenColor(hsb, light) {
    let [h, s, b] = hsb;

    if (light) {
        b -= 0.53;
    }
    else {
        b -= 0.49;        
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
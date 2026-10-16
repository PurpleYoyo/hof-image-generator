const img = new Image();
const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];
const default_color3 = [57, 104, 86];
const default_color4 = [50, 97, 79];

document.getElementById('color1').addEventListener("input", (event) => renderPreview(getGeneration()));
document.getElementById('color2').addEventListener("input", (event) => renderPreview(getGeneration()));

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
const ctx = canvas.getContext('2d');

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

    const color1 = hexToRgb(document.getElementById('color1').value);
    const color2 = hexToRgb(document.getElementById('color2').value);
    const color3 = hsbTpRgb(darkenColor(rgbToHsb(color1), true));
    const color4 = hsbTpRgb(darkenColor(rgbToHsb(color2), false));

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
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

    ctx.putImageData(data, 0, 0);
}

function darkenColor(hsb, light) {
    let [h, s, b] = hsb;

    if (light) {
        b -= 53;
    }
    else {
        b -= 49;        
    }

    return [h, s, b];
}

// https://github.com/Chalarangelo/30-seconds-of-code/blob/master/content/snippets/js/s/rgb-hex-hsl-hsb-color-format-conversion.md

function hexToRgb(hex) {
    let h = hex.slice(0);
    
    if (h.length === 3) {
        h = [...h].map(x => x + x).join('');
    }
    else if (h.length === 8) {
        alpha = true;
    }

    h = parseInt(h, 16);

    let r = h >>> (16);
    let g = (h & 0x00ff00) >>> 8;
    let b = (h & 0x0000ff) >>> 0;

    return [r, g, b];
}

function rgbToHsb(rgb) {
    let [r, g, b] = rgb;

    r /= 255;
    g /= 255;
    b /= 255;

    const v = Math.max(r, g, b)
    const n = v - Math.min(r, g, b);
    const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;

    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100]
}

function hsbTpRgb(hsb) {
    let [h, s, b] = hsb;

    s /= 100;
    b /= 100;

    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.sin(k(n), 4 - k(n), 1)))

    return [255 * f(5), 255 * f(3), 255 * f(1)];
}
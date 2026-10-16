// 53 | 49

const default_color1 = [132, 239, 198];
const default_color2 = [115, 222, 181];

document.getElementById('color1').addEventListener("input", (event) => renderPreview(3));
document.getElementById('color2').addEventListener("input", (event) => renderPreview(3));

function renderPreview(generation) {
    const color1 = hexToRgb(document.getElementById('color1').value);
    const color2 = hexToRgb(document.getElementById('color2').value);

    const container = document.getElementById('preview');
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    if (!canvas) return;

    const img = new Image();
    img.src = `g${generation}-template.png`;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        }

        ctx.drawImage(img, 0, 0);
    }
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
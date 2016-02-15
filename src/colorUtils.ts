const reRgb = /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const reRgba = /^rgba\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*((0\.|\.)?\d+)\s*\)$/i;

function toRgba(color: string): [number, number, number, number] {
    if (color.length === 4 && color[0] === '#') {
        return [parseInt(color[1], 16) * 17, parseInt(color[2], 16) * 17, parseInt(color[3], 16) * 17, 1];
    }
    if (color.length === 7 && color[0] === '#') {
        return [parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16), 1];
    }
    let m = color.match(reRgb);
    if (m) {
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1];
    }
    m = color.match(reRgba);
    if (m) {
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4])];
    }
    if (color === "transparent")
        return [0, 0, 0, 0];
    throw new Error("Invalid color " + color);
}

function toString(color: [number, number, number, number]):string {
    if (color[3]===1) {
        return `rgb(${color[0]},${color[1]},${color[2]})`;
    }
    return `rgba(${color[0]},${color[1]},${color[2]},${color[3].toFixed(3)})`;
}

export function withTransparency(color: string, alpha: number) {
    let c = toRgba(color);
    c[3]*=alpha;
    return toString(c); 
}
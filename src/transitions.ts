const easeOutFunction = 'cubic-bezier(0.23, 1, 0.32, 1)';
const easeInOutFunction = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';

export function easeOut(duration?: string, property?: string) {
    return create(duration, property);
}

export function easeInOut(duration?: string, property?: string) {
    return create(duration, property, undefined, easeInOutFunction);
}

function create(duration = '450ms', property = 'all', delay = '0ms', easeFunction = easeOutFunction) {
    return property + ' ' + duration + ' ' + easeFunction + ' ' + delay;
};

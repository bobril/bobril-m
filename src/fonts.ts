import * as b from "bobril";

b.asset("node_modules/webfontloader/webfontloader.js");

declare var WebFont: any;

export function initRobotoFonts(subsets = 'latin') {
    WebFont.load({ google: { families: ['Roboto:400,500:' + subsets] },
        active() { b.invalidate(); },
        inactive() { b.invalidate(); },
        classes: false
    });
}

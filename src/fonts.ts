import * as b from "bobril";

b.asset("node_modules/webfontloader/webfontloader.js");
declare var WebFont: any;

export function loadFonts() {
    WebFont.load({ google: { families: [ 'Roboto:400,500:latin,latin-ext' ] } });
    b.injectCss("html{margin:0px;width:100%;height:100%}body{margin:0px;width:100%;height:100%}")
}

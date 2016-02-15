import * as b from "bobril";

export function initNormalize() {
    let cover = "{margin:0px;width:100%;height:100%}";
    b.injectCss("html" + cover + "body" + cover);
}

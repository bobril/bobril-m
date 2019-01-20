import * as b from "bobril";

const spacerStyle = b.styleDef({
    display: "inline-block",
    width: 8,
    height: 8
});

const spacer = b.style({ tag: "span" }, spacerStyle);

export function Spacer(): b.IBobrilNode<any> {
    return spacer;
}

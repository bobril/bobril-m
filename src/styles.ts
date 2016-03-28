import * as b from "bobril";
import * as Colors from "./colors";
import { withTransparency } from "./colorUtils";

export let primary1Color = Colors.cyan500;
export let primary2Color = Colors.cyan700;
export let primary3Color = Colors.grey400;
export let accent1Color = Colors.pinkA200;
export let accent2Color = Colors.grey100;
export let accent3Color = Colors.grey500;
export let textColor = withTransparency(Colors.black, 0.87);
export let checkboxOffColor = withTransparency(Colors.black, 0.54);
export let alternateTextColor = Colors.white;
export let canvasColor = Colors.white;
export let borderColor = Colors.grey300;
export let disabledColor = withTransparency(Colors.black, 0.3);
export let sliderColor = withTransparency(Colors.black, 0.54);
export let alternateDisabledColor = Colors.grey50;
export let pickerHeaderColor = Colors.cyan500;
export let clockCircleColor = withTransparency(Colors.black, 0.07);
export let shadowColor = Colors.black;
export let hoverColor = withTransparency("#999", 0.3);
export let keyboardFocusColor = withTransparency("#777", 0.3);
export let errorColor = Colors.red500;

export let fontFamily = 'Roboto, sans-serif';

export let zDepthShadows = [
    [1, 6, 0.12, 1, 4, 0.12],
    [3, 10, 0.16, 3, 10, 0.23],
    [10, 30, 0.19, 6, 10, 0.23],
    [14, 45, 0.25, 10, 18, 0.22],
    [19, 60, 0.30, 15, 20, 0.22],
].map((d, i) =>
    b.styleDef({ boxShadow: () => `0 ${d[0]}px ${d[1]}px ${withTransparency(shadowColor, d[2])},0 ${d[3]}px ${d[4]}px ${withTransparency(shadowColor, d[5])}` }, null, "zDepth" + (i + 1))
    );

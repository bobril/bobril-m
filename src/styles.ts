import * as b from "bobril";
import * as Colors from "./colors";
import * as c from "./styleConsts";
import { withTransparency } from "./colorUtils";

export let strPrimary1Color = Colors.cyan500;
export let strPrimary2Color = Colors.cyan700;
export let strPrimary3Color = Colors.grey400;
export let strAccent1Color = Colors.pinkA200;
export let strAccent2Color = Colors.grey100;
export let strAccent3Color = Colors.grey500;
export let strTextColor = withTransparency(Colors.black, 0.87);
export let strCheckboxOffColor = withTransparency(Colors.black, 0.54);
export let strSecondaryTextColor = Colors.grey500;
export let strSelectColor = withTransparency(Colors.black, 0.2);
export let strSubheaderColor = withTransparency(Colors.black, 0.54);
export let strAlternateTextColor = Colors.white;
export let strCanvasColor = Colors.white;
export let strBorderColor = Colors.grey300;
export let strDisabledColor = withTransparency(Colors.black, 0.3);
export let strSliderColor = withTransparency(Colors.black, 0.54);
export let strAlternateDisabledColor = Colors.grey50;
export let strPickerHeaderColor = Colors.cyan500;
export let strClockCircleColor = withTransparency(Colors.black, 0.07);
export let strShadowColor = Colors.black;
export let strHoverColor = withTransparency("#999", 0.3);
export let strKeyboardFocusColor = withTransparency("#777", 0.3);
export let strErrorColor = Colors.red500;

export const primary1Color = () => strPrimary1Color;
export const primary2Color = () => strPrimary2Color;
export const primary3Color = () => strPrimary3Color;
export const accent1Color = () => strAccent1Color;
export const accent2Color = () => strAccent2Color;
export const accent3Color = () => strAccent3Color;
export const textColor = () => strTextColor;
export const checkboxOffColor = () => strCheckboxOffColor;
export const subheaderColor = () => strSubheaderColor;
export const secondaryTextColor = () => strSecondaryTextColor;
export const selectColor = () => strSelectColor;
export const alternateTextColor = () => strAlternateTextColor;
export const canvasColor = () => strCanvasColor;
export const borderColor = () => strBorderColor;
export const disabledColor = () => strDisabledColor;
export const sliderColor = () => strSliderColor;
export const alternateDisabledColor = () => strAlternateDisabledColor;
export const pickerHeaderColor = () => strPickerHeaderColor;
export const clockCircleColor = () => strClockCircleColor;
export const shadowColor = () => strShadowColor;
export const hoverColor = () => strHoverColor;
export const keyboardFocusColor = () => strKeyboardFocusColor;
export const errorColor = () => strErrorColor;

export let strFontFamily = 'Roboto, sans-serif';

export const fontFamily = () => strFontFamily;

export let nestedLevelDepth = 18;
export let iconSize = 24;

export let zDepthShadows = [
    [1, 6, 0.12, 1, 4, 0.12],
    [3, 10, 0.16, 3, 10, 0.23],
    [10, 30, 0.19, 6, 10, 0.23],
    [14, 45, 0.25, 10, 18, 0.22],
    [19, 60, 0.30, 15, 20, 0.22],
].map((d, i) =>
    b.styleDef({ boxShadow: () => `0 ${d[0]}px ${d[1]}px ${withTransparency(strShadowColor, d[2])},0 ${d[3]}px ${d[4]}px ${withTransparency(strShadowColor, d[5])}` }, null, "zDepth" + (i + 1))
    );

export let zIndex = {
    menu: 1000,
    popover: 1000
}

b.selectorStyleDef("html", [c.widthHeight100p, {
    margin: 0
}]);

b.selectorStyleDef("body", [c.widthHeight100p, {
    margin: 0,
    backgroundColor: canvasColor,
    fontFamily: fontFamily,
    color: textColor
}]);

export function lightTheme() {
    strPrimary1Color = Colors.cyan500;
    strPrimary2Color = Colors.cyan700;
    strPrimary3Color = Colors.grey400;
    strAccent1Color = Colors.pinkA200;
    strAccent2Color = Colors.grey100;
    strAccent3Color = Colors.grey500;
    strTextColor = withTransparency(Colors.black, 0.87);
    strCheckboxOffColor = withTransparency(Colors.black, 0.54);
    strSecondaryTextColor = Colors.grey500;
    strSelectColor = withTransparency(Colors.black, 0.2);
    strSubheaderColor = withTransparency(Colors.black, 0.54);
    strAlternateTextColor = Colors.white;
    strCanvasColor = Colors.white;
    strBorderColor = Colors.grey300;
    strDisabledColor = withTransparency(Colors.black, 0.3);
    strSliderColor = withTransparency(Colors.black, 0.54);
    strAlternateDisabledColor = Colors.grey50;
    strPickerHeaderColor = Colors.cyan500;
    strClockCircleColor = withTransparency(Colors.black, 0.07);
    strShadowColor = Colors.black;
    strHoverColor = withTransparency("#999", 0.3);
    strKeyboardFocusColor = withTransparency("#777", 0.3);
    strErrorColor = Colors.red500;
    b.invalidateStyles();
}

export function darkTheme() {
    strPrimary1Color = Colors.cyan700;
    strPrimary2Color = Colors.cyan700;
    strPrimary3Color = Colors.grey600;
    strAccent1Color = Colors.pinkA200;
    strAccent2Color = Colors.pinkA400;
    strAccent3Color = Colors.pinkA100;
    strTextColor = Colors.white;
    strAlternateTextColor = '#303030';
    strCanvasColor = '#303030';
    strBorderColor = withTransparency(Colors.white, 0.3);
    strDisabledColor = withTransparency(Colors.white, 0.3);
    strAlternateDisabledColor = Colors.grey800;
    strCheckboxOffColor = withTransparency(Colors.black, 0.54);
    strSecondaryTextColor = Colors.grey500;
    strSelectColor = withTransparency(Colors.black, 0.2);
    strSubheaderColor = withTransparency(Colors.white, 0.3);
    strSliderColor = withTransparency(Colors.black, 0.54);
    strPickerHeaderColor = Colors.cyan500;
    strClockCircleColor = withTransparency(Colors.black, 0.07);
    strShadowColor = Colors.black;
    strHoverColor = withTransparency("#999", 0.3);
    strKeyboardFocusColor = withTransparency("#777", 0.3);
    strErrorColor = Colors.red500;
    b.invalidateStyles();
}

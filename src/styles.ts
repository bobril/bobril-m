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
export let strRightIconDesktopFillColor = Colors.grey600;

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

export function isDesktop() {
    return b.getMedia().deviceCategory >= b.BobrilDeviceCategory.Desktop;
}

export let zDepthShadows = [
    [1, 6, 0.12, 1, 4, 0.12],
    [3, 10, 0.16, 3, 10, 0.23],
    [10, 30, 0.19, 6, 10, 0.23],
    [14, 45, 0.25, 10, 18, 0.22],
    [19, 60, 0.30, 15, 20, 0.22],
].map((d, i) =>
    b.styleDef({ boxShadow: () => `0 ${d[0]}px ${d[1]}px ${withTransparency(strShadowColor, d[2])},0 ${d[3]}px ${d[4]}px ${withTransparency(strShadowColor, d[5])}` }, undefined, "zDepth" + (i + 1))
    );

b.selectorStyleDef("html", [c.widthHeight100p, {
    margin: 0
}]);

b.selectorStyleDef("body", [c.widthHeight100p, {
    margin: 0,
    backgroundColor: canvasColor,
    fontFamily: fontFamily,
    color: textColor
}]);

export interface ITheme {
    primary1Color?: string;
    primary2Color?: string;
    primary3Color?: string;
    accent1Color?: string;
    accent2Color?: string;
    accent3Color?: string;
    textColor?: string;
    checkboxOffColor?: string;
    secondaryTextColor?: string;
    selectColor?: string;
    subheaderColor?: string;
    alternateTextColor?: string;
    canvasColor?: string;
    borderColor?: string;
    disabledColor?: string;
    sliderColor?: string;
    alternateDisabledColor?: string;
    pickerHeaderColor?: string;
    clockCircleColor?: string;
    shadowColor?: string;
    hoverColor?: string;
    keyboardFocusColor?: string;
    errorColor?: string;
    rightIconDesktopFillColor?: string;
}

export function defineTheme(theme: ITheme) {
    if (theme.primary1Color) strPrimary1Color = theme.primary1Color;
    if (theme.primary2Color) strPrimary2Color = theme.primary2Color;
    if (theme.primary3Color) strPrimary3Color = theme.primary3Color;
    if (theme.accent1Color) strAccent1Color = theme.accent1Color;
    if (theme.accent2Color) strAccent2Color = theme.accent2Color;
    if (theme.accent3Color) strAccent3Color = theme.accent3Color;
    if (theme.textColor) strTextColor = theme.textColor;
    if (theme.checkboxOffColor) strCheckboxOffColor = theme.checkboxOffColor;
    if (theme.secondaryTextColor) strSecondaryTextColor = theme.secondaryTextColor;
    if (theme.selectColor) strSelectColor = theme.selectColor;
    if (theme.subheaderColor) strSubheaderColor = theme.subheaderColor;
    if (theme.alternateTextColor) strAlternateTextColor = theme.alternateTextColor;
    if (theme.canvasColor) strCanvasColor = theme.canvasColor;
    if (theme.borderColor) strBorderColor = theme.borderColor;
    if (theme.disabledColor) strDisabledColor = theme.disabledColor;
    if (theme.sliderColor) strSliderColor = theme.sliderColor;
    if (theme.alternateDisabledColor) strAlternateDisabledColor = theme.alternateDisabledColor;
    if (theme.pickerHeaderColor) strPickerHeaderColor = theme.pickerHeaderColor;
    if (theme.clockCircleColor) strClockCircleColor = theme.clockCircleColor;
    if (theme.shadowColor) strShadowColor = theme.shadowColor;
    if (theme.hoverColor) strHoverColor = theme.hoverColor;
    if (theme.keyboardFocusColor) strKeyboardFocusColor = theme.keyboardFocusColor;
    if (theme.errorColor) strErrorColor = theme.errorColor;
    if (theme.rightIconDesktopFillColor) strRightIconDesktopFillColor = theme.rightIconDesktopFillColor;
    b.invalidateStyles();
}

export function lightTheme() {
    defineTheme({
        primary1Color: Colors.cyan500,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.grey400,
        accent1Color: Colors.pinkA200,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: withTransparency(Colors.black, 0.87),
        checkboxOffColor: withTransparency(Colors.black, 0.54),
        secondaryTextColor: Colors.grey500,
        selectColor: withTransparency(Colors.black, 0.2),
        subheaderColor: withTransparency(Colors.black, 0.54),
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: withTransparency(Colors.black, 0.3),
        sliderColor: withTransparency(Colors.black, 0.54),
        alternateDisabledColor: Colors.grey50,
        pickerHeaderColor: Colors.cyan500,
        clockCircleColor: withTransparency(Colors.black, 0.07),
        shadowColor: Colors.black,
        hoverColor: withTransparency("#999", 0.3),
        keyboardFocusColor: withTransparency("#777", 0.3),
        errorColor: Colors.red500
    });
}

export function darkTheme() {
    defineTheme({
        primary1Color: Colors.cyan700,
        primary2Color: Colors.cyan700,
        primary3Color: Colors.grey600,
        accent1Color: Colors.pinkA200,
        accent2Color: Colors.pinkA400,
        accent3Color: Colors.pinkA100,
        textColor: Colors.white,
        alternateTextColor: '#303030',
        canvasColor: '#303030',
        borderColor: withTransparency(Colors.white, 0.3),
        disabledColor: withTransparency(Colors.white, 0.3),
        alternateDisabledColor: Colors.grey800,
        checkboxOffColor: withTransparency(Colors.black, 0.54),
        secondaryTextColor: Colors.grey500,
        selectColor: withTransparency(Colors.black, 0.2),
        subheaderColor: withTransparency(Colors.white, 0.3),
        sliderColor: withTransparency(Colors.black, 0.54),
        pickerHeaderColor: Colors.cyan500,
        clockCircleColor: withTransparency(Colors.black, 0.07),
        shadowColor: Colors.black,
        hoverColor: withTransparency("#999", 0.3),
        keyboardFocusColor: withTransparency("#777", 0.3),
        errorColor: Colors.red500
    });
}
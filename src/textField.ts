import * as b from "bobril";
import * as styles from "./styles";
import * as colors from "./colors";
import * as colorUtils from "./colorUtils";
import * as transitions from "./transitions";
import * as c from "./styleConsts";
import * as uniqueId from './uniqueId';
import * as enhTextArea from './enhancedTextArea';
import { TextFieldHint } from './textFieldHint';
import { TextFieldLabel } from './textFieldLabel';
import { TextFieldUnderline } from './textFieldUnderline';

function isValid(value: string): boolean {
    return value != null && value !== "";
}

export interface ITextFieldData extends b.IValueData<string> {
    /// text or password
    inputType?: string;
    disabled?: boolean;
    tabindex?: number;
    labelText?: b.IBobrilChildren;
    hintText?: b.IBobrilChildren;
    errorText?: b.IBobrilChildren;
    /// set this to have multiline text area
    rows?: number;
    rowsMax?: number;
}

interface ITextFieldCtx extends b.IBobrilCtx {
    data: ITextFieldData;
    focused: boolean;
    id: string;
    inputHeight: number;
    // following are lazily created on multiline
    onTAChange?: (value: string) => void;
    onTAHeightChange?: (height: number) => void;
}

const rootStyle = b.styleDef([c.positionRelative, {
    fontSize: 16,
    lineHeight: '24px',
    width: '100%',
    display: 'inline-block',
    backgroundColor: colors.transparent,
    fontFamily: styles.fontFamily,
    transition: transitions.easeOut('200ms', 'height')
}]);

const errorFontSize = 12;
const errorStyle = b.styleDef([c.positionRelative, {
    bottom: 2,
    fontSize: errorFontSize,
    lineHeight: '12px',
    color: styles.errorColor,
    transition: transitions.easeOut()
}]);

const inputStyle = b.styleDef([c.positionRelative, c.widthHeight100p, c.noTapHighlight, {
    padding: 0,
    border: 'none',
    outline: 'none',
    backgroundColor: colors.transparent,
    color: styles.textColor,
    font: 'inherit'
}], { "-webkit-autofill": { 
    // workaround for Chrome bug
    boxShadow: "0 0 0 99px white inset" 
} });

const inputDisabledStyle = b.styleDefEx(inputStyle, {
    color: styles.disabledColor
});

const realInputComponent: b.IBobrilComponent = {
    onChange(ctx: b.IBobrilCtx, value: string) {
        const ctxOfEnhanced = <ITextFieldCtx>ctx.me.parent.ctx;
        b.emitChange(ctxOfEnhanced.data, value);
        b.invalidate(ctxOfEnhanced);
    }
};

function createLazyMultilineCallbacks(ctx: ITextFieldCtx) {
    if (ctx.onTAChange != null) return;
    ctx.onTAChange = (value: string) => {
        b.emitChange(ctx.data, value);
        b.invalidate(ctx);
    };
    ctx.onTAHeightChange = (height: number) => {
        ctx.inputHeight = height;
        b.invalidate(ctx);
    };
}

export const TextField = b.createComponent<ITextFieldData>({
    init(ctx: ITextFieldCtx, me: b.IBobrilNode) {
        ctx.focused = false;
        ctx.id = uniqueId.generateUniqueId();
        ctx.inputHeight = 24 * (ctx.data.rows || 1);
    },
    onFocusIn(ctx: ITextFieldCtx) {
        ctx.focused = true;
        b.invalidate(ctx);
    },
    onFocusOut(ctx: ITextFieldCtx) {
        ctx.focused = false;
        b.invalidate(ctx);
    },
    onClick(ctx: ITextFieldCtx):boolean {
        if (ctx.data.disabled) return false;
        if (!ctx.focused) {
            b.focus(ctx.me);
            return true;
        }
    },
    render(ctx: ITextFieldCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        let floatingLabelColor = styles.strDisabledColor;
        let stylesError: b.IBobrilStyle[] = [errorStyle];
        const value = b.getValue(d.value);
        const hasValue = isValid(value);
        if (hasValue) {
            floatingLabelColor = colorUtils.setTransparency(floatingLabelColor, 0.5);
        }
        if (ctx.focused) {
            floatingLabelColor = styles.strPrimary1Color;
        }
        let stylesInput: b.IBobrilStyle[] = [inputStyle, d.disabled && inputDisabledStyle];
        let height = ctx.inputHeight + 24;
        if (d.labelText != null) {
            height += 24;
            stylesInput.push({ boxSizing: 'border-box' });

            if (d.rows == null) {
                stylesInput.push({ marginTop: 14 });
            }

            if (d.errorText != null) {
                stylesError.push({ bottom: d.rows == null ? errorFontSize + 3 : 3 });
            }
        }
        if (d.errorText != null && ctx.focused) {
            floatingLabelColor = styles.strErrorColor;
        }
        let errorTextElement = d.errorText != null ? b.style({ tag: "div", key: "error", children: d.errorText }, stylesError) : null;
        let floatingLabelTextElement = d.labelText != null ? b.withKey(TextFieldLabel({ htmlFor: ctx.id, children: d.labelText, disabled: d.disabled, shrink: hasValue || ctx.focused, color: floatingLabelColor }), "label") : null;
        if (d.rows != null) {
            createLazyMultilineCallbacks(ctx);
            stylesInput.push({
                marginTop: d.labelText != null ? 36 : 12,
                marginBottom: d.labelText != null ? -36 : -12,
                boxSizing: 'border-box',
                font: 'inherit'
            });
        }
        let inputElement = d.rows != null ?
            enhTextArea.EnhancedTextarea({
                rows: d.rows,
                rowsMax: d.rowsMax,
                disabled: d.disabled,
                onChange: ctx.onTAChange,
                onHeightChange: ctx.onTAHeightChange,
                tabindex: d.tabindex,
                value,
                style: stylesInput,
                id: ctx.id
            }) :
            b.style({
                tag: "input",
                attrs: { type: d.inputType, disabled: d.disabled, id: ctx.id, value },
                component: realInputComponent
            }, stylesInput);
        b.style(me, rootStyle, { height });
        me.children = [
            floatingLabelTextElement,
            d.hintText != null && b.withKey(TextFieldHint({ show: !(hasValue || (d.labelText != null && !ctx.focused)), children: d.hintText }), "hint"),
            inputElement,
            TextFieldUnderline({
                disabled: d.disabled,
                error: d.errorText != null,
                focus: ctx.focused
            }),
            errorTextElement
        ];
    }
});

import * as b from 'bobril';
import * as icons from 'bobril-m-icons';
import * as button from './button';
import * as iconButton from './iconButton';
import * as list from './list';
import * as ripple from './ripple';
import * as c from './styleConsts';
import * as styles from './styles';
import * as transitions from './transitions';

export enum SecondaryTextLines {
    Single, Double
}

export interface IListItemData {
    autoGenerateNestedIndicator?: boolean;
    children?: b.IBobrilChildren;
    disabled?: boolean;
    disableKeyboardFocus?: boolean;
    initiallyOpen?: boolean;
    insetChildren?: boolean;
    isSelect?: boolean;
    leftAvatar?: b.IBobrilNode;
    leftCheckbox?: b.IBobrilNode;
    leftIcon?: (data: { color: string }) => b.IBobrilNode;
    onNestedListToggle?: () => void;
    onTouchTap?: () => void;
    nestedLevel?: number;
    nestedItems?: b.IBobrilNode[];
    primaryText?: string;
    rightAvatar?: b.IBobrilNode;
    rightIcon?: (data: { color: string }) => b.IBobrilNode;
    rightIconButton?: b.IBobrilNode;
    rightToggle?: b.IBobrilNode;
    secondaryText?: string;
    secondaryTextLines?: SecondaryTextLines;
    tabindex?: number;
}

interface IItemHeaderCtx extends b.IBobrilCtx {
    autoGenerateNestedIndicator: boolean,
    data: IListItemData;
    down: boolean;
    hover: boolean;
    nestedLevel: number;
    focusFromKeyboard: boolean;
    pointerDown: () => void;
    rightIconButtonKeyboardFocused: boolean;
}

let rootStyle = b.styleDef({
    color: styles.textColor,
    display: 'block',
    fontSize: 16,
    lineHeight: '16px',
    position: 'relative',
    transition: transitions.easeOut()
});

let iconStyle = b.styleDef({
    height: 24,
    width: 24,
    display: 'block',
    position: 'absolute',
    margin: 12
});

let innerDivStyle = b.styleDef({ position: 'relative' });
let leftIconStyle = b.styleDef({ left: 4 });
let rightIconStyle = b.styleDef({ right: 4 });
let avatarStyle = b.styleDef({ position: 'absolute' });
let leftAvatarStyle = b.styleDef({ left: 16 });
let rightAvatarStyle = ({ right: 16 });

let leftCheckboxStyle = b.styleDef({
    position: 'absolute',
    display: 'block',
    width: 24,
    left: 16
});

let rightToggleStyle = b.styleDef({
    position: 'absolute',
    display: 'block',
    width: 54,
    right: 8
});

let secondaryTextStyle = b.styleDef({
    fontSize: 14,
    margin: 0,
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

let rightIconButtonStyle = b.styleDef({
    position: 'absolute',
    display: 'block',
    right: 4
});

let enabledStyle = b.styleDef([c.userSelectNone, {
    overflow: 'hidden',
    cursor: 'pointer'
}], { focus: { outline: 'none' } });

let disabledStyle = b.styleDef([c.userSelectNone, {
    overflow: 'hidden',
    cursor: 'default'
}]);

function createChildren(ctx: IItemHeaderCtx): b.IBobrilNode {
    let d = ctx.data;
    let children: b.IBobrilChildren[] = [];
    let singleAvatar = !d.secondaryText && (d.leftAvatar || d.rightAvatar);
    let twoLine = d.secondaryText && d.secondaryTextLines === SecondaryTextLines.Single;
    let threeLine = d.secondaryText && d.secondaryTextLines === SecondaryTextLines.Double;
    let hasNestListItems = d.nestedItems && d.nestedItems.length;
    let hasRightElement = d.rightAvatar || d.rightIcon || d.rightIconButton || d.rightToggle;
    let needsNestedIndicator = hasNestListItems && ctx.autoGenerateNestedIndicator && !hasRightElement;

    if (d.leftIcon)
        children.push(b.styledDiv(d.leftIcon({ color: styles.strPrimary1Color }),
            iconStyle, leftIconStyle, { top: twoLine ? 12 : singleAvatar ? 4 : 0 })
        );
    if (d.rightIcon)
        children.push(b.styledDiv(d.rightIcon({ color: styles.strPrimary1Color }),
            iconStyle, rightIconStyle, { top: twoLine ? 12 : singleAvatar ? 4 : 0 })
        );
    if (d.leftAvatar)
        children.push(b.styledDiv(d.leftAvatar, avatarStyle, leftAvatarStyle,
            { top: singleAvatar ? 8 : 16 })
        );
    if (d.rightAvatar)
        children.push(b.styledDiv(d.rightAvatar, avatarStyle, rightAvatarStyle,
            { top: singleAvatar ? 8 : 16 })
        );
    if (d.leftCheckbox)
        children.push(b.styledDiv(d.leftCheckbox, leftCheckboxStyle,
            { top: twoLine ? 24 : singleAvatar ? 16 : 12 })
        );

    if (d.rightIconButton || needsNestedIndicator) {
        let rightIconButtonElement = d.rightIconButton;
        if (needsNestedIndicator) {
            rightIconButtonElement = iconButton.IconButton({
                children: { children: d.initiallyOpen ? icons.navigationExpandLess() : icons.navigationExpandMore() },
                action: d.onNestedListToggle,
                onFocus: () => { ctx.rightIconButtonKeyboardFocused = true; b.invalidate(ctx); },
                onBlur: () => { ctx.rightIconButtonKeyboardFocused = false; b.invalidate(ctx); }
            });
        }

        children.push(b.styledDiv(rightIconButtonElement, rightIconButtonStyle,
            { top: twoLine ? 12 : singleAvatar ? 4 : 0 })
        );
    }

    if (d.rightToggle)
        children.push(b.styledDiv(d.rightToggle, rightToggleStyle, {
            top: twoLine ? 25 : singleAvatar ? 17 : 13
        }));
    if (d.primaryText)
        children.push(d.primaryText);
    if (d.secondaryText)
        children.push(b.styledDiv(d.secondaryText, secondaryTextStyle, {
            color: styles.secondaryTextColor,
            lineHeight: threeLine ? '18px' : '16px',
            height: threeLine ? 36 : 16,
            whiteSpace: threeLine ? null : 'nowrap',
            display: threeLine ? '-webkit-box' : null,
            lineClamp: threeLine ? 2 : null,
            boxOrient: threeLine ? 'vertical' : null
        }));

    let hasCheckbox = d.leftCheckbox || d.rightToggle;

    return b.styledDiv(children, rootStyle, innerDivStyle, {
        marginLeft: ctx.nestedLevel * styles.nestedLevelDepth,
        paddingLeft: d.leftIcon || d.leftAvatar || d.leftCheckbox || d.insetChildren ? 72 : 16,
        paddingRight: d.rightIcon || d.rightAvatar || d.rightIconButton ? 56 : d.rightToggle ? 72 : 16,
        paddingBottom: singleAvatar ? 20 : 16,
        paddingTop: !singleAvatar || threeLine ? 16 : 20
    });
}

const ItemHeader = b.createComponent<IListItemData>({
    init(ctx: IItemHeaderCtx) {
        let d = ctx.data;
        ctx.focusFromKeyboard = false;
        ctx.autoGenerateNestedIndicator = d.autoGenerateNestedIndicator !== undefined
            ? d.autoGenerateNestedIndicator
            : true;
        ctx.nestedLevel = d.nestedLevel ? d.nestedLevel : 0;
    },
    render(ctx: IItemHeaderCtx, me: b.IBobrilNode) {
        let d = ctx.data;
        let showHover = (ctx.hover || ctx.focusFromKeyboard) && !d.disabled;
        let singleAvatar = !d.secondaryText && (d.leftAvatar || d.rightAvatar);
        let twoLine = d.secondaryText && d.secondaryTextLines === SecondaryTextLines.Single;
        let threeLine = d.secondaryText && d.secondaryTextLines > 1;

        me.attrs = {
            'aria-disabled': d.disabled ? 'true' : 'false',
            tabindex: d.disabled ? undefined : (d.tabindex || 0)
        };
        b.style(me, d.disabled ? disabledStyle : enabledStyle);
        me.children = !d.rightToggle && !d.leftCheckbox
            ? ripple.Ripple({
                pulse: ctx.focusFromKeyboard && !d.disabled,
                pointerDown: d.onNestedListToggle,
                disabled: !!d.disabled || !!d.rightToggle || !!d.leftCheckbox,
                style: [{
                    backgroundColor: showHover && !ctx.rightIconButtonKeyboardFocused
                        ? (ctx.focusFromKeyboard ? styles.keyboardFocusColor : styles.hoverColor)
                        : d.isSelect ? styles.selectColor :  undefined
                }]
            }, createChildren(ctx))
            : createChildren(ctx);
    },
    onPointerUp(ctx: IItemHeaderCtx, ev: b.IBobrilPointerEvent): boolean {
        let d = ctx.data;
        if (d.disabled) return false;
        if (d.onTouchTap) d.onTouchTap();
        return true;
    },
    onKeyDown(ctx: IItemHeaderCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 32 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            ctx.down = true;
            b.invalidate(ctx);
            return true;
        }
        if (ev.which === 13 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            let a = ctx.data.onTouchTap || ctx.data.onNestedListToggle;
            if (a) a();
            return true;
        }
        return false;
    },
    onKeyUp(ctx: IItemHeaderCtx, ev: b.IKeyDownUpEvent): boolean {
        if (ev.which === 32 && !ctx.data.disabled && ctx.focusFromKeyboard) {
            ctx.down = false;
            b.invalidate(ctx);
            let a = ctx.data.onNestedListToggle;
            if (a) a();
            return true;
        }
        return false;
    },
    onMouseEnter(ctx: IItemHeaderCtx) {
        ctx.hover = true;
        b.invalidate(ctx);
    },
    onMouseLeave(ctx: IItemHeaderCtx) {
        ctx.hover = false;
        b.invalidate(ctx);
    },
    onFocus(ctx: IItemHeaderCtx) {
        if (!ctx.down) {
            ctx.focusFromKeyboard = true;
            b.invalidate(ctx);
        }
    },
    onFocusOut(ctx: IItemHeaderCtx) {
        ctx.focusFromKeyboard = false;
        b.invalidate(ctx);
    },
    onBlur(ctx: IItemHeaderCtx) {
        ctx.focusFromKeyboard = false;
        b.invalidate(ctx);
    }
});

interface IListItemCtx extends b.IBobrilCtx {
    data: IListItemData;
    isOpen: boolean;
}

export const ListItem = b.createComponent<IListItemData>({
    init(ctx: IListItemCtx) {
        ctx.isOpen = ctx.data.initiallyOpen ? ctx.data.initiallyOpen : false;
    },
    render(ctx: IListItemCtx, me: b.IBobrilNode) {
        let d = ctx.data;
        let nestedItems: b.IBobrilNode;
        if (ctx.isOpen && d.nestedItems && d.nestedItems.length) {
            nestedItems = list.List({ children: d.nestedItems, nestedLevel: d.nestedLevel + 1 });
        }
        d.onNestedListToggle = () => {
            ctx.isOpen = !ctx.isOpen;
            b.invalidate(ctx);
        }
        d.initiallyOpen = ctx.isOpen;
        me.children = [
            ItemHeader(d),
            nestedItems
        ];
    }
});

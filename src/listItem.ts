import * as b from 'bobril';
import * as icons from 'bobril-m-icons';
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
    action?: () => void;
    autoGenerateNestedIndicator?: boolean;
    children?: b.IBobrilChildren;
    disabled?: boolean;
    innerDivStyle?: b.IBobrilStyles;
    insetChildren?: boolean;
    selected?: boolean;
    focusFromKeyboard?: boolean;
    open?: b.IProp<boolean>;
    leftAvatar?: b.IBobrilNode;
    leftCheckbox?: b.IBobrilNode;
    leftIcon?: b.IBobrilNode;
    nestedItems?: b.IBobrilChildren;
    primaryText?: string;
    rightAvatar?: b.IBobrilNode;
    rightIcon?: b.IBobrilNode;
    rightIconButton?: b.IBobrilNode;
    rightToggle?: b.IBobrilNode;
    secondaryText?: string;
    secondaryTextLines?: SecondaryTextLines;
    style?: b.IBobrilStyles;
    tabindex?: number;
}

interface IItemHeaderCtx extends b.IBobrilCtx {
    autoGenerateNestedIndicator: boolean;
    data: IListItemCtx;
    open: b.IProp<boolean>;
    down: boolean;
    hover: boolean;
    nestedLevel: number;
    focusFromKeyboard: boolean;
    pointerDown: () => void;
    rightIconButtonKeyboardFocused: boolean;
}

const rootStyle = b.styleDef([c.positionRelative, {
    color: styles.textColor,
    display: 'block',
    fontSize: 16,
    lineHeight: '16px',
    transition: transitions.easeOut()
}]);

const iconStyle = b.styleDef([c.positionAbsolute, {
    height: 24,
    width: 24,
    display: 'block',
    margin: 12
}]);

const innerDivStyle = b.styleDef(c.positionRelative);
const leftIconStyle = b.styleDef({ left: 4 });
const rightIconStyle = b.styleDef({ right: 4 });
const avatarStyle = b.styleDef(c.positionAbsolute);
const leftAvatarStyle = b.styleDef({ left: 16 });
const rightAvatarStyle = b.styleDef({ right: 16 });

const leftCheckboxStyle = b.styleDef([c.positionAbsolute, {
    display: 'block',
    width: 24,
    left: 16
}]);

const rightToggleStyle = b.styleDef([c.positionAbsolute, {
    display: 'block',
    width: 54,
    right: 8
}]);

const secondaryTextCommonStyle = {
    fontSize: 14,
    margin: 0,
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: styles.secondaryTextColor
};

const twoLineSecondaryStyle = b.styleDef([secondaryTextCommonStyle, {
    lineHeight: '16px',
    height: 16,
    whiteSpace: 'nowrap'
}]);

const threeLineSecondaryStyle = b.styleDef([secondaryTextCommonStyle, {
    lineHeight: '18px',
    height: 36,
    display: '-webkit-box',
    lineClamp: 2,
    boxOrient: 'vertical'
}]);

const rightIconButtonStyle = b.styleDef([c.positionAbsolute, {
    display: 'block',
    right: 4
}]);

const enabledStyle = b.styleDef([c.userSelectNone, {
    overflow: 'hidden',
    cursor: 'pointer'
}], { focus: { outline: 'none' } });

const disabledStyle = b.styleDef([c.userSelectNone, {
    overflow: 'hidden',
    cursor: 'default'
}]);

function createChildren(ctx: IItemHeaderCtx): b.IBobrilNode {
    const d = ctx.data.data;
    const children: b.IBobrilChildren[] = [d.children];
    const singleAvatar = !d.secondaryText && (d.leftAvatar || d.rightAvatar);
    const twoLine = d.secondaryText && d.secondaryTextLines === SecondaryTextLines.Single;
    const threeLine = d.secondaryText && d.secondaryTextLines === SecondaryTextLines.Double;
    const hasNestListItems = d.nestedItems != null && d.nestedItems != [];
    const hasRightElement = d.rightAvatar || d.rightIcon || d.rightIconButton || d.rightToggle;
    const needsNestedIndicator = hasNestListItems && ctx.autoGenerateNestedIndicator && !hasRightElement;

    if (d.leftIcon)
        children.push(b.styledDiv(d.leftIcon, { color: styles.strPrimary1Color },
            iconStyle, leftIconStyle, { top: twoLine ? 12 : singleAvatar ? 4 : 0 })
        );
    if (d.rightIcon)
        children.push(b.styledDiv(d.rightIcon, { color: styles.strPrimary1Color },
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
                children: { children: ctx.open() ? icons.navigationExpandLess() : icons.navigationExpandMore() },
                action: ctx.data.toggleOpen,
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
        children.push(b.styledDiv(d.secondaryText, threeLine ? threeLineSecondaryStyle : twoLineSecondaryStyle));

    return b.styledDiv(children, rootStyle, innerDivStyle, {
        marginLeft: ctx.nestedLevel * styles.nestedLevelDepth,
        paddingLeft: d.leftIcon || d.leftAvatar || d.leftCheckbox || d.insetChildren ? 72 : 16,
        paddingRight: d.rightIcon || d.rightAvatar || d.rightIconButton ? 56 : d.rightToggle ? 72 : 16,
        paddingBottom: singleAvatar ? 20 : 16,
        paddingTop: !singleAvatar || threeLine ? 16 : 20
    }, d.innerDivStyle, d.style);
}

const ItemHeader = b.createComponent<IListItemCtx>({
    init(ctx: IItemHeaderCtx) {
        const d = ctx.data.data;
        ctx.open = d.open || b.prop(false);
        ctx.focusFromKeyboard = false;
        ctx.autoGenerateNestedIndicator = d.autoGenerateNestedIndicator !== undefined
            ? d.autoGenerateNestedIndicator
            : true;
        let level = 0;
        let node: b.IBobrilCacheNode | undefined = ctx.me;
        while (node != null) {
            if (node.component != null && node.component.id === "List") {
                if ((<list.IListData>node.data).privateNested)
                    level++;
                else
                    break;
            }
            node = node.parent;
        }
        ctx.nestedLevel = level;
    },
    render(ctx: IItemHeaderCtx, me: b.IBobrilNode) {
        const d = ctx.data.data;
        if (d.focusFromKeyboard != null)
            ctx.focusFromKeyboard = d.focusFromKeyboard;
        const showHover = (ctx.hover || ctx.focusFromKeyboard) && !d.disabled;
        me.attrs = {
            'aria-disabled': d.disabled ? 'true' : 'false',
            tabindex: (d.disabled || (d.focusFromKeyboard != null)) ? undefined : (d.tabindex || 0)
        };
        b.style(me, d.disabled ? disabledStyle : enabledStyle);
        me.children = !d.rightToggle && !d.leftCheckbox
            ? ripple.Ripple({
                pulse: ctx.focusFromKeyboard && !d.disabled,
                pointerDown: ctx.data.toggleOpen,
                disabled: !!d.disabled || !!d.rightToggle || !!d.leftCheckbox,
                style: [{
                    backgroundColor: showHover && !ctx.rightIconButtonKeyboardFocused
                        ? (ctx.focusFromKeyboard ? styles.keyboardFocusColor : styles.hoverColor)
                        : d.selected ? styles.selectColor : undefined
                }]
            }, createChildren(ctx))
            : createChildren(ctx);
    },
    onPointerUp(ctx: IItemHeaderCtx, _ev: b.IBobrilPointerEvent): boolean {
        const d = ctx.data.data;
        if (d.disabled) return false;
        if (d.action) d.action();
        return false;
    },
    onKeyDown(ctx: IItemHeaderCtx, ev: b.IKeyDownUpEvent): boolean {
        const d = ctx.data.data;
        if (ev.which === 32 && !d.disabled && ctx.focusFromKeyboard) {
            ctx.down = true;
            b.invalidate(ctx);
            return true;
        }
        if (ev.which === 13 && !d.disabled && ctx.focusFromKeyboard) {
            if (d.action) d.action();
            return true;
        }
        return false;
    },
    onKeyUp(ctx: IItemHeaderCtx, ev: b.IKeyDownUpEvent): boolean {
        const d = ctx.data.data;
        if (ev.which === 32 && !d.disabled && ctx.focusFromKeyboard) {
            ctx.down = false;
            b.invalidate(ctx);
            if (d.action) d.action();
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
    hasNested: boolean;
    open: b.IProp<boolean>;
    toggleOpen: () => void;
}

export const ListItem = b.createComponent<IListItemData>({
    init(ctx: IListItemCtx) {
        ctx.open = ctx.data.open || b.prop(false);
        ctx.toggleOpen = () => {
            ctx.open(!ctx.open());
            b.invalidate(ctx);
        };
    },
    render(ctx: IListItemCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        if (d.open) ctx.open = d.open;
        ctx.hasNested = d.nestedItems != null && d.nestedItems != [];
        let nestedItems: b.IBobrilNode | undefined;
        if (ctx.open() && ctx.hasNested) {
            nestedItems = list.List({ privateNested: true }, d.nestedItems);
        }
        me.children = [
            ItemHeader(ctx),
            nestedItems
        ];
    }
});

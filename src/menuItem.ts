import * as b from 'bobril';
import { ClickAwayListener } from './clickAwayListener';
import { ListItem } from './listItem';
import * as icons from "bobril-m-icons";
import { Menu, IMenuItemControllerChild } from './menu';
import { Popover } from './popover';
import { IPopoverOrigin } from './popoverOrigin';
import * as styles from './styles';
import { IPopoverAnimationDefaultData } from "./popoverAnimationDefault";

export interface IMenuItemData {
    anchorOrigin?: IPopoverOrigin,
    animation?: b.IComponentFactory<IPopoverAnimationDefaultData>,
    checked?: boolean,
    children?: b.IBobrilChildren,
    desktop?: boolean,
    disabled?: boolean,
    innerDivStyle?: b.IBobrilStyleDef,
    insetChildren?: boolean,
    leftIcon?: b.IBobrilNode,
    menuItems?: b.IBobrilChildren,
    action?: () => void,
    preventCloseOnAction?: boolean,
    primaryText?: string,
    rightIcon?: b.IBobrilNode,
    secondaryText?: string,
    style?: b.IBobrilStyleDef,
    targetOrigin?: IPopoverOrigin
}

interface IMenuItemCtx extends b.IBobrilCtx, IMenuItemControllerChild {
    data: IMenuItemData;
    open: boolean;
}

// have to be object instead of styleDef because of style overrides
const innerDivStyle = { paddingBottom: 0, paddingTop: 0 };

const rootStyle = b.styleDef({ whiteSpace: 'nowrap' });
const nestedMenuStyle = b.styleDef({ position: 'relative' });
const secondaryTextStyle = b.styleDef({ cssFloat: 'right' });
const leftIconDesktopStyle = b.styleDef({ left: 24, top: 4 });
const rightIconDesktopStyle = b.styleDef({ right: 24, top: 4 });

function handleAction(ctx: IMenuItemCtx) {
    if (!ctx.data.menuItems) {
        ctx.open = false;
        if (ctx.data.action) ctx.data.action();
        if (!ctx.data.preventCloseOnAction) {
            ctx.owner.close();
        }
    }
    else {
        ctx.open = !ctx.open;
    }
    b.invalidate(ctx);
};

function handleRequestClose(ctx: IMenuItemCtx) {
    ctx.open = false;
    b.invalidate(ctx);
};

export const MenuItem = b.createVirtualComponent<IMenuItemData>({
    init(ctx: IMenuItemCtx) {
        ctx.open = false;
        ctx.focused = false;
        ctx.owner = ctx.cfg.menuController;
        ctx.handleAction = () => handleAction(ctx);
    },
    render(ctx: IMenuItemCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        ctx.owner.childRender(ctx, d.disabled || false);
        let leftIconElement: b.IBobrilNode | undefined;
        if (d.leftIcon) {
            leftIconElement = b.style(d.leftIcon, { color: d.disabled ? styles.strDisabledColor : styles.strTextColor });
        } else if (d.checked) {
            leftIconElement = b.style(icons.navigationCheck(), { color: styles.strTextColor });
        }

        if (leftIconElement)
            leftIconElement = b.styledDiv(leftIconElement,
                leftIconDesktopStyle, { marginTop: d.desktop ? -8 : -4 });

        let rightIconElement: b.IBobrilNode | undefined;
        if (d.menuItems && !d.rightIcon)
            d.rightIcon = icons.menuRight();
        if (d.rightIcon)
            rightIconElement = b.styledDiv(d.rightIcon, { color: d.disabled ? styles.strDisabledColor : styles.strTextColor },
                rightIconDesktopStyle, { marginTop: d.desktop ? -8 : -4 });

        let secondaryTextElement;
        if (d.secondaryText) secondaryTextElement = b.styledDiv(d.secondaryText, secondaryTextStyle);

        let childMenuPopover;
        if (d.menuItems && ctx.open) {
            childMenuPopover = [b.withKey(ClickAwayListener({
                onClick: () => handleRequestClose(ctx)
            }), "c"),
            Popover({
                autoCloseWhenOffScreen: true,
                animation: d.animation,
                anchorOrigin: d.anchorOrigin || { horizontal: 'right', vertical: 'top' },
                anchorNode: ctx.me,
                open: ctx.open,
                targetOrigin: d.targetOrigin || { horizontal: 'left', vertical: 'top' },
                onRequestClose: () => handleRequestClose(ctx)
            },
                Menu({
                    desktop: d.desktop,
                    initiallyKeyboardFocused: ctx.focused,
                    onClose: () => {
                        handleRequestClose(ctx);
                        if (!d.preventCloseOnAction) ctx.owner.close();
                    },
                    style: nestedMenuStyle
                }, d.menuItems),
            )];
        }

        const indent = d.desktop ? 64 : 72;
        const sidePadding = d.desktop ? 24 : 16;

        me.children = ListItem({
            action: ctx.handleAction,
            primaryText: d.primaryText,
            disabled: d.disabled,
            innerDivStyle: [innerDivStyle, {
                paddingLeft: d.leftIcon || d.insetChildren || d.checked ? indent : sidePadding,
                paddingRight: d.rightIcon ? indent : sidePadding,
            }, d.innerDivStyle],
            insetChildren: d.insetChildren,
            leftIcon: leftIconElement,
            rightIcon: rightIconElement,
            focusFromKeyboard: ctx.focused,
            style: [rootStyle, {
                color: d.disabled ? styles.strDisabledColor : styles.strTextColor,
                cursor: d.disabled ? 'default' : 'pointer',
                minHeight: d.desktop ? 32 : 48,
                lineHeight: d.desktop ? '32px' : '48px',
                fontSize: d.desktop ? 15 : 16
            }, d.style]
        }, [d.children, secondaryTextElement, childMenuPopover]);
    }
});

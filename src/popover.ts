import * as b from 'bobril';
import * as s from './styles';
import * as paper from './paper';
import { PopoverAnimationDefault, IPopoverAnimationDefaultData } from './popoverAnimationDefault';
import { IPopoverOrigin } from './popoverOrigin';

interface IPosition {
    top: number;
    center: number;
    bottom: number;
    left: number;
    middle: number;
    right: number;
}

interface IPositionRect extends IPosition {
    width: number;
    height: number;
}

export interface IPopoverAnimationData {
    animation?: (data: Object) => b.IBobrilNode;
    children?: b.IBobrilChildren;
    targetOrigin?: IPopoverOrigin;
}

interface IPopoverAnimationCtx extends b.IBobrilCtx {
    data: IPopoverAnimationData;
    shouldRender: boolean;
}

export const PopoverAnimation = b.createComponent<IPopoverAnimationData>({
    init(ctx: IPopoverAnimationCtx) {
        ctx.shouldRender = false;
    },
    render(ctx: IPopoverAnimationCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        const animation = d.animation || PopoverAnimationDefault;
        me.children = animation({
            targetOrigin: d.targetOrigin,
            open: ctx.shouldRender,
            style: { position: 'sticky' },
            children: d.children
        });
    },
    postInitDom(ctx: IPopoverAnimationCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        if (!ctx.shouldRender) {
            ctx.shouldRender = true;
            b.invalidate(ctx);
        }
    }
});

export interface IPopoverData {
    anchorNode?: b.IBobrilCacheNode;
    anchorOrigin?: IPopoverOrigin;
    animated?: boolean;
    animation?: b.IComponentFactory<b.IBobrilComponent>;
    autoCloseWhenOffScreen?: boolean;
    children?: b.IBobrilChildren;
    onRequestClose?: (reason: string) => void;
    open?: boolean;
    style?: b.IBobrilStyles;
    targetOrigin?: IPopoverOrigin;
}

interface IPopoverCtx extends b.IBobrilCtx {
    data: IPopoverData;
    id: string;
}

function createPopover(ctx: IPopoverCtx): b.IBobrilChildren {
    const d = ctx.data;
    if (d.animated === false) {
        return paper.Paper({
            style: [{
                position: 'absolute',
            }, d.style]
        }, d.children);
    }

    return PopoverAnimation({
        animation: d.animation,
        targetOrigin: d.targetOrigin
    }, d.children);
};

function getAnchorPositionRect(node: b.IBobrilCacheNode): IPositionRect {
    const pos = b.nodePagePos(node);
    const el = <HTMLElement>node.element;
    const anchorRect = {
        left: pos[0],
        top: pos[1],
        width: el.offsetWidth,
        height: el.offsetHeight,
        right: undefined,
        bottom: undefined,
        middle: undefined,
        center: undefined
    };

    anchorRect.bottom = anchorRect.top + anchorRect.height;
    anchorRect.right = anchorRect.left + anchorRect.width;
    anchorRect.middle = anchorRect.left + ((anchorRect.right - anchorRect.left) / 2);
    anchorRect.center = anchorRect.top + ((anchorRect.bottom - anchorRect.top) / 2);

    return anchorRect;
}

function getTargetPosition(targetEl: HTMLElement): IPosition {
    return {
        top: 0,
        center: targetEl.offsetHeight / 2,
        bottom: targetEl.offsetHeight,
        left: 0,
        middle: targetEl.offsetWidth / 2,
        right: targetEl.offsetWidth,
    };
}

function requestClose(ctx: IPopoverCtx, reason: string) {
    const d = ctx.data;
    if (d.onRequestClose) {
        d.onRequestClose(reason);
    }
}

function autoCloseWhenOffScreen(ctx: IPopoverCtx, anchorPositionRect: IPositionRect) {
    const windowScroll = b.getWindowScroll();
    if (windowScroll[1] > anchorPositionRect.top + anchorPositionRect.height ||
        windowScroll[1] + window.innerHeight < anchorPositionRect.top ||
        windowScroll[0] > anchorPositionRect.left + anchorPositionRect.width ||
        windowScroll[0] + window.innerWidth < anchorPositionRect.left) {
        requestClose(ctx, 'offScreen');
    }
}

function setPlacement(ctx: IPopoverCtx, targetEl: HTMLElement, scrolling: boolean = false) {
    const d = ctx.data;
    if (!d.open || !d.anchorNode)
        return;

    const anchorRect = getAnchorPositionRect(d.anchorNode);
    let target = getTargetPosition(targetEl);

    let targetPosition: IPosition = {
        top: anchorRect[d.anchorOrigin.vertical] - target[d.targetOrigin.vertical],
        left: anchorRect[d.anchorOrigin.horizontal] - target[d.targetOrigin.horizontal],
        center: undefined,
        bottom: undefined,
        middle: undefined,
        right: undefined
    };

    if (scrolling && d.autoCloseWhenOffScreen)
        autoCloseWhenOffScreen(ctx, anchorRect);

    targetEl.style.top = `${Math.max(0, targetPosition.top)}px`;
    targetEl.style.left = `${Math.max(0, targetPosition.left)}px`;
    targetEl.style.maxHeight = `${window.innerHeight}px`;
    targetEl.style.position = 'absolute';
    targetEl.style.zIndex = s.zIndex.popover.toString();
};

export const Popover = b.createComponent<IPopoverData>({
    render(ctx: IPopoverCtx) {
        const d = ctx.data;
        if (d.open && !ctx.id)
            ctx.id = b.addRoot(() => createPopover(ctx));

        if (!d.open && ctx.id) {
            b.removeRoot(ctx.id);
            ctx.id = undefined;
        }
    },
    postInitDom(ctx: IPopoverCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        b.addOnScroll(() => {
            setPlacement(ctx, element, true);
        })
    },
    postUpdateDom(ctx: IPopoverCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
        const popover = b.getRoots()[ctx.id];
        if (popover && popover.c[0])
            setPlacement(ctx, <HTMLElement>popover.c[0].element);
    },
    destroy(ctx: IPopoverCtx) {
        if (ctx.id)
            b.removeRoot(ctx.id);
    }
});

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
    animation?: b.IComponentFactory<b.IBobrilComponent>;
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
        const animation: b.IComponentFactory<IPopoverAnimationDefaultData> = d.animation || PopoverAnimationDefault;
        me.children = animation({
            targetOrigin: d.targetOrigin,
            open: ctx.shouldRender,
            style: { position: 'sticky' }
        }, d.children);
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
    canAutoPosition?: boolean;
    children?: b.IBobrilChildren;
    onRequestClose?: (reason: string) => void;
    open?: boolean;
    style?: b.IBobrilStyles;
    targetOrigin?: IPopoverOrigin;
}

interface IPopoverCtx extends b.IBobrilCtx {
    data: IPopoverData;
    id: string;
    open: boolean;
    closing: boolean;
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

function getPositions(anchor: IPopoverOrigin, target: IPopoverOrigin) {
    const a = { ...anchor };
    const t = { ...target };

    const positions = {
        x: ['left', 'right'].filter((p) => p !== t.horizontal),
        y: ['top', 'bottom'].filter((p) => p !== t.vertical)
    };

    const overlap = {
        x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
        y: getOverlapMode(a.vertical, t.vertical, 'center')
    };

    positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
    positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

    if (overlap.y !== 'auto') {
        a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
        if (overlap.y === 'inclusive') {
            t.vertical = t.vertical;
        }
    }

    if (overlap.x !== 'auto') {
        a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
        if (overlap.y === 'inclusive') {
            t.horizontal = t.horizontal;
        }
    }

    return {
        positions: positions,
        anchorPos: a
    };
}

function getOverlapMode(anchor: string, target: string, median: string): string {
    if ([anchor, target].indexOf(median) >= 0) return 'auto';
    if (anchor === target) return 'inclusive';
    return 'exclusive';
}

function applyAutoPositionIfNeeded(anchor: IPosition, target: IPosition, targetOrigin: IPopoverOrigin,
    anchorOrigin: IPopoverOrigin, targetPosition: IPosition): IPosition {
    const { positions, anchorPos } = getPositions(anchorOrigin, targetOrigin);

    if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
        let newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
        if (newTop + target.bottom <= window.innerHeight) {
            targetPosition.top = Math.max(0, newTop);
        } else {
            newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
            if (newTop + target.bottom <= window.innerHeight) {
                targetPosition.top = Math.max(0, newTop);
            }
        }
    }

    if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
        let newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
        if (newLeft + target.right <= window.innerWidth) {
            targetPosition.left = Math.max(0, newLeft);
        } else {
            newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
            if (newLeft + target.right <= window.innerWidth) {
                targetPosition.left = Math.max(0, newLeft);
            }
        }
    }

    return targetPosition;
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

    if (d.canAutoPosition) {
        target = getTargetPosition(targetEl);
        targetPosition = applyAutoPositionIfNeeded(anchorRect, target, d.targetOrigin, d.anchorOrigin, targetPosition);
    }

    targetEl.style.top = `${Math.max(0, targetPosition.top)}px`;
    targetEl.style.left = `${Math.max(0, targetPosition.left)}px`;
    targetEl.style.maxHeight = `${window.innerHeight}px`;
    targetEl.style.position = 'absolute';
    targetEl.style.zIndex = s.zIndex.popover.toString();
};

export const Popover = b.createComponent<IPopoverData>({
    init(ctx: IPopoverCtx) {
        const d = ctx.data;
        //     static defaultProps = {
        //     canAutoPosition: true,
        //     style: {
        //         overflowY: 'auto',
        //     },
        //     zDepth: 1,
        // };

        ctx.open = false;
        ctx.closing = false;
    },
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

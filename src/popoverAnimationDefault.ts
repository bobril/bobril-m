import * as b from 'bobril';
import * as paper from './paper';
import * as transitions from './transitions';
import { IPopoverOrigin } from './popoverOrigin';

export interface IPopoverAnimationDefaultData {
    children?: b.IBobrilChildren;
    open?: boolean,
    style?: b.IBobrilStyles,
    targetOrigin?: IPopoverOrigin,
    zDepth?: number
}

interface IPopoverAnimationDefaultCtx extends b.IBobrilCtx {
    data: IPopoverAnimationDefaultData;
}

const rootStyle = b.styleDef({
    position: 'fixed',
    transition: transitions.easeOut('250ms', 'opacity') + ', ' + transitions.easeOut('250ms', 'transform'),
    maxHeight: '100%'
});

const horizontalStyle = b.styleDef({
    maxHeight: '100%',
    overflowY: 'auto',
    transition: transitions.easeOut('250ms', 'opacity') + ', ' + transitions.easeOut('250ms', 'transform')
});

const verticalStyle = b.styleDef({
    transition: transitions.easeOut('250ms', 'opacity') + ', ' + transitions.easeOut('250ms', 'transform')
});

export const PopoverAnimationDefault = b.createComponent<IPopoverAnimationDefaultData>({
    init(ctx: IPopoverAnimationDefaultCtx) {
    },
    render(ctx: IPopoverAnimationDefaultCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        const horizontal = d.targetOrigin.horizontal === 'middle' ? 'vertical' : d.targetOrigin.horizontal;
        me.children = paper.Paper({
            style: [
                rootStyle,
                {
                    opacity: d.open ? 1 : 0,
                    transform: d.open ? 'scale(1, 1)' : 'scale(0, 0)',
                    transformOrigin: horizontal + ' ' + d.targetOrigin.vertical
                },
                d.style
            ],
            zDepth: d.zDepth || 1
        }, b.styledDiv(b.styledDiv(d.children, [
            verticalStyle,
            {
                opacity: d.open ? 1 : 0,
                transform: d.open ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: horizontal + ' ' + d.targetOrigin.vertical
            }
        ]), [
                horizontalStyle,
                {
                    opacity: d.open ? 1 : 0,
                    transform: d.open ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: horizontal + ' ' + d.targetOrigin.vertical
                }
            ])
        );
    }
});

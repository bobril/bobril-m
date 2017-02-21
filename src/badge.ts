import * as b from "bobril";
import * as styles from "./styles";
import * as c from "./styleConsts";

export interface IBadgeData {
  children?: b.IBobrilChildren;
  badgeContent: b.IBobrilChildren;
  primary?: boolean;
  secondary?: boolean;
}

interface IBadgeCtx extends b.IBobrilCtx {
  data: IBadgeData;
}

const radius = 12;
const radius2x = Math.floor(2 * radius);

const rootStyle = b.styleDef([c.positionRelative, {
  display: 'inline-block',
  padding: [radius2x + 'px', radius2x + 'px', radius + 'px', radius + 'px'].join(' '),
}]);

const badgeStyle = b.styleDef([c.positionAbsolute, c.circle, {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  top: 0,
  right: 0,
  fontWeight: "medium",
  fontSize: radius,
  width: radius2x,
  height: radius2x,
  backgroundColor: styles.alternateTextColor,
  color: styles.textColor,
}]);

const primaryStyle = b.styleDefEx(badgeStyle, {
  backgroundColor: styles.accent1Color,
  color: styles.alternateTextColor
});

const secondaryStyle = b.styleDefEx(badgeStyle, {
  backgroundColor: styles.primary1Color,
  color: styles.alternateTextColor
});

export const Badge = b.createComponent<IBadgeData>({
  render(ctx: IBadgeCtx, me: b.IBobrilNode) {
    const d = ctx.data;
    b.style(me, rootStyle);
    me.children = [
      d.children,
      b.styledDiv(d.badgeContent, badgeStyle, d.primary && primaryStyle, d.secondary && secondaryStyle)
    ];
  }
});

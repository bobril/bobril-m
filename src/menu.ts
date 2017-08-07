import * as b from 'bobril';
import * as styles from "./styles";
import { List } from './list';

export interface IMenuData {
  autoWidth?: boolean;
  children?: b.IBobrilChildren;
  desktop?: boolean;
  initiallyKeyboardFocused?: boolean;
  maxHeight?: number;
  menuItemStyle?: b.IBobrilStyleDef;
  onEscKeyDown?: () => void,
  onKeyDown?: () => void,
  style?: b.IBobrilStyleDef,
  selectedValues?: b.IBobrilChildren,
  width?: number
}

interface IMenuCtx extends b.IBobrilCtx {
  data: IMenuData;
  focusIndex: number,
  isKeyboardFocused: boolean,
  keyWidth: number;
}

const rootStyle = b.styleDef({ zIndex: styles.zIndex.menu });

function decrementKeyboardFocusIndex(ctx: IMenuCtx) {
  let index = ctx.focusIndex;
  let lastValidIndex = ctx.focusIndex;
  const children = <b.IBobrilChildArray>ctx.data.children;

  do {
    index--;
    if (index < 0) index = 0;

    if (isValidChild(<b.IBobrilNode>children[index])) {
      lastValidIndex = index;
      break;
    }

  } while (index !== 0)

  setFocusIndex(ctx, lastValidIndex, true);
}

function handleKeyDown(ctx: IMenuCtx, event: b.IKeyDownUpEvent) {
  switch (event.which) {
    case 27:
      ctx.data.onEscKeyDown && ctx.data.onEscKeyDown();
      break;
    case 9:
      if (event.shift)
        decrementKeyboardFocusIndex(ctx);
      else
        incrementKeyboardFocusIndex(ctx);
      break;
    case 38:
      decrementKeyboardFocusIndex(ctx);
      break;
    case 40:
      incrementKeyboardFocusIndex(ctx);
      break;
  }
  if (ctx.data.onKeyDown) ctx.data.onKeyDown();
};

function incrementKeyboardFocusIndex(ctx: IMenuCtx) {
  let index = ctx.focusIndex;
  let lastValidIndex = ctx.focusIndex;
  const children = <b.IBobrilChildArray>ctx.data.children;

  do {
    index++;
    if (index > children.length - 1) index = children.length - 1;

    if (isValidChild(<b.IBobrilNode>children[index])) {
      lastValidIndex = index;
      break;
    }

  } while (index !== children.length - 1)

  setFocusIndex(ctx, lastValidIndex, true);
}

function isValidChild(child: b.IBobrilNode): boolean {
  return child.component.id !== 'Divider' && (child.data && !child.data.disabled);
}

function setFocusIndex(ctx: IMenuCtx, newIndex, isKeyboardFocused) {
  ctx.focusIndex = newIndex;
  ctx.isKeyboardFocused = isKeyboardFocused;
  b.invalidate(ctx);
}

function setScrollPosition() {
  const desktop = this.props.desktop;
  const focusedMenuItem = this.refs.focusedMenuItem;
  const menuItemHeight = desktop ? 32 : 48;

  // if (focusedMenuItem) {
  //   const selectedOffSet = ReactDOM.findDOMNode(focusedMenuItem).offsetTop;

  //   // Make the focused item be the 2nd item in the list the user sees
  //   let scrollTop = selectedOffSet - menuItemHeight;
  //   if (scrollTop < menuItemHeight) scrollTop = 0;

  //   ReactDOM.findDOMNode(this.refs.scrollContainer).scrollTop = scrollTop;
  // }
}

function cancelScrollEvent(event) {//type???
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function handleOnWheel(event) {//type???
  const scrollContainer = this.refs.scrollContainer;
  // Only scroll lock if the the Menu is scrollable.
  if (scrollContainer.scrollHeight <= scrollContainer.clientHeight) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  const wheelDelta = event.deltaY;
  const isDeltaPositive = wheelDelta > 0;

  if (isDeltaPositive && wheelDelta > scrollHeight - clientHeight - scrollTop) {
    scrollContainer.scrollTop = scrollHeight;
    return cancelScrollEvent(event);
  } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
    scrollContainer.scrollTop = 0;
    return cancelScrollEvent(event);
  }
}

function setScollPosition() {
  // const desktop = this.props.desktop;
  // const focusedMenuItem = this.refs.focusedMenuItem;
  // const menuItemHeight = desktop ? 32 : 48;

  // if (focusedMenuItem) {
  //   const selectedOffSet = ReactDOM.findDOMNode(focusedMenuItem).offsetTop;

  //   // Make the focused item be the 2nd item in the list the user sees
  //   let scrollTop = selectedOffSet - menuItemHeight;
  //   if (scrollTop < menuItemHeight) scrollTop = 0;

  //   ReactDOM.findDOMNode(this.refs.scrollContainer).scrollTop = scrollTop;
  // }
}

function setWidth(ctx: IMenuCtx, element: HTMLElement) {
  const elWidth = element.offsetWidth;
  const keyWidth = ctx.keyWidth;
  const minWidth = keyWidth * 1.5;
  let keyIncrements = elWidth / keyWidth;
  let newWidth;

  keyIncrements = keyIncrements <= 1.5 ? 1.5 : Math.ceil(keyIncrements);
  newWidth = keyIncrements * keyWidth;

  if (newWidth < minWidth) newWidth = minWidth;

  element.style.width = `${newWidth}px`;
}

export const Menu = b.createComponent<IMenuData>({
  init(ctx: IMenuCtx) {
    const d = ctx.data;

    ctx.focusIndex = 0;
    ctx.isKeyboardFocused = d.initiallyKeyboardFocused;
    ctx.keyWidth = d.desktop ? 64 : 56;
  },
  render(ctx: IMenuCtx, me: b.IBobrilNode) {
    const d = ctx.data;

    me.children = b.styledDiv(List({}, d.children), [rootStyle, {
      maxHeight: d.maxHeight,
      overflowY: d.maxHeight ? 'auto' : undefined,
    }, d.style]);
  },
  postRender(ctx: IMenuCtx, me: b.IBobrilNode, oldMe?: b.IBobrilCacheNode) {
    if (ctx.isKeyboardFocused) {
      const c = oldMe && (<any>oldMe.children[0]).children[0].children[ctx.focusIndex].children[0];
      b.focus(c);//TODO fuj
    }
  },
  postInitDom(ctx: IMenuCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
    if (ctx.data.autoWidth !== false) setWidth(ctx, element);

    b.addOnScroll(handleOnWheel);

    setScollPosition();
  },
  postUpdateDom(ctx: IMenuCtx, me: b.IBobrilCacheNode, element: HTMLElement) {
    if (ctx.data.autoWidth !== false) setWidth(ctx, element);
  },
  onPointerUp(ctx: IMenuCtx, ev: b.IBobrilPointerEvent): boolean {
    ctx.isKeyboardFocused = false;
    return true;
  },
  onKeyDown(ctx: IMenuCtx, event: b.IKeyDownUpEvent): boolean {
    handleKeyDown(ctx, event);

    return true;
  }
});

import * as b from 'bobril';
import * as styles from './styles';

export interface ISubheaderData {
    children?: b.IBobrilChildren;
    inset?: boolean;
}

let subheaderStyle = {
    boxSizing: 'border-box',
    color: styles.subheaderColor,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '48px',
    width: '100%'
};

export const Subheader = (data: ISubheaderData) => {
    return b.styledDiv(data.children, subheaderStyle, { paddingLeft: data.inset ? 72 : 16 });
}

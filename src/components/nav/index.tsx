import * as React from 'react';
import styled from 'styled-components';
import { AppStore } from '../../store';

interface NavProps {
    className?: string;
    store: AppStore;
    children: /*React.ReactElement<any>*/ any[];
}

const Ul = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: flex-end;
`;

export class Nav extends React.PureComponent<NavProps> {
    render() {
        const { className, children, store } = this.props;

        return (
            <nav className={className}>
                <Ul>
                    {children.map((child, key) => React.cloneElement(child, { ...child.props, store, key }))}
                </Ul>
            </nav>
        );
    }
}

interface NavItemProps {
    href: string;
    store?: AppStore;
}

const A = styled.a`
    display: block;
    padding: 8px 12px;
`;

export class NavItem extends React.PureComponent<NavItemProps> {
    render() {
        const { href, children } = this.props;

        return (
            <li>
                <A href={href} onClick={this.onClick}>
                    {children}
                </A>
            </li>
        );
    }

    private onClick = e => {
        const { store, href } = this.props;

        if (store) {
            e.preventDefault();

            store.navigate(href);
        }
    };
}

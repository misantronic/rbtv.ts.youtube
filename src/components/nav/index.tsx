import * as React from 'react';
import styled from 'styled-components';

interface NavProps {
    className?: string;
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
        const { className, children } = this.props;

        return (
            <nav className={className}>
                <Ul>
                    {children}
                </Ul>
            </nav>
        );
    }
}

interface NavItemProps {
    href: string;
    active?: boolean;
    onClick(href: string): void;
}

const A = styled.a`
    display: block;
    padding: 8px 12px;

    background-color: ${(props: NavItemProps) => (props.active ? '#eee' : 'transparent')};
`;

export class NavItem extends React.PureComponent<NavItemProps> {
    render() {
        const { href, children, active = false } = this.props;

        return (
            <li>
                <A href={href} active={active} onClick={this.onClick}>
                    {children}
                </A>
            </li>
        );
    }

    private onClick = e => {
        e.preventDefault();
        
        const { href, onClick } = this.props;
        
        onClick(href);
    };
}

import * as React from 'react';
import styled from 'styled-components';

interface NavProps {
    className?: string;
    children: /*React.ReactElement<any>*/ any[];
}

const StyledNav = styled.nav`
    display: flex;
`;

const Ul = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: flex-end;
`;

export class Nav extends React.PureComponent<NavProps> {
    public render() {
        const { className, children } = this.props;

        return (
            <StyledNav className={className}>
                <Ul>
                    {children}
                </Ul>
            </StyledNav>
        );
    }
}

interface NavItemProps {
    href: string;
    active?: boolean;
    onClick(href: string): void;
}

const A = styled.a`
    display: flex;
    padding: 0 12px;
    height: 100%;
    align-items: center;

    background-color: ${(props: NavItemProps) => (props.active ? '#eee' : 'transparent')};
`;

export class NavItem extends React.PureComponent<NavItemProps> {
    public render() {
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
    }
}

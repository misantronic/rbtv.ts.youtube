import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { AppStore } from '../../store';
import { Nav, NavItem } from '../../components/nav';

const NavWrapper = styled.div`margin-bottom: 20px;`;

interface MainNavProps {
    store: AppStore;
}

@observer
export class MainNav extends React.PureComponent<MainNavProps> {
    render() {
        const { store } = this.props;

        return (
            <NavWrapper>
                <Nav>
                    <NavItem href="/" active={store.route === '/activities'} onClick={this.onNavItemClick}>
                        Home
                    </NavItem>
                    <NavItem href="/playlists" active={store.route === '/playlists'} onClick={this.onNavItemClick}>
                        Playlists
                    </NavItem>
                </Nav>
            </NavWrapper>
        );
    }

    private onNavItemClick = (href: string) => this.props.store.navigate(href);
}

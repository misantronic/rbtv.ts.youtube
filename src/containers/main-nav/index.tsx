import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { External, Inject } from 'tsdi';
import { AppStore } from '../../store';
import { Nav, NavItem } from '../../components/nav';

const NavWrapper = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const Logo = styled.div`
    background: url(https://www.rocketbeans.tv/wp-content/themes/rocket-beans/images/logo.png) no-repeat 0 0;
    background-size: contain;
    width: 40px;
    height: 40px;
    flex: 1;
    cursor: pointer;
`;

@observer
@External()
export class MainNav extends React.Component {
    @Inject() private appStore: AppStore;

    render() {
        return (
            <NavWrapper>
                <Logo onClick={() => this.onNavItemClick('/')} />
                <Nav>
                    <NavItem
                        href="/"
                        active={this.appStore.isRouteActivities || this.appStore.isRouteVideo}
                        onClick={this.onNavItemClick}
                    >
                        Home
                    </NavItem>
                    <NavItem href="/playlists" active={this.appStore.isRoutePlaylists} onClick={this.onNavItemClick}>
                        Playlists
                    </NavItem>
                </Nav>
            </NavWrapper>
        );
    }

    private onNavItemClick = (href: string) => this.appStore.navigate(href);
}

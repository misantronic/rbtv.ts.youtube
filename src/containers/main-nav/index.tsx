import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { External, Inject } from 'tsdi';
import { AppStore } from '../../store';
import { Nav, NavItem } from '../../components/nav';

const NavWrapper = styled.div`margin-bottom: 20px;`;

interface MainNavProps {}

@observer
@External()
export class MainNav extends React.Component<MainNavProps> {
    @Inject() private appStore: AppStore;
    
    render() {
        return (
            <NavWrapper>
                <Nav>
                    <NavItem href="/" active={this.appStore.isRouteActivities || this.appStore.isRouteVideo} onClick={this.onNavItemClick}>
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

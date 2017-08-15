import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { external, Inject, Initialize as constructor } from 'tsdi';
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
@external
export class MainNav extends React.Component {
    @Inject private appStore: AppStore;

    @constructor
    init() {
        this.appStore.loadLiveId();
    }

    render() {
        const { isRouteActivities, isRouteVideo, isRoutePlaylists, isRouteLive } = this.appStore;

        return (
            <NavWrapper>
                <Logo onClick={this.onLogoClick} />
                <Nav>
                    <NavItem href="/" active={isRouteActivities || isRouteVideo} onClick={this.onNavItemClick}>
                        Home
                    </NavItem>
                    <NavItem href="/playlists" active={isRoutePlaylists} onClick={this.onNavItemClick}>
                        Playlists
                    </NavItem>
                    <NavItem href={`/video/${this.appStore.liveId}`} active={isRouteLive} onClick={this.onNavItemClick}>
                        Live
                    </NavItem>
                </Nav>
            </NavWrapper>
        );
    }

    private onNavItemClick = (href: string) => this.appStore.navigate(href);

    private onLogoClick = () => this.onNavItemClick('/activities');
}

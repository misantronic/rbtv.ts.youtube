import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { external as canInject, inject, initialize as constructor } from 'tsdi';
import { AppStore } from '../../store';
import { Nav, NavItem } from '../../components/nav';

const NavWrapper = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const LogoWrapper = styled.div`
    flex: 1;
`;

const Logo = styled.div`
    background: url(https://www.rocketbeans.tv/wp-content/themes/rocket-beans/images/logo.png) no-repeat 0 0;
    background-size: contain;
    width: 40px;
    height: 40px;
    cursor: pointer;
`;

@observer
@canInject
export class MainNav extends React.Component {
    @inject private appStore: AppStore;

    @constructor
    public init() {
        this.appStore.loadLiveId();
    }

    public render() {
        const { isRouteActivities, isRouteVideo, isRoutePlaylists, isRouteLive, isRouteTimetable } = this.appStore;

        return (
            <NavWrapper>
                <LogoWrapper>
                    <Logo onClick={this.onLogoClick} />
                </LogoWrapper>
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
                    <NavItem href={`/timetable`} active={isRouteTimetable} onClick={this.onNavItemClick}>
                        Wochenplan
                    </NavItem>
                </Nav>
            </NavWrapper>
        );
    }

    private onNavItemClick = (href: string) => this.appStore.navigate(href);

    private onLogoClick = () => this.onNavItemClick('/activities');
}

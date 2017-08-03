import * as React from 'react';
import { render } from 'react-dom';
import { AppStore } from './store';
import styled from 'styled-components';
import { Router } from './components/router';
import { Nav, NavItem } from './components/nav';

const App = styled.div`
    font-family: Raleway, Arial, sans-serif;
    font-size: 14px;
    width: 1074px;
    max-width: 100%;
    margin: 25px auto;
    padding: 0 25px;
    box-sizing: border-box;

    * {
        box-sizing: border-box;
    }

    input {
        font-family: Raleway, Arial, sans-serif;
        font-size: 14px;
    }

    a,
    a:link {
        color: #337ab7;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const NavWrapper = styled.div`margin-bottom: 20px;`;

const store = new AppStore();

const onNavItemClick = (href: string) => store.navigate(href);

function main() {
    render(
        <App>
            <NavWrapper>
                <Nav>
                    <NavItem href="/" onClick={onNavItemClick}>
                        Home
                    </NavItem>
                    <NavItem href="/playlists" onClick={onNavItemClick}>
                        Playlists
                    </NavItem>
                </Nav>
            </NavWrapper>
            <Router store={store} />
        </App>,
        document.getElementById('app')
    );
}

(window as any).onGoogleClientLoad = main;

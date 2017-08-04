import * as React from 'react';
import { render } from 'react-dom';
import { TSDI } from 'tsdi';
import styled from 'styled-components';
import { AppStore } from './store';
import { Router } from './components/router';
import { MainNav } from './containers/main-nav';

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

function main() {
    const tsdi = new TSDI();

    tsdi.enableComponentScanner();
    tsdi.get(AppStore);

    render(
        <App>
            <MainNav />
            <Router />
        </App>,
        document.getElementById('app')
    );
}

(window as any).onGoogleClientLoad = main;

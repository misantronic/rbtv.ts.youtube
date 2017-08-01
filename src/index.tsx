import * as React from 'react';
import { render } from 'react-dom';
import { Router } from './router';
import { AppStore } from './store';
import styled from 'styled-components';

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

const store = new AppStore();

function main() {
    render(
        <App>
            <Router store={store} />
        </App>,
        document.getElementById('app')
    );
}

(window as any).onGoogleClientLoad = main;

import * as React from 'react';
import { render } from 'react-dom';
import { Router } from './router';
import { AppStore } from './store';
import styled from 'styled-components';

const App = styled.div`
    background: #fcfcfc;
    font-family: Raleway, Arial, sans-serif;
    font-size: 14px;
    width: 1024px;
    max-width: 100%;
    margin: 25px auto;

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
            <Router appStore={store} />
        </App>,
        document.getElementById('app')
    );
}

(window as any).onGoogleClientLoad = main;

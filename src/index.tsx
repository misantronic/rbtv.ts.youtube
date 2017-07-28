import * as React from 'react';
import { render } from 'react-dom';
import { Activities } from './containers/activities';
import styled from 'styled-components';

const App = styled.div`
    background: #fcfcfc;
    font-family: Raleway,Arial,sans-serif;
    font-size: 14px;
    width: 1024px;
    max-width: 100%;
    margin: 0 auto;

    * {
        box-sizing: border-box;
    }

    a, a:link {
        color: #337ab7;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

render(
    <App>
        <Activities />
    </App>,
    document.getElementById('app')
);

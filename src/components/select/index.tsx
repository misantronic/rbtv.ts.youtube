import * as ReactSelect from 'react-select';
import styled from 'styled-components';

import 'react-select/dist/react-select.css';

export const Select = styled(ReactSelect)`
    flex: 0 0 160px;

    &:focus {
        outline: none;
    }

    > .Select-control {
        border-radius: 0;
    }

    &.is-focused:not(.is-open) > .Select-control {
        box-shadow: none;
        border-color: #d9d9d9;
    }
`

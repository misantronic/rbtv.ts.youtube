import styled from 'styled-components';

const baseStyle = `
    margin: 10px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

export const H1 = styled.h1`
    ${baseStyle}
    font-size: 26px;
    font-weight: 500;
    line-height: 1.1;
`

export const H2 = styled.h2`
`

export const H3 = styled.h3`
    ${baseStyle}
    font-size: 17px;
    font-weight: 500;
    line-height: 1.1;
`

export const H4 = styled.h4`
`

export const H5 = styled.h5`
`

export const H6 = styled.h6`
`

H1.displayName = 'H1';
H2.displayName = 'H2';
H3.displayName = 'H3';
H4.displayName = 'H4';
H5.displayName = 'H5';
H6.displayName = 'H6';

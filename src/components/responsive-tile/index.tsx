import styled from 'styled-components';

export const ResponsiveTile = styled.div`
    margin: 0 25px 25px 0;

    @media (max-width: 599px) {
        width: 100%;
        margin-right: 0;
    }

    @media (min-width: 600px) and (max-width: 1023px) {
        width: calc(50% - 17px);

        &:nth-child(2n + 2) {
            margin-right: 0;
        }
    }

    @media (min-width: 1024px) {
        width: calc(33.3% - 17px);

        &:nth-child(3n + 3) {
            margin-right: 0;
        }
    }
`;

ResponsiveTile.displayName = 'ResponsiveTile';

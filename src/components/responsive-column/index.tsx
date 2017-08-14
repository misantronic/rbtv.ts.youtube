import * as React from 'react';
import styled, { css } from 'styled-components';

type sizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ColumnProps {
    sm?: sizes;
    md?: sizes;
    lg?: sizes;
    className?: string;
}

const calcSizes = (props: ColumnProps) => {
    const sm = props.sm || props.md || props.lg || 12;
    const md = props.md || sm;
    const lg = props.lg || md;

    return css`
        padding: 0 10px;
        margin-bottom: 20px;

        @media (max-width: 599px) {
            width: ${100 / 12 * sm}%;
        }

        @media (min-width: 600px) AND (max-width: 1199px) {
            width: ${100 / 12 * md}%;
        }

        @media (min-width: 1200px) {
            width: ${100 / 12 * lg}%;
        }
    `;
};

const Col = styled.div`${calcSizes};`;

export class Column extends React.PureComponent<ColumnProps> {
    render() {
        const { children, className, sm, md, lg } = this.props;

        return (
            <Col sm={sm} md={md} lg={lg} className={className}>
                {children}
            </Col>
        );
    }
}

export const ColumnContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
`;

ColumnContainer.displayName = 'ColumnContainer';

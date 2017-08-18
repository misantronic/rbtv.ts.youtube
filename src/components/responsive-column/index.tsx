import * as React from 'react';
import { external as canInject, inject } from 'tsdi';
import styled, { css } from 'styled-components';
import { Responsive } from '../../utils/responsive';

type sizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ColumnProps {
    sm?: sizes;
    md?: sizes;
    lg?: sizes;
    className?: string;
}

@canInject
export class Column extends React.PureComponent<ColumnProps> {
    @inject private sizes: Responsive;

    public render() {
        const { children, className, sm, md, lg } = this.props;
        const Col = styled.div`${this.calcSizes};`;

        return (
            <Col sm={sm} md={md} lg={lg} className={className}>
                {children}
            </Col>
        );
    }

    private calcSizes = (props: ColumnProps) => {
        const { sizeSm, sizeMd, sizeLg } = this.sizes;

        const sm = props.sm || props.md || props.lg || 12;
        const md = props.md || sm;
        const lg = props.lg || md;

        return css`
            padding: 0 10px;
            margin-bottom: 20px;
    
            @media (max-width: ${sizeSm.max}px) {
                width: ${100 / 12 * sm}%;
            }
    
            @media (min-width: ${sizeMd.min}px) AND (max-width: ${sizeMd.max}px) {
                width: ${100 / 12 * md}%;
            }
    
            @media (min-width: ${sizeLg.min}px) {
                width: ${100 / 12 * lg}%;
            }
        `;
    }
}

export const ColumnContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
`;

ColumnContainer.displayName = 'ColumnContainer';

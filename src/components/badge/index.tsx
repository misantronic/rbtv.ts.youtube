import * as React from 'react';
import styled from 'styled-components';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

const Span = styled.span`
    background-color: #777;
    display: inline;
    padding: .2em .6em .2em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
`;

export class Badge extends React.PureComponent<BadgeProps> {
    render(): JSX.Element {
        const { children, className } = this.props;

        return (
            <Span className={className}>
                {children}
            </Span>
        );
    }
}

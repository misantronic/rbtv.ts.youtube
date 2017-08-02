import * as React from 'react';
import styled from 'styled-components';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    onClick?(): void;
}

const noop = () => {};

const Span = styled.span`
    display: inline-block;
    padding: .2em .6em .2em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;

    cursor: ${(props: BadgeProps) => (props.onClick === noop ? 'default' : 'pointer')};
    background-color: ${(props: BadgeProps) => (props.onClick === noop ? '#777' : '#AAA')};

    &:hover {
        background-color: #777;
    }
`;

export class Badge extends React.PureComponent<BadgeProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                {children}
            </Span>
        );
    }
}

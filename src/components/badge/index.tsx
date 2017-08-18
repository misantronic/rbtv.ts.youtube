import * as React from 'react';
import styled from 'styled-components';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    onClick?(e: React.SyntheticEvent<HTMLSpanElement>): void;
}

const noop = () => {};

const Span = styled.span`
    display: inline-flex;
    padding: 0 .6em 0;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
    height: 20px;
    align-items: center;

    cursor: ${(props: BadgeProps) => (props.onClick === noop ? 'default' : 'pointer')};
    background-color: ${(props: BadgeProps) => (props.onClick === noop ? '#777' : '#AAA')};

    &:hover {
        background-color: #777;
    }
`;

export class Badge extends React.PureComponent<BadgeProps> {
    public render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                {children}
            </Span>
        );
    }
}

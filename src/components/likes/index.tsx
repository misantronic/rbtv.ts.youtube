import * as React from 'react';
import styled from 'styled-components';
import { NumberFormat } from '../number-format';

const noop = () => {};

interface LikesProps {
    children: number;
    className?: string;
    active?: boolean;
    onClick?(): void;
}

const Span = styled.span`
    cursor: ${(props: any) => (props.onClick === noop ? 'default' : 'pointer')};
`;

const LikeIcon = styled.span`
    font-size: 150%;
    opacity: ${(props: { active: boolean }) => props.active ? 1 : 0.4};

    &:before {
        font-family: 'entypo', sans-serif;
        content: "\\1f44d";
    }

    &:hover {
        ${(props: any) => (props.onClick === noop ? '' : 'opacity: 1;')}
    }
`;

const DislikeIcon = styled.span`
    font-size: 150%;
    opacity: ${(props: { active: boolean }) => props.active ? 1 : 0.4};
    position: relative;
    top: 5px;

    &:before {
        font-family: 'entypo', sans-serif;
        content: "\\1f44e";
    }

    &:hover {
        ${(props: any) => (props.onClick === noop ? '' : 'opacity: 1;')}
    }
`;

export class Likes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, active = false, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <LikeIcon active={active} />&nbsp;&nbsp;<NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

export class Dislikes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, active = false, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <DislikeIcon active={active} /> <NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

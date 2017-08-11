import * as React from 'react';
import styled from 'styled-components';
import { NumberFormat } from '../number-format';

const noop = () => {};

interface LikesProps {
    children: number;
    className?: string;
    onClick?(): void;
}

const Span = styled.span`cursor: ${(props: any) => (props.onClick === noop ? 'default' : 'pointer')};`;

const LikeIcon = styled.span`
    font-size: 150%;

    &:before {
        font-family: 'entypo', sans-serif;
        content: "\\1f44d";
    }
`;

const DislikeIcon = styled.span`
    font-size: 150%;
    position: relative;
    top: 5px;

    &:before {
        font-family: 'entypo', sans-serif;
        content: "\\1f44e";
    }
`;

export class Likes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <LikeIcon /> <NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

export class Dislikes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <DislikeIcon /> <NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

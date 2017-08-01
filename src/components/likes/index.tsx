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

const Icon = styled.span`font-size: 150%;`;

const DislikeIcon = styled(Icon)`
    position: relative;
    top: 5px;
`;

export class Likes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <Icon>👍</Icon> <NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

export class Dislikes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <DislikeIcon>👎</DislikeIcon> <NumberFormat>{children}</NumberFormat>
            </Span>
        );
    }
}

import * as React from 'react';
import styled from 'styled-components';

const noop = () => {};

interface LikesProps {
    className?: string;
    onClick?(): void;
}

const Span = styled.span`cursor: ${(props: LikesProps) => (props.onClick === noop ? 'default' : 'pointer')};`;

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
                <Icon>👍</Icon> {children}
            </Span>
        );
    }
}

export class Dislikes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        const { children, className, onClick = noop } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <DislikeIcon>👎</DislikeIcon> {children}
            </Span>
        );
    }
}

import * as React from 'react';
import styled from 'styled-components';
import { NumberFormat } from '../number-format';

type Type = 'like' | 'dislike';

interface LikesProps {
    children: number;
    className?: string;
    active?: boolean;
    onClick?(): void;
}

interface IconTextProps extends LikesProps {
    type: Type;
}

const Span = styled.span`
    cursor: ${(props: any) => (props.onClick ? 'pointer' : 'default')};
    user-select: none;
`;

const Icon = styled.span`
    font-size: 150%;
    opacity: ${(props: { active: boolean; type: Type }) => (props.active ? 1 : 0.4)};

    &[type="dislike"] {
        position: relative;
        top: 5px;
    }

    &:before {
        font-family: 'entypo', sans-serif;
        content: "${(props: { active: boolean; type: Type }) => (props.type === 'like' ? '👍' : '👎')}";
    }

    &:hover {
        ${(props: any) => (props.onClick ? 'opacity: 1;' : '')};
    }
`;

class IconText extends React.PureComponent<IconTextProps> {
    render(): JSX.Element {
        const { children, className, type, active = false, onClick } = this.props;

        return (
            <Span className={className} onClick={onClick}>
                <Icon active={active} type={type} />&nbsp;&nbsp;{children === undefined
                    ? null
                    : <NumberFormat>
                          {children}
                      </NumberFormat>}
            </Span>
        );
    }
}

export class Likes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        return <IconText {...this.props} type="like" />;
    }
}

export class Dislikes extends React.PureComponent<LikesProps> {
    render(): JSX.Element {
        return <IconText {...this.props} type="dislike" />;
    }
}

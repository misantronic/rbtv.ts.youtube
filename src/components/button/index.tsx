import * as React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
    className?: string;
    gradient?: boolean;
    onClick(): void;
}

const gradient = css`
    background-image: linear-gradient(90deg, #ff217c 0, #ff9186);
    background-repeat: repeat-x;
`;

const StyledButton = styled.button`
    color: #fff;
    border: none;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    ${(props: ButtonProps) => (props.gradient ? gradient : '')} &:focus {
        outline: none;
    }
`;

export class Button extends React.PureComponent<ButtonProps> {
    public render(): JSX.Element {
        const { children, className, gradient, onClick } = this.props;

        return (
            <StyledButton className={className} onClick={onClick} gradient={gradient}>
                {children}
            </StyledButton>
        );
    }
}

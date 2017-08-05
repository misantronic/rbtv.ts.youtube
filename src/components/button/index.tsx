import * as React from 'react';
import styled from 'styled-components';

interface ButtonProps {
    className?: string;
    onClick(): void;
}

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
    background-image: -webkit-linear-gradient(left,color-stop(#ff217c 0),color-stop(#ff9186 100%));
    background-image: linear-gradient(90deg,#ff217c 0,#ff9186);
    background-repeat: repeat-x;

    &:focus {
        outline: none;
    }
`;

export class Button extends React.PureComponent<ButtonProps> {
    render(): JSX.Element {
        const { children, className, onClick } = this.props;

        return (
            <StyledButton className={className} onClick={onClick}>
                {children}
            </StyledButton>
        );
    }
}

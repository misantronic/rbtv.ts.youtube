import * as React from 'react';
import styled from 'styled-components';

interface CaptionTitleProps {
    children: string;
    onClick(): void;
}

const H3 = styled.h3`
    display: flex;
    margin: 5px 0 6px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    padding-right: 5px;
    margin-top: 10px;
    font-size: 17px;
    height: 20px;
    font-weight: 500;
    line-height: 1.1;
`;

const Link = styled.a`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export class CaptionTitle extends React.Component<CaptionTitleProps> {
    render(): JSX.Element {
        const { children } = this.props;

        return (
            <H3>
                <Link href="#" title={children} onClick={this.onClick}>
                    {children}
                </Link>
            </H3>
        );
    }

    onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    }
}

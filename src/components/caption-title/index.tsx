import * as React from 'react';
import styled from 'styled-components';
import { H3 } from '../headline';

interface CaptionTitleProps {
    children: string;
    onClick(): void;
}

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
    };
}

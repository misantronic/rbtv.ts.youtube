import * as React from 'react';
import styled from 'styled-components';
import { H3 } from '../headline';

interface CaptionTitleProps {
    children: string;
    href: string;
    onClick(): void;
}

const Link = styled.a`
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export class CaptionTitle extends React.Component<CaptionTitleProps> {
    public render(): JSX.Element {
        const { children, href } = this.props;

        return (
            <H3>
                <Link href={href} title={children} onClick={this.onClick}>
                    {children}
                </Link>
            </H3>
        );
    }

    public onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    };
}

import * as React from 'react';
import { external as canInject, inject } from 'tsdi';
import styled from 'styled-components';
import { Responsive } from '../../utils/responsive';

interface CaptionImageProps {
    image: string;
    href: string;
    load?: boolean;
    onClick(): void;
}

const Div = styled.div`position: relative;`;

@canInject
export class CaptionImage extends React.PureComponent<CaptionImageProps> {
    @inject private sizes: Responsive;

    public render(): JSX.Element {
        const { image, load, href, children } = this.props;

        const Link = styled.a`
            display: block;
            overflow: hidden;

            background-position: center center;
            background-color: #eee;
            background-repeat: no-repeat;
            background-size: cover;
            width: 100%;
            height: 180px;
            ${load ? `background-image: url('${image}');` : ''} @media (max-width: ${this.sizes.sizeSm.max}px) {
                height: 250px;
            }
        `;

        return (
            <Div>
                <Link href={href} onClick={this.onClick} />
                {children}
            </Div>
        );
    }

    public onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    };
}

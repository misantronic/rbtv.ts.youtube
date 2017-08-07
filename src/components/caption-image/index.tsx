import * as React from 'react';
import styled from 'styled-components';

interface CaptionImageProps {
    image: string;
    onClick(): void;
}

const Div = styled.div`
    position: relative;
`;

const Link = styled.a`
    display: block;
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    margin: -34px 0 -38px;
    min-height: 246px;
`

export class CaptionImage extends React.PureComponent<CaptionImageProps> {
    render(): JSX.Element {
        const { image, children} = this.props; 

        return (
            <Div>
                <Link href="#" onClick={this.onClick}>
                    <Image src={image} alt="" />
                </Link>
                {children}
            </Div>
        );
    }

    onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    }
}

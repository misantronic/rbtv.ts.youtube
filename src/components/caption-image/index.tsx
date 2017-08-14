import * as React from 'react';
import styled from 'styled-components';

interface CaptionImageProps {
    image: string;
    margin?: string;
    onClick(): void;
}

const Div = styled.div`position: relative;`;

const Link = styled.a`
    display: block;
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    margin: ${(props: { margin: string | undefined }) => props.margin || '-34px 0 -38px'};
    min-height: 199px;
`;

export class CaptionImage extends React.PureComponent<CaptionImageProps> {
    render(): JSX.Element {
        const { image, children, margin } = this.props;

        return (
            <Div>
                <Link href="#" onClick={this.onClick}>
                    <Image src={image} margin={margin} />
                </Link>
                {children}
            </Div>
        );
    }

    onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    };
}

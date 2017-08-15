import * as React from 'react';
import styled from 'styled-components';
import { sizeMd } from '../../utils/responsive';

interface CaptionImageProps {
    image: string;
    load?: boolean;
    onClick(): void;
}

const Div = styled.div`position: relative;`;

const Link = styled.a`
    display: block;
    overflow: hidden;

    background-position: center center;
    background-color: #EEE;
    background-repeat: no-repeat;
    background-size: 100% 250px;
    width: 100%;
    height: 180px;

    @media (max-width: ${sizeMd.max}px) {
        height: 250px;
        background-size: auto 250px;
    }
`;

export class CaptionImage extends React.PureComponent<CaptionImageProps> {
    render(): JSX.Element {
        const { image, load, children } = this.props;

        const style: any = {};

        if (load) {
            style.backgroundImage = `url('${image}')`;
        }

        return (
            <Div>
                <Link href="#" onClick={this.onClick} style={style} />
                {children}
            </Div>
        );
    }

    onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    };
}

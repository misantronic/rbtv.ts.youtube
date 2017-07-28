import * as React from 'react';
import * as moment from 'moment'
import styled from 'styled-components';
import { Badge } from '../badge';
import { DateFormat } from '../date-format';
import { humanizeDuration } from '../../utils/time';

interface CaptionImageProps {
    image: string;
    publishedAt: Date;
    duration?: string;
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
    max-width: 100%;
    margin: -34px 0 -38px;
    height: 237px;
`

const DurationBadge = styled(Badge)`
    position: absolute;
    left: 10px;
    bottom: 10px;
`

const DateBadge = styled(Badge)`
    position: absolute;
    right: 10px;
    bottom: 10px;
`;

export class CaptionImage extends React.PureComponent<CaptionImageProps> {
    render(): JSX.Element {
        const { image, publishedAt } = this.props; 
        const duration = moment.duration(this.props.duration);

        return (
            <Div>
                <Link href="#" onClick={this.onClick}>
                    <Image src={image} alt="" />
                </Link>
                <DurationBadge>
                    {humanizeDuration(duration)}
                </DurationBadge>
                <DateBadge>
                    <DateFormat>
                        {publishedAt}
                    </DateFormat>
                </DateBadge>
            </Div>
        );
    }

    onClick = (e: any) => {
        e.preventDefault();
        this.props.onClick();
    }
}

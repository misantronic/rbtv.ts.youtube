import * as React from 'react';
import styled from 'styled-components';
import { Badge } from '../badge';
import { DateFormat } from '../date-format';

interface CaptionImageProps {
    image: string;
    href: string;
    publishedAt: Date;
    duration?: string;
}

const StyledDiv = styled.div`
    position: relative;
`;

const StyledLink = styled.a`
    display: block;
    overflow: hidden;
`;

const StyledImage = styled.img`
    max-width: 100%;
    margin: -35px 0 -39px;
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
        const { image, href, publishedAt, duration } = this.props;

        return (
            <StyledDiv>
                <StyledLink href={href}>
                    <StyledImage src={image} alt="" />
                </StyledLink>
                <DurationBadge>
                    {duration}
                </DurationBadge>
                <DateBadge>
                    <DateFormat>
                        {publishedAt}
                    </DateFormat>
                </DateBadge>
            </StyledDiv>
        );
    }
}

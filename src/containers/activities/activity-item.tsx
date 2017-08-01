import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';

interface ActivityItemProps {
    publishedAt: Date;
    duration?: string;
    image: string;
    title: string;
    description: string;
    className?: string;
    onClick(): void;
}

const StyledDiv = styled.div`
    margin-bottom: 20px;
`;

export class ActivityItem extends React.Component<ActivityItemProps> {
    render(): JSX.Element {
        const { title, description, className, duration, image, publishedAt, onClick } = this.props;

        return (
            <StyledDiv className={className}>
                <CaptionImage image={image} duration={duration} publishedAt={publishedAt} onClick={onClick} />
                <CaptionTitle onClick={onClick}>
                    {title}
                </CaptionTitle>
                <Caption lineClamp={3}>
                    {description}
                </Caption>
            </StyledDiv>
        );
    }
}

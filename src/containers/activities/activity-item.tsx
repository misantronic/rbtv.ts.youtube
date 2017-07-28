import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';

interface ActivityItemProps {
    id: string;
    publishedAt: Date;
    duration?: string;
    image: string;
    title: string;
    description: string;
    className?: string;
}

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

export class ActivityItem extends React.Component<ActivityItemProps> {
    render(): JSX.Element {
        const { title, description, id, className, duration, image, publishedAt } = this.props;
        const href = `/video/${id}`;

        return (
            <StyledDiv className={className}>
                <CaptionImage image={image} href={href} duration={duration} publishedAt={publishedAt} />
                <CaptionTitle href={href}>
                    {title}
                </CaptionTitle>
                <Caption>
                    {description}
                </Caption>
            </StyledDiv>
        );
    }
}

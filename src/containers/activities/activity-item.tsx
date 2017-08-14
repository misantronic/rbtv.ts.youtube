import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';
import { Badge } from '../../components/badge';
import { DateFormat } from '../../components/date-format';
import { humanizeDuration } from '../../utils/time';

interface ActivityItemProps {
    publishedAt: Date;
    duration?: string;
    image: string;
    imageMargin?: string;
    title: string;
    description: string;
    className?: string;
    tags?: string[];
    onClick(): void;
    onClickTag(tag: string): void;
}

const BeansContainer = styled.div`height: 20px;`;

const BeanBadge = styled(Badge)`
    margin-right: 8px;

    &:last-child {
        margin-right: 0;
    }
`;

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

export class ActivityItem extends React.Component<ActivityItemProps> {
    render(): JSX.Element {
        const {
            title,
            description,
            className,
            image,
            imageMargin,
            publishedAt,
            duration,
            tags = [],
            onClick,
            onClickTag
        } = this.props;

        return (
            <div className={className}>
                <CaptionImage image={image} margin={imageMargin} onClick={onClick}>
                    <DurationBadge>
                        {humanizeDuration(duration)}
                    </DurationBadge>
                    <DateBadge>
                        <DateFormat>
                            {publishedAt}
                        </DateFormat>
                    </DateBadge>
                </CaptionImage>
                <CaptionTitle onClick={onClick}>
                    {title}
                </CaptionTitle>
                <Caption lineClamp={3}>
                    {description}
                </Caption>
                <BeansContainer>
                    {tags.map(tag =>
                        <BeanBadge key={tag} onClick={() => onClickTag(tag)}>
                            {tag}
                        </BeanBadge>
                    )}
                </BeansContainer>
            </div>
        );
    }
}

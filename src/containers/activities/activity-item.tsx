import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';
import { Badge } from '../../components/badge';

interface ActivityItemProps {
    publishedAt: Date;
    duration?: string;
    image: string;
    title: string;
    description: string;
    className?: string;
    tags?: string[];
    onClick(): void;
    onClickTag?(tag: string): void;
}

const StyledDiv = styled.div`margin-bottom: 20px;`;

const BeansContainer = styled.div`height: 20px;`;

const BeanBadge = styled(Badge)`
    margin-right: 8px;

    &:last-child {
        margin-right: 0;
    }
`;

export class ActivityItem extends React.Component<ActivityItemProps> {
    render(): JSX.Element {
        const {
            title,
            description,
            className,
            duration,
            image,
            publishedAt,
            tags = [],
            onClick,
            onClickTag
        } = this.props;

        return (
            <StyledDiv className={className}>
                <CaptionImage image={image} duration={duration} publishedAt={publishedAt} onClick={onClick} />
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
            </StyledDiv>
        );
    }
}

import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';
import { Badge } from '../../components/badge';
import { lazyLoading } from '../../components/hoc/lazy-loading';

interface PlaylistItemProps {
    id: string;
    image: string;
    title: string;
    description: string;
    className?: string;
    count: number;
    lazyLoad?: boolean;
    onClick(id: string): void;
}

const NumBadge = styled(Badge)`
    position: absolute;
    right: 10px;
    bottom: 10px;
`;

@lazyLoading
export class PlaylistItem extends React.PureComponent<PlaylistItemProps> {
    render(): JSX.Element {
        const { title, description, className, image, count, lazyLoad } = this.props;

        return (
            <div className={className}>
                <CaptionImage image={image} load={lazyLoad} onClick={this.onClick}>
                    <NumBadge>
                        {count}
                    </NumBadge>
                </CaptionImage>
                <CaptionTitle onClick={this.onClick}>
                    {title}
                </CaptionTitle>
                <Caption lineClamp={3}>
                    {description}
                </Caption>
            </div>
        );
    }

    private onClick = () => {
        const { id, onClick } = this.props;

        onClick(id);
    };
}

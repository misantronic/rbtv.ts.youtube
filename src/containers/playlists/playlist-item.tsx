import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';
import { Badge } from '../../components/badge';

interface PlaylistItemProps {
    id: string;
    image: string;
    title: string;
    description: string;
    className?: string;
    count: number;
    onClick(id: string): void;
}

interface PlaylistItemState {
    loadImage: boolean;
}

const NumBadge = styled(Badge)`
    position: absolute;
    right: 10px;
    bottom: 10px;
`;

export class PlaylistItem extends React.PureComponent<PlaylistItemProps, PlaylistItemState> {
    el: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            loadImage: false
        };
    }
    
    componentDidMount() {
        document.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.onScroll);
    }

    render(): JSX.Element {
        const { title, description, className, image, count } = this.props;
        const { loadImage } = this.state;

        return (
            <div className={className} ref={this.onEl}>
                <CaptionImage image={image} load={loadImage} onClick={this.onClick}>
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

    private checkScrolling(): void {
        if (this.el && this.el.offsetTop <= scrollY + innerHeight * 2) {
            this.setState({ loadImage: true });
        }
    }

    private onEl = (el: HTMLDivElement) => {
        this.el = el;

        this.checkScrolling();
    };

    private onScroll = () => {
        this.checkScrolling();
    }

    private onClick = () => {
        const { id, onClick } = this.props;

        onClick(id);
    };
}

import * as React from 'react';
import styled from 'styled-components';
import { CaptionTitle } from '../../components/caption-title';
import { Caption } from '../../components/caption';
import { CaptionImage } from '../../components/caption-image';
import { Badge } from '../../components/badge';
import { DateFormat } from '../../components/date-format';
import { humanizeDuration } from '../../utils/time';

interface ActivityItemProps {
    id: string;
    publishedAt: Date;
    duration?: string;
    image: string;
    title: string;
    description: string;
    className?: string;
    tags?: string[];
    onClick(id: string): void;
    onClickTag(tag: string): void;
}

interface ActivityItemState {
    loadImage: boolean;
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
`;

const DateBadge = styled(Badge)`
    position: absolute;
    right: 10px;
    bottom: 10px;
`;

export class ActivityItem extends React.PureComponent<ActivityItemProps, ActivityItemState> {
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
        const { title, description, className, image, publishedAt, duration, tags = [] } = this.props;
        const { loadImage } = this.state;

        return (
            <div className={className} ref={this.onEl}>
                <CaptionImage load={loadImage} image={image} onClick={this.onClick}>
                    <DurationBadge>
                        {humanizeDuration(duration)}
                    </DurationBadge>
                    <DateBadge>
                        <DateFormat>
                            {publishedAt}
                        </DateFormat>
                    </DateBadge>
                </CaptionImage>
                <CaptionTitle onClick={this.onClick}>
                    {title}
                </CaptionTitle>
                <Caption lineClamp={3}>
                    {description}
                </Caption>
                <BeansContainer>
                    {tags.map(tag =>
                        <BeanBadge key={tag} onClick={this.onClickTag}>
                            {tag}
                        </BeanBadge>
                    )}
                </BeansContainer>
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

    private onClickTag = (e: React.SyntheticEvent<HTMLSpanElement>) => {
        const tag = e.currentTarget.textContent;

        if (tag) {
            this.props.onClickTag(tag);
        }
    };
}

import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { VideoStore } from './store';
import { VideoPlayer } from '../../components/video-player';
import { H1, H3 } from '../../components/headline';
import { Caption } from '../../components/caption';
import { DateFormat } from '../../components/date-format';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Likes, Dislikes } from '../../components/likes';
import { NumberFormat } from '../../components/number-format';
import { RelatedItem } from './related-item';

const store = new VideoStore();

interface VideoProps {
    id: string;
}

const StyledVideoPlayer = styled(VideoPlayer)`
    margin-bottom: 30px;
`;

const VideoInfos = styled(ColumnContainer)`
    margin-bottom: 15px;
`;

const ViewsColumn = styled(Column)`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    white-space: nowrap;
`;

const StyledLikes = styled(Likes)`
    margin-right: 15px;
`;

const RelatedItems = styled.div`padding: 0 0 10px;`;

@observer
export class Video extends React.Component<VideoProps> {
    componentDidMount() {
        store.id = this.props.id;
    }

    componentWillUnmount() {
        store.reset();
    }

    render(): JSX.Element | null {
        const { video } = store;

        if (!video) {
            return null;
        }

        return (
            <div>
                <StyledVideoPlayer id={video.id} />
                <H1>
                    {video.snippet.title}
                </H1>
                <ColumnContainer>
                    <Column sm={12} md={8}>
                        <VideoInfos>
                            <Column sm={7}>
                                <H3>
                                    <span>Published at </span>
                                    <DateFormat format="YYYY-MM-DD HH:mm">
                                        {video.snippet.publishedAt}
                                    </DateFormat>
                                </H3>
                            </Column>
                            <ViewsColumn sm={5}>
                                <H3>
                                    <NumberFormat>
                                        {video.statistics.viewCount}
                                    </NumberFormat>
                                    <span> views</span>
                                </H3>
                                <div>
                                    <StyledLikes>
                                        {video.statistics.likeCount}
                                    </StyledLikes>
                                    <Dislikes>
                                        {video.statistics.dislikeCount}
                                    </Dislikes>
                                </div>
                            </ViewsColumn>
                        </VideoInfos>
                        <Caption parseLinks>
                            {video.snippet.description}
                        </Caption>
                    </Column>
                    <Column sm={12} md={4}>
                        {this.renderRelated()}
                    </Column>
                </ColumnContainer>
            </div>
        );
    }

    private renderRelated(): JSX.Element {
        const { related } = store;

        return (
            <RelatedItems>
                <H3>Related</H3>

                {related.map(item => {
                    const { thumbnails, title } = item.snippet;

                    return (
                        <RelatedItem key={item.id} videoId={item.id} image={thumbnails.default.url}>
                            {title}
                        </RelatedItem>
                    );
                })}
            </RelatedItems>
        );
    }
}

export default Video;

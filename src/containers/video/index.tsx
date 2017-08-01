import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { AppStore } from '../../store';
import { VideoStore } from './store';
import { VideoPlayer } from '../../components/video-player';
import { H1, H3 } from '../../components/headline';
import { Caption } from '../../components/caption';
import { DateFormat } from '../../components/date-format';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Likes, Dislikes } from '../../components/likes';
import { NumberFormat } from '../../components/number-format';

interface VideoProps {
    appStore: AppStore;
    id: string;
}

interface VideoState {
    store: VideoStore;
}

const StyledVideoPlayer = styled(VideoPlayer)`
    margin-bottom: 30px;
`;

const ViewsColumn = styled(Column)`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
`;

const StyledLikes = styled(Likes)`
    margin-right: 15px;
`;

@observer
export class Video extends React.Component<VideoProps, VideoState> {
    constructor(props) {
        super(props);

        this.state = {
            store: new VideoStore()
        };
    }

    componentDidMount() {
        this.state.store.id = this.props.id;
    }

    componentWillUnmount() {
        this.state.store.resetVideo();
    }

    render(): JSX.Element | null {
        const { video } = this.state.store;

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
                        <ColumnContainer>
                            <Column sm={6}>
                                <H3>
                                    <span>Published at </span>
                                    <DateFormat format="LL">
                                        {video.snippet.publishedAt}
                                    </DateFormat>
                                </H3>
                            </Column>
                            <ViewsColumn sm={6}>
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
                        </ColumnContainer>
                        <Caption>
                            {video.snippet.description}
                        </Caption>
                    </Column>
                    <Column sm={12} md={4}>
                        Text
                    </Column>
                </ColumnContainer>
            </div>
        );
    }
}

export default Video;

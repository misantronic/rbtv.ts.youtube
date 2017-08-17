import * as React from 'react';
import { observer } from 'mobx-react';
import { external, inject } from 'tsdi';
import styled from 'styled-components';
import { AppStore } from '../../store';
import { YoutubeStore, YoutubeRating } from '../../youtube-store';
import { VideoStore } from './store';
import { RepliesStore } from './replies-store';
import { VideoPlayer } from '../../components/video-player';
import { H1, H3 } from '../../components/headline';
import { Caption } from '../../components/caption';
import { DateFormat } from '../../components/date-format';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Likes, Dislikes } from '../../components/likes';
import { NumberFormat } from '../../components/number-format';
import { Spinner } from '../../components/spinner';
import { RelatedItem } from './related-item';
import { CommentItem } from './comment-item';
import { Chat } from './chat';
import { sizeApp } from '../../utils/responsive';

const store = new VideoStore();
const repliesStore = new RepliesStore();

interface VideoProps {
    id: string;
}

interface VideoState {
    hideComments: boolean;
    rating: YoutubeRating;
    seekTo?: number;
}

const StyledVideoPlayer = styled(VideoPlayer)`
    margin-bottom: 30px;

    @media (max-width: ${sizeApp.max}px) {
        width: auto !important;
        margin: 0 -20px 30px;
    }
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

const CommentsHeader = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const ShowReplies = styled.div`
    margin: -10px 0 25px 50px;
    padding: 3px;
    font-size: 11px;
    text-align: center;
    background: #eee;
    cursor: pointer;
`;

const Replies = styled.div`margin: 0 0 30px 50px;`;

@external
@observer
export class Video extends React.Component<VideoProps, VideoState> {
    @inject private appStore: AppStore;
    @inject private youtubeStore: YoutubeStore;

    constructor(props) {
        super(props);

        this.state = {
            hideComments: false,
            rating: 'none',
            seekTo: undefined
        };
    }

    componentDidMount() {
        store.id = this.props.id;

        this.loadRating();
    }

    componentWillUnmount() {
        store.reset();
    }

    render(): JSX.Element | null {
        const { video } = store;

        if (!video) {
            return null;
        }

        const { rating, seekTo } = this.state;
        const { publishedAt, description, title } = video.snippet;
        const { likeCount, dislikeCount, viewCount } = video.statistics;

        return (
            <div>
                <StyledVideoPlayer seekTo={seekTo} id={video.id} />
                <H1>
                    {title}
                </H1>
                <ColumnContainer>
                    <Column sm={12} md={8}>
                        <ColumnContainer>
                            <Column sm={7}>
                                <H3>
                                    <span>Published at </span>
                                    <DateFormat format="YYYY-MM-DD HH:mm">
                                        {publishedAt}
                                    </DateFormat>
                                </H3>
                            </Column>
                            <ViewsColumn sm={5}>
                                <H3>
                                    <NumberFormat>
                                        {viewCount}
                                    </NumberFormat>
                                    <span> views</span>
                                </H3>
                                <div>
                                    <StyledLikes active={rating === 'like'} onClick={this.onClickLike}>
                                        {likeCount || 0}
                                    </StyledLikes>
                                    <Dislikes active={rating === 'dislike'} onClick={this.onClickDislike}>
                                        {dislikeCount || 0}
                                    </Dislikes>
                                </div>
                            </ViewsColumn>
                        </ColumnContainer>
                        <Caption parseLinks>
                            {description}
                        </Caption>
                    </Column>
                    <Column sm={12} md={4}>
                        {!this.isLive && this.renderRelated()}
                        {this.isLive && <Chat id={video.id} />}
                    </Column>
                </ColumnContainer>
                {!this.isLive && this.renderComments()}
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

    private renderComments(): JSX.Element {
        const { commentThread } = store;
        const { hideComments } = this.state;

        return (
            <div>
                <hr />
                <CommentsHeader>
                    <H3>Comments</H3>
                    <a href="#" onClick={this.onClickHideComments}>
                        {hideComments ? 'Show' : 'Hide'} comments
                    </a>
                </CommentsHeader>
                {!hideComments &&
                    commentThread.map(item =>
                        this.renderComment(item.snippet.topLevelComment, item.snippet.totalReplyCount)
                    )}
            </div>
        );
    }

    private renderComment(item: youtube.Comment, replyCount = 0) {
        const {
            publishedAt,
            authorProfileImageUrl,
            authorDisplayName,
            authorChannelUrl,
            likeCount,
            textDisplay
        } = item.snippet;

        const { parentId, commentLoading, comments } = repliesStore;

        return [
            <CommentItem
                key={item.id}
                id={item.id}
                date={publishedAt}
                authorImage={authorProfileImageUrl}
                author={authorDisplayName}
                authorUrl={authorChannelUrl}
                likes={likeCount}
                onSeek={this.onClickCommentSeek}
            >
                {textDisplay}
            </CommentItem>,
            replyCount
                ? <ShowReplies key="btn-replies" id={item.id} onClick={this.onClickShowReplies}>
                      {parentId === item.id ? 'Hide' : 'Show'} {replyCount} {replyCount > 1 ? 'replies' : 'reply'}
                  </ShowReplies>
                : null,
            replyCount && parentId === item.id
                ? <Replies key="replies">
                      {commentLoading && <Spinner />}
                      {!commentLoading && comments.map(comment => this.renderComment(comment))}
                  </Replies>
                : null
        ];
    }

    private async loadRating() {
        try {
            const rating = await this.youtubeStore.getRating(store.id, false);

            this.setState({ rating });
        } catch (e) {}
    }

    private get isLive(): boolean {
        return !!store.video && this.appStore.liveId === store.video.id;
    }

    private onClickShowReplies = (e: React.SyntheticEvent<HTMLDivElement>) => {
        const parentId = e.currentTarget.id;

        if (parentId === repliesStore.parentId) {
            repliesStore.reset();
        } else {
            repliesStore.loadReplies(parentId);
        }
    };

    private onClickHideComments = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        this.setState({ hideComments: !this.state.hideComments });
    };

    private onClickLike = async () => {
        const { rating } = this.state;
        const newRating: YoutubeRating = rating === 'like' ? 'none' : 'like';

        await this.youtubeStore.addRating(newRating, store.id);
        this.setState({ rating: newRating });
    };

    private onClickDislike = async () => {
        const { rating } = this.state;
        const newRating: YoutubeRating = rating === 'dislike' ? 'none' : 'dislike';

        await this.youtubeStore.addRating(newRating, store.id);
        this.setState({ rating: newRating });
    };

    private onClickCommentSeek = (seekTo: number) => this.setState({ seekTo });
}

export default Video;

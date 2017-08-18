import { observable, reaction, computed } from 'mobx';
import { external as canInject, inject, initialize as constructor } from 'tsdi';
import { fetchUtil } from '../../utils/ajax';
import { channel } from '../../utils/channels';
import { parseActivities, rejectLiveItems, parseVideo, parseCommentThread } from '../../utils/api';
import { AppStore } from '../../store';

@canInject
export class VideoStore { 
    @observable public id: string | null;
    @observable public video: youtube.VideoItem | null;
    @observable public videoLoading = false;
    @observable public relatedLoading = false;
    @observable public related: youtube.ActivitiyItem[] = [];
    @observable public commentThreadLoading = false;
    @observable public commentThread: youtube.CommentThread[] = [];
    @observable public nextPageToken = '';
    @observable public showBtnToTop = false;
    
    @inject private appStore: AppStore;

    @constructor
    public init() {
        // when id changes...
        reaction(
            () => this.id,
            id => {
                if (id) {
                    (async () => {
                        await this.loadVideo();
                        this.loadRelated();
                        if (!this.isLive) {
                            this.loadCommentThread();
                        }
                    })();
                }
            }
        );

        // route is current and the search-params changed...
        reaction(
            () =>
                this.appStore.route.startsWith('/video') &&
                this.appStore.params.id &&
                this.appStore.params.id !== this.id,
            paramsChanged => {
                const { id } = this.appStore.params;

                if (paramsChanged && id) {
                    this.id = id;
                }
            }
        );
    }

    @computed
    public get isLive(): boolean {
        return !!this.video && this.appStore.liveId === this.video.id;
    }

    public async loadCommentThread(nextPageToken = '') {
        this.commentThreadLoading = true;

        try {
            const commentThreadObj = await fetchUtil.get('/api/commentThreads', {
                videoId: this.id,
                pageToken: nextPageToken
            });

            if (commentThreadObj.items && commentThreadObj.items.length) {
                const items: youtube.CommentThread[] = parseCommentThread(commentThreadObj.items);

                this.commentThread = nextPageToken ? this.concat(items) : items;
            }

            this.nextPageToken = commentThreadObj.items.length ? commentThreadObj.nextPageToken : undefined;
        } catch (e) {
            console.log(e);
        } finally {
            this.commentThreadLoading = false;
        }
    }

    public reset(): void {
        this.id = null;
        this.video = null;
        this.videoLoading = false;
        this.related = [];
        this.relatedLoading = false;
        this.showBtnToTop = false;
    }

    private async loadVideo() {
        this.videoLoading = true;

        try {
            const items: youtube.VideoItem[] = await fetchUtil.get('/api/videos', {
                id: this.id
            });

            if (items && items.length) {
                this.video = parseVideo(items[0]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.videoLoading = false;
        }
    }

    private async loadRelated() {
        this.relatedLoading = true;

        try {
            const channelId = (this.video && this.video.snippet.channelId) || channel.RBTV;

            const relatedObj = await fetchUtil.get('/api/related', {
                channelId,
                relatedToVideoId: this.id,
                pageToken: ''
            });

            if (relatedObj.items && relatedObj.items.length) {
                const items: youtube.ActivitiyItem[] = parseActivities(rejectLiveItems(relatedObj.items));

                this.related = items;
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.relatedLoading = false;
        }
    }

    private concat(items: youtube.CommentThread[]) {
        return this.commentThread.concat(items.filter(item => !this.commentThread.find(item2 => item2.id === item.id)));
    }
}

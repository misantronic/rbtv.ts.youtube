import { observable, reaction } from 'mobx';
import { external, inject, initialize as constructor } from 'tsdi';
import { fetchUtil } from '../../utils/ajax';
import { channel } from '../../utils/channels';
import { parseActivities, rejectLiveItems, parseVideo, parseCommentThread } from '../../utils/api';
import { AppStore } from '../../store';

@external
export class VideoStore {
    @inject private appStore: AppStore;

    @observable id: string | null;
    @observable video: youtube.VideoItem | null;
    @observable videoIsLoading = false;
    @observable relatedIsLoading = false;
    @observable related: youtube.ActivitiyItem[] = [];
    @observable commentThreadIsLoading = false;
    @observable commentThread: youtube.CommentThread[] = [];

    @constructor
    init() {
        // when id changes...
        reaction(
            () => this.id,
            id => {
                if (id) {
                    (async () => {
                        await this.loadVideo();
                        this.loadRelated();
                        this.loadCommentThread();
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

    private async loadVideo() {
        this.videoIsLoading = true;

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
            this.videoIsLoading = false;
        }
    }

    public reset(): void {
        this.id = null;
        this.video = null;
        this.videoIsLoading = false;
        this.related = [];
        this.relatedIsLoading = false;
    }

    private async loadRelated() {
        this.relatedIsLoading = true;

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
            this.relatedIsLoading = false;
        }
    }

    private async loadCommentThread() {
        this.commentThreadIsLoading = true;

        try {
            const commentThreadObj = await fetchUtil.get('/api/commentThreads', {
                videoId: this.id,
                pageToken: ''
            });

            if (commentThreadObj.items && commentThreadObj.items.length) {
                const items: youtube.CommentThread[] = parseCommentThread(commentThreadObj.items);

                this.commentThread = items;

                console.log(this.commentThread);                
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.commentThreadIsLoading = false;
        }
    }
}

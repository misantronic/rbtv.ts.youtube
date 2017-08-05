import { observable, reaction } from 'mobx';
import { channel } from '../../utils/channels';
import { beans } from '../../utils/beans';
import { fetchUtil } from '../../utils/ajax';

export class ActivitiesStore {
    @observable channelId?: channel;
    @observable q = '';
    @observable fetchedQ = 'initial_dummy_value';
    @observable nextPageToken = '';
    @observable items: youtube.ActivitiyItem[] = [];
    @observable isLoading = false;
    @observable showLoader = false;
    @observable error?: ErrorEvent;

    static parseActivities(items: youtube.ActivitiyItem[]): youtube.ActivitiyItem[] {
        return items.map((item: youtube.ActivitiyItem) => {
            item.snippet = Object.assign({}, item.snippet, {
                publishedAt: new Date(item.snippet.publishedAt)
            });

            if (typeof item.id === 'object') {
                item.id = (item.id as any).videoId;
            } else {
                item.id = item.contentDetails.upload.videoId;
            }

            if (!item.contentDetails) {
                item.contentDetails = {
                    upload: {
                        videoId: item.id
                    }
                };
            }

            return item;
        });
    }

    constructor(channel?: channel) {
        if (channel) {
            this.channelId = channel;
        }

        reaction(
            () => this.channelId && !this.q && this.fetchedQ !== this.q,
            requireReload => {
                if (requireReload) {
                    this.loadActivities();
                }
            },
            {
                fireImmediately: true
            }
        );

        reaction(
            () => this.channelId,
            () => {
                if (this.channelId) {
                    if (this.q) {
                        this.search();
                    } else {
                        this.loadActivities();
                    }
                }
            }
        );
    }

    public async loadActivities(nextPageToken: string = '') {
        if (!nextPageToken) {
            this.showLoader = true;
        }
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/activities', {
                q: '',
                channelId: this.channelId,
                pageToken: nextPageToken
            });

            this.fetchedQ = '';
            this.processResponse(response, nextPageToken);
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
            this.showLoader = false;
        }
    }

    public async search(nextPageToken: string = '') {
        if (!nextPageToken) {
            this.showLoader = true;
        }
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/search', {
                q: this.q,
                channelId: this.channelId,
                pageToken: nextPageToken
            });

            this.fetchedQ = this.q;
            this.processResponse(response, nextPageToken);
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
            this.showLoader = false;
        }
    }

    public reset(): void {
        this.channelId = undefined;
        this.q = '';
        this.fetchedQ = 'initial_dummy_value';
        this.nextPageToken = '';
        this.items = [];
        this.isLoading = false;
        this.showLoader = false;
        this.error = undefined;
    }

    private processResponse(response, nextPageToken = '') {
        const items = ActivitiesStore.parseActivities(response.items);

        this.items = nextPageToken ? this.items.concat(items) : items;
        this.nextPageToken = items.length ? response.nextPageToken : undefined;

        this.loadVideos(items.map(item => item.id));
    }

    private async loadVideos(videos: string[]) {
        const videoItems = await fetchUtil.get('/api/videos', {
            id: videos.join(',')
        });

        this.items = this.items.map((item: youtube.ActivitiyItem) => {
            const videoItem: youtube.VideoItem = videoItems.find(videoItem => videoItem.id === item.id);

            if (videoItem) {
                item.duration = videoItem.contentDetails.duration;
                item.tags = videoItem.snippet.tags
                    ? beans
                          .filter(bean =>
                              videoItem.snippet.tags.find(
                                  tag => bean.title.toLowerCase() === tag.split(' ')[0].toLowerCase()
                              )
                          )
                          .map(bean => bean.title)
                    : [];
            }

            return item;
        });
    }
}

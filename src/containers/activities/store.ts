import { observable, reaction } from 'mobx';
import { channel } from '../../utils/channels';
import { beans } from '../../utils/beans';
import { fetchUtil } from '../../utils/ajax';

export class ActivitiesStore {
    @observable channelId: channel;
    @observable q = '';
    @observable pageToken = '';
    @observable items: youtube.ActivitiyItem[] = [];
    @observable isLoading = false;
    @observable error: ErrorEvent;

    constructor(channel?: channel) {
        if (channel) {
            this.channelId = channel;
        }

        reaction(() => this.q, this.reload, { fireImmediately: true });
        reaction(() => this.channelId, this.reload);
    }

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

    public async loadActivities() {
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/activities', {
                q: '',
                channelId: this.channelId,
                pageToken: ''
            });

            const items = ActivitiesStore.parseActivities(response.items);

            this.pageToken = response.nextPageToken;
            this.items = items;

            this.loadVideos(items.map(item => item.id));
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
        }
    }

    public async search() {
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/search', {
                q: this.q,
                channelId: this.channelId,
                pageToken: ''
            });

            const items = ActivitiesStore.parseActivities(response.items);

            this.pageToken = response.nextPageToken;
            this.items = items;

            this.loadVideos(items.map(item => item.id));
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
        }
    }

    private async loadVideos(videos: string[]) {
        const videoItems = await fetchUtil.get('/api/videos', {
            id: videos.join(',')
        });

        this.items = this.items.map((item: youtube.ActivitiyItem) => {
            const videoItem: youtube.VideoItem = videoItems.find(videoItem => videoItem.id === item.id);

            if (videoItem) {
                item.duration = videoItem.contentDetails.duration;
                item.tags = beans
                    .filter(bean => videoItem.snippet.tags.find(tag => bean.title.toLowerCase() === tag.split(' ')[0].toLowerCase()))
                    .map(bean => bean.title);
            }

            return item;
        });
    }

    private reload = () => {
        if (this.channelId && !this.q) {
            this.loadActivities();
        }
    };
}

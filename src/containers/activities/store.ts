import { observable, reaction } from 'mobx';
import * as debounce from 'lodash/debounce';
import { channel } from '../../utils/channels';
import { fetchUtil } from '../../utils/ajax';

interface Thumbnail {
    width: number;
    height: number;
    url: string;
}

export interface ActivitiyItem {
    contentDetails: {
        upload: {
            videoId: string;
        };
    };
    etag: string;
    id: string;
    kind: 'youtube#activity' | 'youtube#searchResult';
    snippet: {
        channelId: channel;
        channelTitle: string;
        description: string;
        publishedAt: Date;
        thumbnails: {
            default: Thumbnail;
            high: Thumbnail;
            maxres: Thumbnail;
            medium: Thumbnail;
            standard: Thumbnail;
        };
        title: string;
        type: 'upload';
    };
    duration?: string;
}

export class ActivitiesStore {
    @observable channelId: channel;
    @observable q = '';
    @observable pageToken = '';
    @observable items: ActivitiyItem[] = [];
    @observable isLoading = false;

    constructor(channel?: channel) {
        if (channel) {
            this.channelId = channel;
        }

        reaction(() => this.q, this.reload, { fireImmediately: true });
        reaction(() => this.channelId, this.reload);
    }

    static parseActivities(items: ActivitiyItem[]): ActivitiyItem[] {
        return items.map((item: ActivitiyItem) => {
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

        const response = await fetchUtil.get('/api/activities', {
            q: '',
            channelId: this.channelId,
            pageToken: ''
        });

        const items = ActivitiesStore.parseActivities(response.items);

        this.pageToken = response.nextPageToken;
        this.items = items;
        this.isLoading = false;

        this.loadVideos(items.map(item => item.id));
    }

    public async search() {
        this.isLoading = true;

        const response = await fetchUtil.get('/api/search', {
            q: this.q,
            channelId: this.channelId,
            pageToken: ''
        });

        const items = ActivitiesStore.parseActivities(response.items);

        this.pageToken = response.nextPageToken;
        this.items = items;
        this.isLoading = false;

        this.loadVideos(items.map(item => item.id));
    }

    private async loadVideos(videos: string[]) {
        const videoItems = await fetchUtil.get('/api/videos', {
            id: videos.join(',')
        });

        this.items = this.items.map((item: ActivitiyItem) => {
            const videoItem = videoItems.find(videoItem => videoItem.id === item.id);

            if (videoItem) {
                item.duration = videoItem.contentDetails.duration;
            }

            return item;
        });
    }

    private reload = () => {
        if (this.q) {
            this.searchDebounced();
        } else if (this.channelId) {
            this.loadActivities();
        }
    };

    private searchDebounced = debounce(() => this.search(), 200);
}

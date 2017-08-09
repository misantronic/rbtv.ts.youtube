import { observable, reaction } from 'mobx';
import { external, inject, initialize } from 'tsdi';
import { channel } from '../../utils/channels';
import { beans } from '../../utils/beans';
import { fetchUtil } from '../../utils/ajax';
import { setStorage, getStorage } from '../../utils/storage';
import { AppStore } from '../../store';

@external()
export class ActivitiesStore {
    @inject() private appStore: AppStore;

    @observable channelId?: channel = (getStorage('search.channelId') as channel) || channel.RBTV;
    @observable typedQ = '';
    @observable fetchedQ = 'initial_dummy_value';
    @observable nextPageToken = '';
    @observable items: youtube.ActivitiyItem[] = [];
    @observable isLoading = false;
    @observable hideItemsWhenLoading = true;
    @observable showBtnToTop = false;
    @observable error?: ErrorEvent;

    @initialize
    init() {
        this.typedQ = this.getDefaultTypedQ();

        if (this.typedQ) {
            this.search();
        }

        reaction(
            () => this.channelId && !this.typedQ && this.fetchedQ !== this.typedQ,
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
                    if (this.typedQ) {
                        this.search();
                    } else {
                        this.loadActivities();
                    }
                }

                setStorage('search.channelId', this.channelId);
            }
        );

        reaction(() => this.fetchedQ, () => setStorage('search.value', this.fetchedQ));
    }

    public async loadActivities(nextPageToken: string = '') {
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/activities', {
                q: '',
                channelId: this.channelId,
                pageToken: nextPageToken
            });

            this.fetchedQ = '';
            this.processResponse(response, nextPageToken);

            this.appStore.navigate(`/activities`, true);
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
            this.hideItemsWhenLoading = true;
        }
    }

    public async search(nextPageToken: string = '') {
        this.isLoading = true;

        try {
            const response = await fetchUtil.get('/api/search', {
                q: this.typedQ,
                channelId: this.channelId,
                pageToken: nextPageToken
            });

            this.fetchedQ = this.typedQ;
            this.processResponse(response, nextPageToken);

            this.appStore.navigate(`/activities/${this.fetchedQ}`, true);
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
            this.hideItemsWhenLoading = true;
        }
    }

    public reset(): void {
        this.channelId = undefined;
        this.typedQ = '';
        this.fetchedQ = 'initial_dummy_value';
        this.nextPageToken = '';
        this.items = [];
        this.isLoading = false;
        this.hideItemsWhenLoading = true;
        this.error = undefined;
    }

    private parseActivities(items: youtube.ActivitiyItem[]): youtube.ActivitiyItem[] {
        return items.map((item: youtube.ActivitiyItem) => {
            item = Object.assign({}, item);
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

    private processResponse(response, nextPageToken = '') {
        const items = this.parseActivities(response.items);

        this.items = nextPageToken ? this.concat(items) : items;
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

    private concat(items: youtube.ActivitiyItem[]) {
        return this.items.concat(items.filter(item => !this.items.find(item2 => item2.id === item.id)));
    }

    private getDefaultTypedQ(): string {
        const { search } = this.appStore.params;

        if (search) {
            setStorage('search.value', search);
        }

        return getStorage('search.value') || '';
    }
}

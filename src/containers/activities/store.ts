import { observable, reaction } from 'mobx';
import { external as canInject, inject, initialize as constructor } from 'tsdi';
import { channel } from '../../utils/channels';
import { beans } from '../../utils/beans';
import { fetchUtil } from '../../utils/ajax';
import { setStorage, getStorage } from '../../utils/storage';
import { parseActivities } from '../../utils/api';
import { AppStore } from '../../store';

@canInject
export class ActivitiesStore {
    @inject private appStore: AppStore;

    @observable channelId?: channel;
    @observable typedQ = '';
    @observable fetchedQ = '';
    @observable nextPageToken = '';
    @observable items: youtube.ActivitiyItem[] = [];
    @observable isLoading = false;
    @observable hideItemsWhenLoading = true;
    @observable showBtnToTop = false;
    @observable error?: ErrorEvent;

    @constructor
    init() {
        const { search } = this.appStore.params;

        if (search) {
            setStorage('activities.search', search);
        }

        this.reset();

        // a channel was selected and nothing is typed into the search-box
        reaction(
            () => this.channelId && !this.typedQ && this.fetchedQ !== this.typedQ,
            requireReload => {
                if (requireReload) {
                    this.loadActivities();
                }
            }
        );

        // the channel changed
        reaction(
            () => this.channelId,
            () => {
                if (this.channelId) {
                    if (this.typedQ) {
                        this.search();
                    } else {
                        this.loadActivities();
                    }

                    setStorage('activities.channelId', this.channelId);
                }
            }
        );

        // the fetched search-value changed
        reaction(() => this.fetchedQ, () => setStorage('activities.search', this.fetchedQ));

        // route is current and the search-params changed
        reaction(
            () =>
                this.appStore.route.startsWith('/activities') &&
                this.appStore.params.search &&
                this.appStore.params.search !== this.fetchedQ,
            paramsChanged => {
                const { search } = this.appStore.params;

                if (paramsChanged && search) {
                    this.typedQ = search;
                    this.search();
                }
            }
        );
    }

    public async loadActivities(nextPageToken: string = '') {
        this.isLoading = true;

        this.appStore.navigate(`/activities`);

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

            this.appStore.navigate(`/activities/${this.fetchedQ}`);
        } catch (e) {
            this.error = e;
        } finally {
            this.isLoading = false;
            this.hideItemsWhenLoading = true;
        }
    }

    public reset(): void {
        this.channelId = (getStorage('activities.channelId') as channel) || channel.RBTV;
        this.typedQ = getStorage('activities.search') || '';
        this.nextPageToken = '';
        this.items = [];
        this.isLoading = false;
        this.hideItemsWhenLoading = true;
        this.error = undefined;
        this.showBtnToTop = false;
    }

    private processResponse(response, nextPageToken = '') {
        const items = parseActivities(response.items);

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
}

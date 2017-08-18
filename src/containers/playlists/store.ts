import { observable, computed, reaction } from 'mobx';
import { external as canInject, inject, initialize as constructor } from 'tsdi';
import { fetchUtil } from '../../utils/ajax';
import { channel } from '../../utils/channels';
import { getStorage, setStorage } from '../../utils/storage';
import { parsePlaylists } from '../../utils/api';
import { AppStore } from '../../store';

@canInject
export class PlaylistsStore {
    @inject private appStore: AppStore;

    @observable channelId?: channel;
    @observable typedQ = '';
    @observable commitedQ = '';
    @observable nextPageToken = '';
    @observable items: youtube.PlaylistItem[] = [];
    @observable loading = false;
    @observable hideItemsWhenLoading = true;
    @observable showBtnToTop = false;
    @observable error?: ErrorEvent;

    @computed
    public get filteredItems(): youtube.PlaylistItem[] {
        return this.items.filter(item => {
            if (item.snippet.channelId !== this.channelId) return false;
            if (this.commitedQ) {
                return item.snippet.title.toLowerCase().indexOf(this.commitedQ.toLowerCase()) !== -1;
            }

            return true;
        });
    }

    @constructor
    init() {
        const { search } = this.appStore.params;

        if (search) {
            setStorage('playlists.search', search);
        }

        reaction(
            () => this.typedQ,
            typedQ => {
                if (!typedQ) this.commitedQ = '';
            }
        );

        this.reset();
    }

    public async loadPlaylists(nextPageToken: string = '') {
        this.loading = true;

        try {
            const response = await fetchUtil.get('/api/playlists', {
                pageToken: nextPageToken
            });

            this.items = parsePlaylists(response.items);
        } catch (e) {
            this.error = e;
        } finally {
            this.loading = false;
            this.hideItemsWhenLoading = true;
        }
    }

    public reset(): void {
        this.channelId = (getStorage('playlists.channelId') as channel) || channel.RBTV;
        this.typedQ = getStorage('playlists.value') || '';
        this.commitedQ = '';
        this.nextPageToken = '';
        this.items = [];
        this.loading = false;
        this.hideItemsWhenLoading = true;
        this.error = undefined;
        this.showBtnToTop = false;
    }
}

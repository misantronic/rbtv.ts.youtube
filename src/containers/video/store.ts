import { observable, reaction } from 'mobx';
import { fetchUtil } from '../../utils/ajax';

export class VideoStore {
    @observable id: string | null;
    @observable video: youtube.VideoItem | null;
    @observable videoIsLoading = false;

    constructor() {
        reaction(() => this.id, id => id && this.loadVideo(id));
    }

    static parseVideo(item: youtube.VideoItem): youtube.VideoItem {
        item.snippet.publishedAt = new Date(item.snippet.publishedAt);

        return item;
    }

    public async loadVideo(id: string) {
        this.videoIsLoading = true;

        const videoItems: youtube.VideoItem[] = await fetchUtil.get('/api/videos', {
            id
        });

        if (videoItems && videoItems.length) {
            this.video = VideoStore.parseVideo(videoItems[0]);
        }

        this.videoIsLoading = false;
    }

    public resetVideo(): void {
        this.id = null;
        this.video = null;
    }
}

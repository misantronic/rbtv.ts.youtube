import { component as injectable } from 'tsdi';
import { getStorage, setStorage } from './utils/storage';
import { baseUrl, fetchUtil } from './utils/ajax';

export type YoutubeRating = 'like' | 'dislike' | 'none';

const ytBaseURL = 'https://www.googleapis.com/youtube/v3';
const calBaseURL = 'https://www.googleapis.com/calendar/v3';
const endpointCacheInvalidate = baseUrl + '/cache.invalidate';

const endpoints = {
    getRating: ytBaseURL + '/videos/getRating',
    playlists: ytBaseURL + '/playlists',
    rate: ytBaseURL + '/videos/rate',
    comments: ytBaseURL + '/comments',
    commentThreads: ytBaseURL + '/commentThreads',
    channels: ytBaseURL + '/channels',
    calendar: calBaseURL + '/calendars'
};

const clientId = '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com';

const scope = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly'
    // 'https://www.googleapis.com/auth/youtubepartner',
    // 'https://www.googleapis.com/auth/youtube',
    // 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
];

@injectable
export class YoutubeStore {
    private get accessData(): GoogleApiOAuth2TokenObject | null {
        return getStorage('ytAccess') as GoogleApiOAuth2TokenObject | null;
    }

    private set accessData(val: GoogleApiOAuth2TokenObject | null) {
        setStorage('ytAccess', val);
    }

    async addRating(rating: YoutubeRating, videoId) {
        return await this.request(endpoints.rate, 'POST', {}, { id: videoId, rating });
    }

    async getRating(videoId, askForPermission = true): Promise<YoutubeRating> {
        if (!askForPermission && !this.accessData) {
            return Promise.reject('none');
        }

        const data = await this.request(endpoints.getRating, 'GET', { id: videoId });

        return data.items[0].rating;
    }

    async getChannelInfo() {
        const { YT_KEY } = process.env;
        const data = await this.request(endpoints.channels, 'GET', {
            part: 'id',
            mine: true,
            maxResults: 1,
            key: YT_KEY
        });
        const myChannelInfo = data.items[0];

        setStorage('ytMyChannel', myChannelInfo);

        return myChannelInfo;
    }

    async addComment(commentModel) {
        const data = commentModel.getPayload();

        return await this.request(commentModel.urlRoot, 'POST', { part: 'snippet' }, data);
    }

    async updateComment(commentModel) {
        const data = commentModel.getPayload();

        return await this.request(endpoints.comments, 'PUT', { part: 'snippet' }, data);
    }

    async removeComment(commentModel) {
        return await this.request(endpoints.comments, 'DELETE', { id: commentModel.id });
    }

    async invalidateComments(key) {
        return await this.request(endpointCacheInvalidate, 'GET', { key });
    }

    /**
     * Private methods
     */

    private request(url: string, type: 'GET' | 'POST' | 'DELETE' | 'PUT', params = {}, data = {}) {
        const tryRequest = async (retryOnFail = true) => {
            await this.authorize();

            if (!this.accessData) return Promise.resolve();

            const retryFn = async res => {
                const { error } = res;

                // error-handling
                if (retryOnFail && error && error.code === 401) {
                    // re-authorize user
                    this.accessData = null;

                    await this.authorize(true);

                    return tryRequest(false);
                }

                return res;
            };

            const catchFn = () => {};

            const Authorization = `Bearer ${this.accessData.access_token}`;

            switch (type) {
                default:
                case 'GET':
                    return fetchUtil.get(url, params, { Authorization }).then(retryFn).catch(catchFn);
                case 'POST':
                    return fetchUtil.post(url, params, data, { Authorization }).then(retryFn).catch(catchFn);
                case 'PUT':
                    return fetchUtil.put(url, params, data, { Authorization }).then(retryFn).catch(catchFn);
                case 'DELETE':
                    return fetchUtil.delete(url, params, { Authorization }).then(retryFn).catch(catchFn);
            }
        };

        return tryRequest();
    }

    private async authorize(immediate = false) {
        return new Promise(resolve => {
            if (this.accessData) {
                return resolve();
            }

            gapi.auth.authorize(
                {
                    client_id: clientId,
                    scope,
                    immediate
                },
                () => {
                    this.accessData = gapi.auth.getToken();

                    setStorage('ytAccess', this.accessData);

                    resolve();
                }
            );
        });
    }
}

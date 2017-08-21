import { component as injectable } from 'tsdi';
import { computed, observable } from 'mobx';
import * as startOfWeek from 'date-fns/start_of_week';
import * as addDays from 'date-fns/add_days';
import { getStorage, setStorage } from './utils/storage';
import { baseUrl, fetchUtil } from './utils/ajax';
import { parseCalendarEvent } from './utils/api';

export type YoutubeRating = 'like' | 'dislike' | 'none';

const ytBaseURL = 'https://www.googleapis.com/youtube/v3';
const calBaseURL = 'https://www.googleapis.com/calendar/v3';
const calId = '5aj6musne0k96vbqlu43p8lgs0@group.calendar.google.com';
const clientId = '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com';
const endpointCacheInvalidate = baseUrl + '/cache.invalidate';

const endpoints = {
    getRating: ytBaseURL + '/videos/getRating',
    playlists: ytBaseURL + '/playlists',
    rate: ytBaseURL + '/videos/rate',
    comments: ytBaseURL + '/comments',
    commentThreads: ytBaseURL + '/commentThreads',
    channels: ytBaseURL + '/channels',
    calendar: `${calBaseURL}/calendars/${calId}/events`
};

const scope = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/calendar'
    // 'https://www.googleapis.com/auth/youtubepartner',
    // 'https://www.googleapis.com/auth/youtube',
    // 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
];

@injectable
export class GoogleStore {
    @observable private calendarItems: gcalendar.Event[] = [];

    private get accessData(): GoogleApiOAuth2TokenObject | null {
        return getStorage('ytAccess') as GoogleApiOAuth2TokenObject | null;
    }

    private set accessData(val: GoogleApiOAuth2TokenObject | null) {
        setStorage('ytAccess', val);
    }

    public async addRating(rating: YoutubeRating, videoId) {
        return await this.request(endpoints.rate, 'POST', {}, { id: videoId, rating });
    }

    public async getRating(videoId, askForPermission = true): Promise<YoutubeRating> {
        if (!askForPermission && !this.accessData) {
            return Promise.reject('none');
        }

        const data = await this.request(endpoints.getRating, 'GET', { id: videoId });

        return data.items[0].rating;
    }

    public async getChannelInfo() {
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

    public async addComment(commentModel) {
        const data = commentModel.getPayload();

        return await this.request(commentModel.urlRoot, 'POST', { part: 'snippet' }, data);
    }

    public async updateComment(commentModel) {
        const data = commentModel.getPayload();

        return await this.request(endpoints.comments, 'PUT', { part: 'snippet' }, data);
    }

    public async removeComment(commentModel) {
        return await this.request(endpoints.comments, 'DELETE', { id: commentModel.id });
    }

    public async invalidateComments(key) {
        return await this.request(endpointCacheInvalidate, 'GET', { key });
    }

    public async loadCalendarDates() {
        const { YT_KEY } = process.env;

        const calendarObj: gcalendar.CalendarRequest = await this.request(endpoints.calendar, 'GET', {
            singleEvents: true,
            key: YT_KEY
        });

        this.calendarItems = calendarObj.items.map(parseCalendarEvent);
    }

    @computed
    public get mondayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 1);
    }

    @computed
    public get tuesdayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 2);
    }

    @computed
    public get wednesdayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 3);
    }

    @computed
    public get thursdayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 4);
    }

    @computed
    public get fridayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 5);
    }

    @computed
    public get saturdayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 6);
    }

    @computed
    public get sundayItems() {
        return this.calendarItems.filter(item => item.start.dateTime.getDay() === 0);
    }

    @computed
    public get DAYS() {
        const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });

        return [
            { title: 'Mon.', date: addDays(startOfWeekDate, 0), items: this.mondayItems },
            { title: 'Tue.', date: addDays(startOfWeekDate, 1), items: this.tuesdayItems },
            { title: 'Wed.', date: addDays(startOfWeekDate, 2), items: this.wednesdayItems },
            { title: 'Thu.', date: addDays(startOfWeekDate, 3), items: this.thursdayItems },
            { title: 'Fri.', date: addDays(startOfWeekDate, 4), items: this.fridayItems },
            // { title: 'Sat.', date: addDays(startOfWeekDate, 5), items: this.saturdayItems },
            // { title: 'Sun.', date: addDays(startOfWeekDate, 6), items: this.sundayItems }
        ];
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

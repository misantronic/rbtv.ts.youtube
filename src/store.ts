import { observable, computed, action } from 'mobx';
import { component as injectable } from 'tsdi';
import { Router, RouterConfig, RouteEnterEvent } from 'yester';
import { channel } from './utils/channels';
import { fetchUtil } from './utils/ajax';
import { parseActivities } from './utils/api';

export type Route = '/activities' | '/video/:id' | '/playlists' | '/activities/:search' | '/timetable';
interface RouteObj { id: string; route: Route; }

export const routes: RouteObj[] = [
    { id: 'activities', route: '/activities' },
    { id: 'activities-search', route: '/activities/:search' },
    { id: 'playlists', route: '/playlists' },
    { id: 'video', route: '/video/:id' },
    { id: 'timetable', route: '/timetable' }
];

@injectable
export class AppStore {
    @observable public route: Route;
    @observable public params: { [key: string]: string } = {};
    @observable public liveId = '';

    private router: Router;

    constructor() {
        const config: RouterConfig = {
            type: 'browser'
        };

        const yesterRoutes = routes.map(routeObj => ({
            $: routeObj.route,
            enter: (e: RouteEnterEvent) => this.setRoute(routeObj.route, e.params)
        }));

        this.router = new Router(
            [{ $: '/', beforeEnter: () => Promise.resolve({ redirect: routes[0].route }) }, ...yesterRoutes],
            config
        );

        this.router.init();
    }

    @computed
    public get isRouteActivities() {
        return this.route === '/activities' || this.route === '/activities/:search';
    }

    @computed
    public get isRouteVideo() {
        return this.route === '/video/:id' && !this.isRouteLive;
    }

    @computed
    public get isRoutePlaylists() {
        return this.route === '/playlists';
    }

    @computed
    public get isRouteLive() {
        return this.route === '/video/:id' && this.params.id === this.liveId;
    }

    @computed
    public get isRouteTimetable() {
        return this.route === '/timetable';
    }

    public async loadBundle(name: Route): Promise<React.ComponentClass<any>> {
        let target;

        switch (name) {
            case '/activities':
            case '/activities/:search':
                target = await import('./containers/activities');
                break;
            case '/playlists':
                target = await import('./containers/playlists');
                break;
            case '/video/:id':
                target = await import('./containers/video');
                break;
            case '/timetable':
                target = await import('./containers/timetable');
                break;
        }

        if (!target) {
            throw new Error('target `' + name + '` was not found.');
        }

        if (!target.default) {
            throw new Error('target `' + name + '` has no default export.');
        }

        return target.default;
    }

    public async loadLiveId() {
        const response = await fetchUtil.get('/api/search', {
            q: '',
            eventType: 'live',
            maxResults: 1,
            channelId: channel.RBTV,
            pageToken: '',
            ttl: 60 * 15
        });

        const items = parseActivities(response.items);

        if (items.length) {
            this.liveId = items[0].id;
        }
    }

    public navigate(path: string, replace = false): void {
        this.router.navigate(path, replace);
    }

    @action
    private setRoute(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;
    }
}

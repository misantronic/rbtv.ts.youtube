import { observable, computed, action } from 'mobx';
import { component as injectable } from 'tsdi';
import { Router, RouterConfig, RouteEnterEvent } from 'yester';

export type Route = '/activities' | '/video/:id' | '/playlists' | '/activities/:search';
type RouteObj = { id: string; route: Route };

export const routes: RouteObj[] = [
    { id: 'activities', route: '/activities' },
    { id: 'activities-search', route: '/activities/:search' },
    { id: 'playlists', route: '/playlists' },
    { id: 'video', route: '/video/:id' }
];

@injectable
export class AppStore {
    @observable route: Route;
    @observable params: any;

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
        return this.route && this.route.startsWith((routes.find(routeObj => routeObj.id.startsWith('activities')) as RouteObj).route);
    }

    @computed
    public get isRoutePlaylists() {
        return this.route && this.route === (routes.find(routeObj => routeObj.id === 'playlists') as RouteObj).route;
    }

    @computed
    public get isRouteVideo() {
        return this.route && this.route === (routes.find(routeObj => routeObj.id === 'video') as RouteObj).route;
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
        }

        if (!target) {
            throw new Error('target `' + name + '` was not found.');
        }

        if (!target.default) {
            throw new Error('target `' + name + '` has no default export.');
        }

        return target.default;
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

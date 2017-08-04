import { observable, computed } from 'mobx';
import { Component as injectable } from 'tsdi';
import { Router, RouterConfig, RouteEnterEvent, match } from 'yester';

export type Route = '/activities' | '/video/:id' | '/playlists';
type RouteObj = { id: string; route: Route };

export const routes: RouteObj[] = [
    { id: 'activities', route: '/activities' },
    { id: 'playlists', route: '/playlists' },
    { id: 'video', route: '/video/:id' }
];

@injectable()
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
        return this.route === (routes.find(routeObj => routeObj.id === 'activities') as RouteObj).route;
    }

    @computed
    public get isRoutePlaylists() {
        return this.route === (routes.find(routeObj => routeObj.id === 'playlists') as RouteObj).route;
    }

    @computed
    public get isRouteVideo() {
        return this.route === (routes.find(routeObj => routeObj.id === 'video') as RouteObj).route;
    }

    public async loadBundle(name: Route): Promise<React.ComponentClass<any>> {
        let target;

        switch (name) {
            case '/activities':
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

    public navigate(path: string): void {
        const result = routes.reduce((result, routeObj: RouteObj) => {
            if (result) return result;

            const pattern = routeObj.route;
            const matchResult = match({ path, pattern });

            if (matchResult) {
                return {
                    pattern,
                    params: matchResult.params
                };
            }

            return null;
        }, null);

        if (result) {
            this.setRoute(result.pattern, result.params);
        }

        this.router.navigate(path);
    }

    private setRoute(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;
    }
}

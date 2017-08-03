import { observable } from 'mobx';
import { Router, RouterConfig, RouteEnterEvent } from 'yester';

export type Route = 'activities' | 'video' | 'playlists';

export class AppStore {
    @observable route: Route;
    @observable params: any;

    public router: Router;

    constructor() {
        const config: RouterConfig = {
            type: 'browser'
        };

        this.router = new Router(
            [
                { $: '/', beforeEnter: () => Promise.resolve({ redirect: '/activities' }) },
                { $: '/activities', enter: (e: RouteEnterEvent) => this.setRoute('activities', e.params) },
                { $: '/playlists', enter: (e: RouteEnterEvent) => this.setRoute('playlists', e.params) },
                { $: '/video/:id', enter: (e: RouteEnterEvent) => this.setRoute('video', e.params) }
            ],
            config
        );

        this.router.init();
    }

    private setRoute(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;
    }

    public async loadBundle(name: Route): Promise<React.ComponentClass<any>> {
        let target;

        switch (name) {
            case 'activities':
                target = await import('./containers/activities');
                break;
            case 'playlists':
                target = await import('./containers/playlists');
                break;
            case 'video':
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

    public navigate(route: Route, params: any = {}): void {
        console.log('navigate', route, params);        

        const { router } = this;

        this.setRoute(route, params);

        switch (route) {
            case 'activities':
            case 'playlists':
                return router.navigate(route);
            case 'video':
                return router.navigate(route + '/' + params.id);
        }
    }
}

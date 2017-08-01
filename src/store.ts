import { observable } from 'mobx';
import { Router, RouterConfig, RouteEnterEvent } from 'yester';

export type Route = 'activities' | 'video';

export class AppStore {
    @observable route: Route;
    @observable params: any;

    private router: Router;

    constructor() {
        const config: RouterConfig = {
            type: 'browser'
        };

        this.router = new Router(
            [
                { $: '/', beforeEnter: () => Promise.resolve({ redirect: '/activities' }) },
                { $: '/activities', enter: (e: RouteEnterEvent) => this.setRoute('activities', e.params) },
                { $: '/video/:id', enter: (e: RouteEnterEvent) => this.setRoute('video', e.params) }
            ],
            config
        );

        this.router.init();
    }

    public setRoute(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;

        console.log('redirect', route, params);
    }
}

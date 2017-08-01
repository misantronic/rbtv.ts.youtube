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

    private setRoute(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;
    }

    public navigate(route: Route, params: any = {}): void {
        const { router } = this;

        this.setRoute(route, params);

        switch (route) {
            case 'activities':
                return router.navigate(route);
            case 'video':
                return router.navigate(route + '/' + params.id);
        }
    }
}

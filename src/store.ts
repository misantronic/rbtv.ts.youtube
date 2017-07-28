import { observable, reaction } from 'mobx';

export type Route = 'activities' | 'video/:id';

export class AppStore {
    @observable route: Route;
    @observable params: any;

    constructor() {
        reaction(() => this.route, changed => changed && this.changeHash());

        window.onhashchange = this.onhashchange.bind(this);

        this.onhashchange();
    }

    private onhashchange() {
        const hash = location.hash.substr(1) || 'activities';

        if (hash === 'activities') {
            this.redirect('activities');
        }

        if (/video\/(\w+)/i.test(hash)) {
            const parts = hash.split('/');

            this.redirect('video/:id', { id: parts[1] });
        }
    }

    private changeHash(): void {
        const parsedRoute = this.route.replace(/(?:\:(\w+)*)/, (str, $1) => str && this.params[$1]);

        location.hash = parsedRoute;
    }

    public redirect(route: Route, params: any = {}): void {
        this.params = params;
        this.route = route;
    }
}

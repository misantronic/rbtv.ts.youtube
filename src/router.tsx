import * as React from 'react';
import { AppStore, Route } from './store';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

interface RouterProps {
    store: AppStore;
}

interface RouterState {
    Component: React.ComponentClass<{ appStore: AppStore }> | null;
}

@observer
export class Router extends React.Component<RouterProps, RouterState> {
    constructor(props) {
        super(props);

        this.state = {
            Component: null
        };
    }

    componentDidMount() {
        reaction(() => this.props.store.route, (name: Route) => this.route(name), { fireImmediately: true });
    }

    async route(name: Route) {
        const target = await import('./containers/' + name);

        this.setState({ Component: target.default });
    }

    render(): JSX.Element | null {
        const { Component } = this.state;

        if (Component) {
            return <Component appStore={this.props.store} {...this.props.store.params} />;
        }

        return null;
    }
}

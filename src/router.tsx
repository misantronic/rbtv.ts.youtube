import * as React from 'react';
import { AppStore, Route } from './store';
import { observer } from 'mobx-react';

interface RouterProps {
    appStore: AppStore;
}

@observer
export class Router extends React.Component<RouterProps> {
    render(): JSX.Element | null {
        const { appStore } = this.props;

        return <LazyComponent bundle={appStore.route} store={appStore} />;
    }
}

interface LazyComponentProps {
    bundle: Route;
    store: AppStore;
}

interface LazyComponentState {
    Component: React.ComponentClass<{ appStore: AppStore }> | null;
}

class LazyComponent extends React.Component<LazyComponentProps, LazyComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            Component: null
        };
    }

    componentWillReceiveProps(nextProps: LazyComponentProps) {
        let name = nextProps.bundle;

        if (name) {
            this.route(name);
        }
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    async route(name) {
        let target;

        if (name === 'activities') {
            target = await import('./containers/activities');
        }
        if (name === 'video/:id') {
            target = await import('./containers/video');
        }

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

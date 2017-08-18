import * as React from 'react';
import { external as canInject, inject } from 'tsdi';
import { AppStore, Route } from '../../store';
import { reaction } from 'mobx';

interface RouterProps {}

interface RouterState {
    Component: React.ComponentClass<{}> | null;
}

@canInject
export class Router extends React.Component<RouterProps, RouterState> {
    @inject private appStore: AppStore;

    constructor(props) {
        super(props);

        this.state = {
            Component: null
        };
    }

    componentDidMount() {
        reaction(
            () => this.appStore.route,
            async (name: Route) => {
                if (name) {
                    const Component = await this.appStore.loadBundle(name);

                    this.setState({ Component });
                }
            },
            { fireImmediately: true }
        );
    }

    render(): JSX.Element | null {
        const { Component } = this.state;

        if (Component) {
            return <Component {...this.appStore.params} />;
        }

        return null;
    }
}

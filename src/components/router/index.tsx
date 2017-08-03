import * as React from 'react';
import { AppStore, Route } from '../../store';
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
        const { store } = this.props;

        reaction(
            () => store.route,
            async (name: Route) => {
                const Component = await store.loadBundle(name);

                this.setState({ Component });
            },
            { fireImmediately: true }
        );
    }

    render(): JSX.Element | null {
        const { Component } = this.state;

        if (Component) {
            return <Component appStore={this.props.store} {...this.props.store.params} />;
        }

        return null;
    }
}

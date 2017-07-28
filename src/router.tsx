import * as React from 'react';
import { AppStore } from './store';
import { Activities } from './containers/activities';
import { Video } from './containers/video';
import { observer } from 'mobx-react';

interface RouterProps {
    appStore: AppStore;
}

@observer
export class Router extends React.Component<RouterProps> {
    render(): JSX.Element | null {
        const { appStore } = this.props;

        switch (appStore.route) {
            case 'activities':
                return <Activities appStore={appStore} />;
            case 'video/:id':
                return <Video appStore={appStore} id={appStore.params.id} />;
            default:
                return null;
        }
    }
}

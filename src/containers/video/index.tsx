import * as React from 'react';
import { AppStore } from '../../store';

interface VideoProps {
    appStore: AppStore;
    id: string;
}

export class Video extends React.Component<VideoProps> {
    render(): JSX.Element { 
        return (
            <div>
                Video {this.props.id}
            </div>
        );
    }
}

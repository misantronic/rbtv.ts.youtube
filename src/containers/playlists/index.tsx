import * as React from 'react';
import { AppStore } from '../../store';

interface PlaylistsProps {
    appStore: AppStore;
}

export class Playlists extends React.Component<PlaylistsProps> {
    render(): JSX.Element {
        return <div>Playlists</div>;
    }
}

export default Playlists;

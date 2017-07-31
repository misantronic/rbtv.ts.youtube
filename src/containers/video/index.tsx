import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { AppStore } from '../../store';
import { VideoStore } from './store';
import { VideoPlayer } from '../../components/video-player';

const store = new VideoStore();

interface VideoProps {
    appStore: AppStore;
    id: string;
}

const H1 = styled.h1``;

@observer
export class Video extends React.Component<VideoProps> {
    componentDidMount() {
        store.id = this.props.id;
    }

    componentWillUnmount() {
        store.resetVideo();
    }

    render(): JSX.Element | null {
        const { video } = store;

        if (!video) {
            return null;
        }

        return (
            <div>
                <VideoPlayer id={video.id} />
                <H1>
                    {video.snippet.title}
                </H1>
            </div>
        );
    }
}

export default Video;

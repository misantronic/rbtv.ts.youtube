import * as React from 'react';
import * as moment from 'moment';
import { updateStorage } from '../../utils/storage';

interface VideoPlayerProps {
    id: string;
    autoplay?: boolean;
    seekTo?: moment.Duration;
    className?: string;
    onEnded?(id: string): void;
}

interface VideoPlayerState {
    playerWidth: '100%' | number;
    playerHeight: number;
    isReady: boolean;
}

let YT: youtube.YT;
const containerId = 'yt-video-container';

export class VideoPlayer extends React.PureComponent<VideoPlayerProps, VideoPlayerState> {
    private player: Player;

    static defaultProps = {
        autoplay: false
    };

    constructor(props) {
        super(props);

        this.state = {
            playerWidth: '100%',
            playerHeight: 450,
            isReady: false
        };
    }

    render() {
        const { playerWidth, playerHeight } = this.state;
        const { className } = this.props;

        return (
            <div className={className} style={{ width: playerWidth, height: playerHeight }}>
                <div id={containerId} />
            </div>
        );
    }

    componentDidMount() {
        YT = (window as any).YT;

        if (typeof YT === 'undefined' || !YT.Player) {
            (window as any).onYouTubeIframeAPIReady = this.onYT;
        } else {
            this.onYT();
        }

        addEventListener('resize', this.onResize);
    }

    componentDidUpdate(prevProps: VideoPlayerProps) {
        const { id, autoplay, seekTo } = this.props;

        if (id !== prevProps.id || autoplay !== prevProps.autoplay) {
            this.updatePlayer();
        }

        if (seekTo && seekTo !== prevProps.seekTo) {
            this.seekTo(seekTo);
        }
    }

    componentWillUnmount() {
        removeEventListener('resize', this.onResize);
    }

    private createPlayer() {
        const { id } = this.props;
        const { playerWidth, playerHeight } = this.state;

        this.player = new YT.Player(containerId, {
            width: playerWidth,
            height: playerHeight,
            videoId: id,
            origin: location.hostname,
            events: {
                onReady: this.onReady,
                onStateChange: this.onStateChange
            },
            playerVars: {}
        });
    }

    private updatePlayer() {
        const { id, autoplay } = this.props;
        const { isReady } = this.state;

        if (!isReady) return;

        const { player } = this;
        const { video_id } = player.getVideoData();

        if (video_id === id) return;

        if (autoplay) {
            player.loadVideoById(id);
        } else {
            player.cueVideoById(id);
        }
    }

    private seekTo(value: moment.Duration) {
        const seconds = value.as('seconds');

        this.player.seekTo(seconds);
        this.scrollTo();
        this.player.playVideo();
    }

    private scrollTo() {
        scrollY = 0;
    }

    private setWatched() {
        const videoId = this.props.id;

        updateStorage(`${videoId}.info`, { watched: true });
    }

    /**
     * Event handler
     */

    private onYT = () => {
        this.createPlayer();
    };

    private onReady = () => {
        this.setState({ isReady: true }, () => this.updatePlayer());
    };

    private onStateChange = (e: any) => {
        switch (e.data) {
            case YT.PlayerState.ENDED:
                this.onEnded();
                break;
        }
    };

    private onResize = () => {
        
    };

    private onEnded() {
        const { id, onEnded } = this.props;

        this.setWatched();

        if (onEnded) {
            onEnded(id);
        }
    }
}

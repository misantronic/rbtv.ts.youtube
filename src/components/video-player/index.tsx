import * as React from 'react';
import * as moment from 'moment';
import { updateStorage } from '../../utils/storage';

interface VideoPlayerProps {
    id: string;
    autoplay?: boolean;
    currentTime?: number;
    seekTo?: moment.Duration;
    onEnded?(id: string): void;
}

interface VideoPlayerState {
    playerWidth: '100%' | number;
    playerHeight: number;
    currentTime: number;
    isReady: boolean;
}

let YT: yt.YT;

const containerId = 'yt-video-container';

export class VideoPlayer extends React.PureComponent<VideoPlayerProps, VideoPlayerState> {
    private player: Player;
    private interval: NodeJS.Timer;

    static defaultProps = {
        currentTime: 0,
        autoplay: false
    };

    constructor(props) {
        super(props);

        this.state = {
            playerWidth: '100%',
            playerHeight: 450,
            isReady: false,
            currentTime: 0
        };
    }

    render() {
        const { playerWidth, playerHeight } = this.state;
        return (
            <div style={{ width: playerWidth, height: playerHeight }}>
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

    private createPlayer() {
        const { id, currentTime } = this.props;
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
            playerVars: {
                start: currentTime
            }
        });
    }

    private updatePlayer() {
        const { id, autoplay } = this.props;
        const { currentTime, isReady } = this.state;

        if (!isReady) return;

        if (autoplay) {
            this.player.loadVideoById(id, currentTime);
        } else {
            this.player.cueVideoById(id, currentTime);
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

        updateStorage(`${videoId}.info`, { watched: true, currentTime: 0 });
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
            case YT.PlayerState.PLAYING:
                this.onPlaying();
                break;
            case YT.PlayerState.ENDED:
                this.onEnded();
                break;
        }
    };

    private onPlaying = () => {
        const { id } = this.props;

        // Store player-status
        clearInterval(this.interval);

        const updateTime = () => {
            const currentTime = Math.round(this.player.getCurrentTime());

            updateStorage(`${id}.info`, { currentTime });
        };

        updateTime();
        this.interval = setInterval(updateTime, 8000);
    };

    private onEnded() {
        const { id, onEnded } = this.props;

        this.setWatched();

        if (onEnded) {
            onEnded(id);
        }
    }
}

import * as React from 'react';
import { Duration } from '../../utils/time';

interface VideoPlayerProps {
    id: string;
    autoplay?: boolean;
    seekTo?: string;
    className?: string;
    onEnded?(id: string): void;
}

interface VideoPlayerState {
    isReady: boolean;
}

let YT: youtube.YT;
const containerId = 'yt-video-container';
const playerDefaultSize = {
    width: '100%',
    height: 450
}

export class VideoPlayer extends React.PureComponent<VideoPlayerProps, VideoPlayerState> {
    private player: Player;
    private el: HTMLDivElement | null;

    static defaultProps = {
        autoplay: false
    };

    constructor(props) {
        super(props);

        this.state = {
            isReady: false
        };
    }

    render() {
        const { className } = this.props;

        return (
            <div className={className} ref={el => (this.el = el)} style={playerDefaultSize}>
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

        this.player = new YT.Player(containerId, {
            width: playerDefaultSize.width,
            height: playerDefaultSize.height,
            videoId: id,
            origin: location.hostname,
            events: {
                onReady: this.onReady,
                onStateChange: this.onStateChange
            },
            playerVars: {}
        });

        this.onResize();
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

    private seekTo(value: string) {
        const duration = new Duration(value);
        const seconds = duration.asSeconds();

        this.player.seekTo(seconds);
        this.scrollTo();
        this.player.playVideo();
    }

    private scrollTo() {
        scrollY = 0;
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
        const iframe = document.getElementById(containerId);

        if (iframe) {
            const height = Math.min(innerWidth * 0.55, playerDefaultSize.height);

            iframe.setAttribute('height', String(height));

            if (this.el) {
                this.el.style.height = String(height) + 'px';
            }
        }
    };

    private onEnded() {
        const { id, onEnded } = this.props;

        if (onEnded) {
            onEnded(id);
        }
    }
}

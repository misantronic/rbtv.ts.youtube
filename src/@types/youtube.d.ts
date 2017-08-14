declare class Player {
    constructor(id: string, options: any);
    seekTo(seconds: number): void;
    playVideo(): void;
    getCurrentTime(): number;
    loadVideoById(id: string, seconds?: number): void;
    cueVideoById(id: string, seconds?: number): void;
    getVideoData(): { author: string; title: string; video_id: string };
}

declare namespace youtube {
    interface Thumbnail {
        width: number;
        height: number;
        url: string;
    }

    interface Thumbnails {
        default: Thumbnail;
        medium: Thumbnail;
        standard: Thumbnail;
        high: Thumbnail;
    }

    // type ActivitiyItem = GoogleApiYouTubeActivityResource;

    interface ActivitiyItem {
        contentDetails: {
            upload: {
                videoId: string;
            };
        };
        etag: string;
        id: string;
        kind: 'youtube#activity' | 'youtube#searchResult';
        snippet: {
            channelId: string;
            channelTitle: string;
            description: string;
            publishedAt: Date;
            thumbnails: Thumbnails;
            title: string;
            type: 'upload';
            liveBroadcastContent?: string;
        };
        duration?: string;
        tags?: string[];
    }

    interface Comment {
        kind: 'youtube#comment';
        etag: string;
        id: string;
        snippet: {
            authorDisplayName: string;
            authorProfileImageUrl: string;
            authorChannelUrl: string;
            authorChannelId: { value: string };
            videoId: string;
            textDisplay: string;
            textOriginal: string;
            canRate: boolean;
            viewerRating: string;
            likeCount: number;
            publishedAt: Date;
            updatedAt: Date;
        };
    }

    interface CommentThread {
        kind: 'youtube#commentThread';
        etag: string;
        id: string;
        snippet: {
            videoId: string;
            topLevelComment: Comment;
            canReply: boolean;
            totalReplyCount: number;
            isPublic: boolean;
        };
    }

    // type VideoItem = GoogleApiYouTubeVideoResource;

    interface VideoItem {
        kind: 'youtube#video';
        etag: string;
        id: string;
        statistics: {
            commentCount: number;
            favoriteCount: number;
            dislikeCount: number;
            likeCount: number;
            viewCount: number;
        };
        contentDetails: {
            licensedContent: true;
            caption: string;
            definition: string;
            dimension: string;
            duration: string;
        };
        snippet: {
            categoryId: string;
            description: string;
            title: string;
            channelId: string;
            thumbnails: Thumbnails;
            publishedAt: Date;
            tags: string[];
        };
        expires: string;
    }

    interface YT {
        Player;
        PlayerState: {
            PLAYING: 1;
            ENDED: 2;
        };
    }
}

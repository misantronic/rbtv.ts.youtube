export function parseActivities(items: youtube.ActivitiyItem[]): youtube.ActivitiyItem[] {
    return items.map((item: youtube.ActivitiyItem) => {
        item = Object.assign({}, item);
        item.snippet = Object.assign({}, item.snippet, {
            publishedAt: new Date(item.snippet.publishedAt)
        });

        if (typeof item.id === 'object') {
            item.id = (item.id as any).videoId;
        } else {
            item.id = item.contentDetails.upload.videoId;
        }

        if (!item.contentDetails) {
            item.contentDetails = {
                upload: {
                    videoId: item.id
                }
            };
        }

        return item;
    });
}

export function rejectLiveItems(items: youtube.ActivitiyItem[]): youtube.ActivitiyItem[] {
    return items.filter((item: youtube.ActivitiyItem) => item.snippet.liveBroadcastContent !== 'live');
}

export function parseVideo(item: youtube.VideoItem): youtube.VideoItem {
    item.snippet.publishedAt = new Date(item.snippet.publishedAt);

    return item;
}

export function parseCommentThread(items: youtube.CommentThread[]): youtube.CommentThread[] {
    return items.map(item => {
        item = Object.assign({}, item);
        item.snippet = Object.assign({}, item.snippet);
        item.snippet.topLevelComment = Object.assign({}, item.snippet.topLevelComment);
        item.snippet.topLevelComment.snippet = Object.assign({}, item.snippet.topLevelComment.snippet, {
            publishedAt: new Date(item.snippet.topLevelComment.snippet.publishedAt),
            updatedAt: new Date(item.snippet.topLevelComment.snippet.updatedAt)
        });

        return item;
    });
}

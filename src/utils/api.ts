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

export function parseComment(item: youtube.Comment): youtube.Comment {
    item.snippet = Object.assign({}, item.snippet, {
        publishedAt: new Date(item.snippet.publishedAt),
        updatedAt: new Date(item.snippet.updatedAt)
    });

    return item;
}

export function parseCommentThread(items: youtube.CommentThread[]): youtube.CommentThread[] {
    return items.map(item => {
        item = Object.assign({}, item);
        item.snippet = Object.assign({}, item.snippet);
        item.snippet.topLevelComment = parseComment(item.snippet.topLevelComment);

        return item;
    });
}

export function parsePlaylists(items: youtube.PlaylistItem[]): youtube.PlaylistItem[] {
    return items
        .map(item => {
            item = Object.assign({}, item);
            item.snippet = Object.assign({}, item.snippet, {
                publishedAt: new Date(item.snippet.publishedAt)
            });

            return item;
        })
        .sort((a, b) => {
            if (a.snippet.title < b.snippet.title) return -1;
            if (a.snippet.title > b.snippet.title) return 1;
            return 0;
        });
}

export function parseCalendarEvent(item: gcalendar.Event): gcalendar.Event {
    item = Object.assign({}, item, {
        start: Object.assign({
            dateTime: new Date(item.start.dateTime)
        }),
        end: Object.assign({
            dateTime: new Date(item.end.dateTime)
        }),
        created: new Date(item.created),
        updated: new Date(item.updated),
        isLive: /^\[L\]/.test(item.summary),
        isNew: /^\[N\]/.test(item.summary),
        summary: item.summary.replace(/^\[(?:L|N)]/, '')
    });

    return item;
}

var db = require('../../db');

module.exports = db.model('Videos', new db.Schema({
    _id: String,
    id: String,
    kind: String,
    etag: String,
    expires: { type: Date, default: Date.now },
    snippet: {
        categoryId: String,
        channelId: String,
        title: String,
        description: String,
        tags: [],
        publishedAt: { type: Date, default: Date.now },
        thumbnails: {
            default: {
                width: Number,
                height: Number,
                url: String
            },
            medium: {
                width: Number,
                height: Number,
                url: String
            },
            high: {
                width: Number,
                height: Number,
                url: String
            },
            standard: {
                width: Number,
                height: Number,
                url: String
            },
            maxres: {
                width: Number,
                height: Number,
                url: String
            }
        }
    },
    contentDetails: {
        caption: String,
        definition: String,
        dimension: String,
        duration: String,
        licensedContent: Boolean
    },
    statistics: {
        viewCount: Number,
        likeCount: Number,
        dislikeCount: Number,
        favoriteCount: Number,
        commentCount: Number
    }
}));

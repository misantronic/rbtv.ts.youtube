var fetch = require('../fetch');
var cache = require('../cache');

module.exports = function (req, res) {
    var query = {
        part: 'snippet',
        maxResults: 10,
        parentId: req.query.parentId,
        pageToken: req.query.pageToken
    };

    var config = new fetch.Config({
        response: res,
        endpoint: 'comments',
        query: query,
        cacheConfig: new cache.Config(
            cache.rk('comments', query.parentId, query.pageToken),
            60 * 10 // 5 mins
        )
    });

    fetch(config).then(function (result) {
        fetch.end(res, result.data);
    });
};
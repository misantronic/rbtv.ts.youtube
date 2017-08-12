var _ = require('underscore');
var moment = require('moment');
var Promise = require('promise');
var Model = require('./models/Video');

/**
 *
 * @param {Array} ids
 * @param {Boolean} [fromCache]
 * @returns {Promise}
 */
module.exports = function (ids, fromCache) {
    return new Promise(function (resolve, reject) {
        var itemsNotFound = [];
        var itemsFromDB = [];

        if (fromCache) {
            var num = ids.length;
            var cnt = 0;
            var now = moment();

            // Check videoIds in mongoDB
            _.each(ids, function (videoId) {
                Model.findById(videoId, function (err, model) {
                    if (model) {
                        var expires = moment(model.expires);

                        if (expires.diff(now) > 0) {
                            itemsFromDB.push(
                                _.omit(model.toObject(), '__v', '_id')
                            );
                        } else {
                            itemsNotFound.push(videoId);
                        }
                    } else {
                        itemsNotFound.push(videoId);
                    }

                    if (++cnt >= num) {
                        resolve({
                            itemsFromDB: itemsFromDB,
                            itemsNotFound: itemsNotFound
                        })
                    }
                });
            });
        } else {
            resolve({
                itemsFromDB: itemsFromDB,
                itemsNotFound: ids
            })
        }
    });
};

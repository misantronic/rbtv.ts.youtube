"use strict";
exports.__esModule = true;
var channel;
(function (channel) {
    channel["RBTV"] = "UCQvTDmHza8erxZqDkjQ4bQQ";
    channel["LP"] = "UCtSP1OA6jO4quIGLae7Fb4g";
    channel["G2"] = "UCFBapHA35loZ3KZwT_z3BsQ";
    channel["INSIDE_PS"] = "UCP6gDeEEOVpKgzywJ8pfiRw";
})(channel = exports.channel || (exports.channel = {}));
var channelMap = (_a = {},
    _a[channel.RBTV] = 'Rocket Beans TV',
    _a[channel.LP] = 'Let`s Play',
    _a[channel.G2] = 'Game Two',
    _a[channel.INSIDE_PS] = 'Inside Playstation',
    _a);
function getChannelName(channel) {
    return channelMap[channel];
}
exports.getChannelName = getChannelName;
var _a;

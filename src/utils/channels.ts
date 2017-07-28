export enum Channel {
    RBTV = 'UCQvTDmHza8erxZqDkjQ4bQQ',
    LP = 'UCtSP1OA6jO4quIGLae7Fb4g',
    G2 = 'UCFBapHA35loZ3KZwT_z3BsQ',
    INSIDE_PS = 'UCP6gDeEEOVpKgzywJ8pfiRw'
}

const channelMap = {
    [Channel.RBTV]: 'Rocket Beans TV',
    [Channel.LP]: 'Let`s Play',
    [Channel.G2]: 'Game Two',
    [Channel.INSIDE_PS]: 'Inside Playstation'
}

export function getChannelName(channel: Channel): string {    
    return channelMap[channel];
}

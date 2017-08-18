export enum channel {
    RBTV = 'UCQvTDmHza8erxZqDkjQ4bQQ',
    LP = 'UCtSP1OA6jO4quIGLae7Fb4g',
    G2 = 'UCFBapHA35loZ3KZwT_z3BsQ',
    INSIDE_PS = 'UCP6gDeEEOVpKgzywJ8pfiRw'
}

const channelMap = {
    [channel.RBTV]: 'Rocket Beans TV',
    [channel.LP]: 'Let`s Play',
    [channel.G2]: 'Game Two',
    [channel.INSIDE_PS]: 'Inside Playstation'
};

export function getChannelName(channel: channel): string {    
    return channelMap[channel];
}

import * as moment from 'moment';

export function humanizeDuration(duration: string | undefined) {
    if (!duration) {
        return '';
    }

    const momentDuration = moment.duration(duration);

    const hours = ('0' + momentDuration.hours()).slice(-2);
    const mins = ('0' + momentDuration.minutes()).slice(-2);
    const secs = ('0' + momentDuration.seconds()).slice(-2);

    // Add minutes + seconds
    const arr = [mins, secs];

    // Add hours
    if (hours !== '00') arr.unshift(hours);

    return arr.join(':');
}

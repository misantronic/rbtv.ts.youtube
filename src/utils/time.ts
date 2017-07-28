import * as moment from 'moment'

export function humanizeDuration(duration: moment.Duration) {
    if (!duration) {
        return '';
    }

    const hours = ('0' + duration.hours()).slice(-2);
    const mins = ('0' + duration.minutes()).slice(-2);
    const secs = ('0' + duration.seconds()).slice(-2);

    // Add minutes + seconds
    const arr = [
        mins,
        secs
    ];

    // Add hours
    if (hours !== '00') arr.unshift(hours);

    return arr.join(':');
}

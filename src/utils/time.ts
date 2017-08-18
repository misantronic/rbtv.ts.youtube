const durationRegEx = /(?:PT)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i;

export class Duration {
    public seconds = 0;
    public minutes = 0;
    public hours = 0;

    constructor(duration: string) {
        const result = durationRegEx.exec(duration);

        if (result) {
            this.hours = parseInt(result[1] || '0', 10);
            this.minutes = parseInt(result[2] || '0', 10);
            this.seconds = parseInt(result[3] || '0', 10);
        }
    }

    public humanize(): string {
        const arr: string[] = [];

        if (this.hours) arr.push(this.hours < 10 ? '0' + this.hours : this.hours.toString());
        arr.push(this.minutes < 10 ? '0' + this.minutes : this.minutes.toString());
        arr.push(this.seconds < 10 ? '0' + this.seconds : this.seconds.toString());

        return arr.join(':');
    }

    public asSeconds(): number {
        return this.hours * 60 * 60 + this.minutes * 60 + this.seconds;
    }
}

export function humanizeDuration(val: string | undefined): string {
    if (!val) return '';

    return new Duration(val).humanize();
}

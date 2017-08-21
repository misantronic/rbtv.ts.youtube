declare namespace gcalendar {
    interface CalendarRequest {
        kind: 'calendar#events';
        etag: string;
        summary: string;
        updated: string;
        items: Event[];
        timeZone: string;
        accessRole: string;
        defaultReminders: any[];
        nextSyncToken: string;
    }

    interface Event {
        kind: 'calendar#event';
        etag: string;
        id: string;
        status: string;
        htmlLink: string;
        created: Date;
        updated: Date;
        summary: string;
        description: string;
        creator: { email: string; displayName: string };
        organizer: {
            email: string;
            displayName: string;
            self: boolean;
        };
        start: { dateTime: Date };
        end: { dateTime: Date };
        iCalUID: string;
        sequence: number;
        isLive?: boolean;
        isNew?: boolean;
        source: { title: 'thumbnail', url: string }
    }
}

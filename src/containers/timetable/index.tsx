import * as React from 'react';
import { observer } from 'mobx-react';
import { external as canInject, inject } from 'tsdi';
import * as startOfDay from 'date-fns/start_of_day';
import styled from 'styled-components';
import { DateFormat } from '../../components/date-format';
import { Badge } from '../../components/badge';
import { Caption } from '../../components/caption';
import { Spinner } from '../../components/spinner';
import { GoogleStore } from '../../google-store';

const Wrapper = styled.div`display: flex;`;

const DayWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const DayHeader = styled.header`
    display: flex;
    flex: 0 0 30px;
    margin: 5px 0;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background: ${(props: { isToday: boolean }) => (props.isToday ? '#ff217c' : '#1893b2')};
    color: #fff;
`;

const DayContent = styled.div`
    position: relative;
    flex: 1;
`;

const Event = styled.div`
    padding: 5px;
    margin: 0;
    height: ${(props: { duration: number; pauseAfter: number }) => props.duration * 5}px;
    margin-bottom: ${(props: { duration: number; pauseAfter: number }) => props.pauseAfter * 5}px;
    overflow: hidden;
    background: #f8f8f8;
`;

const EventImage = styled.div`
    width: 100%;
    height: 94px;
    margin-bottom: 5px;
    background-image: url('${(props: any) => props.src}');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100%;
    position: relative;
`;

const EventInfo = styled(Caption)`
    margin-bottom: 0;
`;

const EventTime = styled.div`
    position: absolute;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    width: 100%;
    padding: 2px;
`;

const TypeBadge = styled(Badge)`
    background: ${(props: { color: string }) => props.color};
    transform: scale(0.75);
    margin-right: 3px;
`;

const StyledSpinner = styled(Spinner)`
    margin-top: 10px;
`

const today = startOfDay(new Date());

@observer
@canInject
export class Timetable extends React.Component<{}> {
    @inject private store: GoogleStore;

    public componentDidMount() {
        this.store.loadCalendarDates();
    }

    public render(): any {
        const { calendarDays, calendarIsLoading } = this.store;

        return [
            <Wrapper key="wrapper">
                {calendarDays.map(day =>
                    <DayWrapper key={day.title}>
                        <DayHeader isToday={day.date.getTime() === today.getTime()}>
                            {day.title},&nbsp;<DateFormat format="DD.MM.">{day.date}</DateFormat>
                        </DayHeader>
                        <DayContent>
                            {day.items.map((item, i) => {
                                const duration =
                                    (item.end.dateTime.getTime() - item.start.dateTime.getTime()) / 1000 / 60;
                                const nextItem: gcalendar.Event | undefined = day.items[i + 1];
                                const lineClamp = duration <= 15 ? 1 : duration <= 30 ? 2 : undefined;
                                let pauseAfter = 0;

                                if (nextItem) {
                                    pauseAfter = Math.max(
                                        0,
                                        (nextItem.start.dateTime.getTime() - item.end.dateTime.getTime()) / 1000 / 60
                                    );
                                }

                                return (
                                    <Event key={item.id} duration={duration} pauseAfter={pauseAfter}>
                                        <EventImage src={item.source.url}>
                                            <EventTime>
                                                {item.isLive
                                                    ? <TypeBadge color="#ff217c">Live</TypeBadge>
                                                    : <TypeBadge color="#1893b2">New</TypeBadge>}
                                                <DateFormat format="HH:mm">{item.start.dateTime}</DateFormat> -
                                                <DateFormat format="HH:mm">{item.end.dateTime}</DateFormat>
                                            </EventTime>
                                        </EventImage>
                                        <EventInfo lineClamp={lineClamp}>
                                            {item.summary}
                                        </EventInfo>
                                    </Event>
                                );
                            })}
                        </DayContent>
                    </DayWrapper>
                )}
            </Wrapper>,
            calendarIsLoading && <StyledSpinner key="spinner" />
        ];
    }
}

export default Timetable;

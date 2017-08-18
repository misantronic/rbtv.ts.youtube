import * as React from 'react';
import * as startOfWeek from 'date-fns/start_of_week';
import * as addDays from 'date-fns/add_days';
import styled from 'styled-components';
import { DateFormat } from '../../components/date-format';

interface TimetableProps {}

const Wrapper = styled.div`display: flex;`;

const DayWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const DayHeader = styled.header`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const startOfWeekDate = startOfWeek(new Date());

const DAYS = [
    { title: 'Mon.', date: addDays(startOfWeekDate, 0) },
    { title: 'Tue.', date: addDays(startOfWeekDate, 1) },
    { title: 'Wed.', date: addDays(startOfWeekDate, 2) },
    { title: 'Thu.', date: addDays(startOfWeekDate, 3) },
    { title: 'Fri.', date: addDays(startOfWeekDate, 4) },
    { title: 'Sat.', date: addDays(startOfWeekDate, 5) },
    { title: 'Sun.', date: addDays(startOfWeekDate, 6) }
];

const HOURS = [
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
    '23:59'
];

export class Timetable extends React.PureComponent<TimetableProps> {
    render() {
        return (
            <Wrapper>
                {DAYS.map(day => {
                    return (
                        <DayWrapper key={day.title}>
                            <DayHeader>
                                {day.title}, <DateFormat format="DD.MM.">{day.date}</DateFormat>
                            </DayHeader>
                        </DayWrapper>
                    );
                })}
            </Wrapper>
        );
    }
}

export default Timetable;

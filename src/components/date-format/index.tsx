import * as React from 'react';
import * as dateFormat from 'date-fns/format';

interface DateFormatProps {
    children: Date;
    format?: string;
}

export class DateFormat extends React.Component<DateFormatProps> {
    shouldComponentUpdate(nextProps: DateFormatProps) {
        return nextProps.children !== this.props.children;
    }

    render(): JSX.Element {
        const { children, format = 'YYYY-MM-DD' } = this.props;

        return (
            <span>
                {dateFormat(children, format)}
            </span>
        );
    }
}

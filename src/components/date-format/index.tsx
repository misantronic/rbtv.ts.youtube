import * as React from 'react';
import * as dateFormat from 'date-fns/format';

interface DateFormatProps {
    children: Date;
    format?: string;
    className?: string;
}

export class DateFormat extends React.Component<DateFormatProps> {
    shouldComponentUpdate(nextProps: DateFormatProps) {
        return nextProps.children !== this.props.children;
    }

    render(): JSX.Element {
        const { children, className, format = 'YYYY-MM-DD' } = this.props;

        return (
            <span className={className}>
                {dateFormat(children, format)}
            </span>
        );
    }
}

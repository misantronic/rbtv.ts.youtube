import * as React from 'react';

interface DateFormatProps {
    children: Date;
}

export class DateFormat extends React.Component<DateFormatProps> {
    render(): JSX.Element {
        const { children } = this.props;

        return (
            <span>
                {children.toDateString()}
            </span>
        );
    }
}

import * as React from 'react';

const formatter = new Intl.NumberFormat();

interface NumberFormatProps {
    children: number;
}

export class NumberFormat extends React.PureComponent<NumberFormatProps> {
    public render(): JSX.Element {
        const { children } = this.props;

        return (
            <span>
                {formatter.format(children)}
            </span>
        );
    }
}

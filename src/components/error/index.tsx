import * as React from 'react';

interface ErrorProps {
    children: ErrorEvent;
}

export class Error extends React.PureComponent<ErrorProps> {
    public render(): JSX.Element {
        const {children} = this.props;
        
        return (
            <div>
                {children.message}
            </div>
        );
    }
}

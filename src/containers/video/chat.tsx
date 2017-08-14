import * as React from 'react';

interface ChatProps {
    id: string;
}

export class Chat extends React.PureComponent<ChatProps> {
    render() {
        return (
            <iframe
                frameBorder={0}
                src={'https://www.youtube.com/live_chat?v=' + this.props.id + '&embed_domain=' + location.hostname}
                width="100%"
                height="100%"
            />
        );
    }
}

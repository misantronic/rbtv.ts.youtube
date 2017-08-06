import * as React from 'react';
import styled from 'styled-components';

interface CaptionProps {
    lineClamp?: number;
}

const P = styled.p`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${(props: CaptionProps) => props.lineClamp || 0};
    -webkit-box-orient: vertical;
    display: -webkit-box;
`;

const parseHTML = (html: string): string => {
    return html
        .replace(
            /(?:https*:\/\/(?:www\.)*)*[a-z0-9-]+(\.\w{2})+(?:[/a-z0-9.-_])*/gi,
            url => `<a href="${url}" target="_blank">${url}</a>`
        )
        .replace(/\n/g, '<br/>');
};

export class Caption extends React.Component<CaptionProps> {
    render(): JSX.Element {
        const { children, lineClamp } = this.props;

        return <P lineClamp={lineClamp} dangerouslySetInnerHTML={{ __html: parseHTML(children as string) }} />;
    }
}

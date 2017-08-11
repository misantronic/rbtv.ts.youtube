import * as React from 'react';
import styled from 'styled-components';

interface CaptionProps {
    lineClamp?: number;
    className?: string;
    parseLinks?: boolean;
}

const Text = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${(props: CaptionProps) => props.lineClamp || 0};
    -webkit-box-orient: vertical;
    display: -webkit-box;
    margin: 0 0 1em;
`;

const parseHTMLLinks = (html: string): string =>
    html.replace(
        /(?:https*:\/\/(?:www\.)*)*[a-z0-9-]+(\.\w{2})+(?:[/a-z0-9.-_])*/gi,
        url => `<a href="${url}" target="_blank">${url}</a>`
    );

const parseLines = (html: string): string => html.replace(/\n/g, '<br/>');

export class Caption extends React.Component<CaptionProps> {
    render(): JSX.Element {
        const { children, lineClamp, className, parseLinks } = this.props;
        const html = children as string;
        const __html = parseLines(parseLinks ? parseHTMLLinks(html) : html);

        return <Text lineClamp={lineClamp} className={className} dangerouslySetInnerHTML={{ __html }} />;
    }
}

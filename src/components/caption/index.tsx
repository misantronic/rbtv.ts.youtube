import * as React from 'react';
import styled from 'styled-components';

interface CaptionProps {
    children: string;
}

const P = styled.p`
    max-height: 58px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    display: -webkit-box;
`;

export class Caption extends React.Component<CaptionProps> {
    render(): JSX.Element {
        const { children } = this.props;

        return <P dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br/>') }} />;
    }
}

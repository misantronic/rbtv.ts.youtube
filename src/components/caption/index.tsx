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

export class Caption extends React.Component<CaptionProps> {
    render(): JSX.Element {
        const { children, lineClamp } = this.props;

        return <P lineClamp={lineClamp} dangerouslySetInnerHTML={{ __html: (children as string).replace(/\n/g, '<br/>') }} />;
    }
}

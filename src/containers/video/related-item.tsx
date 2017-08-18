import * as React from 'react';
import { external as canInject, inject } from 'tsdi';
import styled from 'styled-components';
import { Caption } from '../../components/caption';
import { AppStore } from '../../store';

interface RelatedItemProps {
    children: string;
    image: string;
    videoId: string;
}

const Item = styled.div`
    display: flex;
    height: 50px;
    margin-bottom: 10px;
`;

const Image =  styled.div`
    flex: 0 0 100px;
    background-image: url('${(props: { image: string }) => props.image}');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
`;

const Title = styled(Caption)`
    padding: 0 10px;
    margin: 0;
`;

@canInject
export class RelatedItem extends React.PureComponent<RelatedItemProps> {
    @inject private appStore: AppStore;

    render(): JSX.Element {
        const { image, videoId, children } = this.props;

        return (
            <Item>
                <Image image={image} />
                <a href={`/video/${videoId}`} onClick={this.onClick}>
                    <Title lineClamp={3}>
                        {children}
                    </Title>
                </a>
            </Item>
        );
    }

    private onClick = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const href = e.currentTarget.getAttribute('href') as string;

        this.appStore.navigate(href);
    };
}

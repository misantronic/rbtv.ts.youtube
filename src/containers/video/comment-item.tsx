import * as React from 'react';
import styled from 'styled-components';
import { Caption } from '../../components/caption';
import { Likes } from '../../components/likes';
import { DateFormat } from '../../components/date-format';

interface CommentItemProps {
    id: string;
    children: string;
    likes: number;
    author: string;
    authorUrl: string;
    authorImage: string;
    date: Date;
}

const Item = styled.div`
    display: flex;
    margin-bottom: 25px;
`;

const Image = styled.div`
    flex: 0 0 50px;
    background-image: url('${(props: { image: string }) => props.image}');
    background-position: left top;
    background-repeat: no-repeat;
`;

const Content = styled.div`flex: 1;`;

const ContentFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
        > :last-child {
            opacity: 0.6;
        }
    }
`;

const ReplyLink = styled.a`
    margin-right: 15px;
`

export class CommentItem extends React.PureComponent<CommentItemProps> {
    render(): JSX.Element {
        const { children, date, authorImage, likes, author, authorUrl, id } = this.props;

        return (
            <Item>
                <Image image={authorImage} />
                <Content>
                    <Caption>
                        {children}
                    </Caption>
                    <ContentFooter>
                        <div>
                            <ReplyLink href="#">Reply</ReplyLink>
                            <Likes>
                                {likes}
                            </Likes>
                        </div>
                        <div>
                            <a href={authorUrl} target="_blank">
                                {author}
                            </a>
                            , <DateFormat format="YYYY-MM-DD HH:mm">
                                {date}
                            </DateFormat>
                        </div>
                    </ContentFooter>
                </Content>
            </Item>
        );
    }
}

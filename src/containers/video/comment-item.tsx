import * as React from 'react';
import styled from 'styled-components';
import { Caption } from '../../components/caption';
import { Likes } from '../../components/likes';
import { DateFormat } from '../../components/date-format';
import { Duration } from '../../utils/time';

interface CommentItemProps {
    id: string;
    children: string;
    likes: number;
    author: string;
    authorUrl: string;
    authorImage: string;
    date: Date;
    onSeek?(seconds: number): void;
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
`;

const ReplyLink = styled.a`margin-right: 15px;`;

const StyledDate = styled(DateFormat)`
    opacity: 0.6;
`;

export class CommentItem extends React.PureComponent<CommentItemProps> {
    public captionEl: HTMLSpanElement;

    public componentWillUnmount() {
        if (this.captionEl) {
            this.captionEl.querySelectorAll('a').forEach(link => link.removeEventListener('click', this.onClickLink));
        }
    }

    public render(): JSX.Element {
        const { children, date, authorImage, likes, author, authorUrl } = this.props;

        return (
            <Item>
                <Image image={authorImage} />
                <Content>
                    <Caption innerRef={this.onCaptionInnerRef}>
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
                            , <StyledDate format="YYYY-MM-DD HH:mm">{date}</StyledDate>
                        </div>
                    </ContentFooter>
                </Content>
            </Item>
        );
    }

    private onCaptionInnerRef = (el: HTMLSpanElement): void => {
        this.captionEl = el;

        if (this.captionEl) {
            this.captionEl.querySelectorAll('a').forEach(link => link.addEventListener('click', this.onClickLink));
        }
    }

    private onClickLink = (e: MouseEvent) => {
        const { onSeek } = this.props;
        const target = e.target as HTMLAnchorElement;
        const href = target.getAttribute('href') as string;
        const match = /&t=(.*)/.exec(href);

        if (onSeek && match) {
            const durationStr = 'PT' + match[1];
            const duration = new Duration(durationStr);

            onSeek(duration.asSeconds());

            e.preventDefault();
        }
    }
}

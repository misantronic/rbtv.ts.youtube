import * as React from 'react';
import { observer } from 'mobx-react';
import { external, inject } from 'tsdi';
import styled from 'styled-components';
import { ActivitiesStore } from './store';
import { AppStore } from '../../store';
import { ActivityItem } from './activity-item';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Spinner } from '../../components/spinner';
import { Error } from '../../components/error';
import { Button } from '../../components/button';
import { channel } from '../../utils/channels';
import { shows, Show } from '../../utils/shows';
import { baseUrl } from '../../utils/ajax';
import { beans } from '../../utils/beans';
import { Search } from '../search';

const autocompleteItems = ([] as Show[]).concat(shows, beans);

const store = new ActivitiesStore();

const BtnToTop = styled(Button)`
    position: fixed;
    right: 10px;
    bottom: 10px;
`;

@observer
@external
export class Activities extends React.Component {
    @inject private appStore: AppStore;

    componentDidMount() {
        addEventListener('scroll', this.onScroll);

        if (store.typedQ) {
            store.search();
        } else {
            store.loadActivities();
        }
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);

        store.reset();
    }

    render(): any {
        return [
            this.renderSearch(),
            this.renderColumns(),
            this.renderEmpty(),
            this.renderSpinner(),
            this.renderBtnToTop()
        ];
    }

    private renderSearch(): JSX.Element {
        return (
            <Search
                key="search"
                autocompleteItems={autocompleteItems}
                channelId={store.channelId}
                onAutocompleteClear={this.onAutocompleteClear}
                onChannelChange={this.onChangeChannel}
                onSearchChange={this.onChangeSearch}
                onKeyDown={this.onKeyDown}
                value={store.typedQ}
            />
        );
    }

    private renderColumns(): JSX.Element | null {
        const { items, isLoading, hideItemsWhenLoading } = store;

        if (isLoading && hideItemsWhenLoading) {
            return null;
        }

        return (
            <ColumnContainer key="column-container">
                {this.renderError()}
                {items.map((item: youtube.ActivitiyItem) => {
                    const { title, thumbnails, description, publishedAt } = item.snippet;
                    const path = `${baseUrl}/image`;
                    const query = [
                        `${baseUrl}/image`,
                        `url=${encodeURIComponent((thumbnails.standard || thumbnails.high).url)}`,
                        `name=${item.id}.jpg`,
                        thumbnails.standard ? '' : 'small=true'
                    ];
                    
                    const image = path + '?' + query.join('&');

                    return (
                        <Column sm={12} md={6} lg={4} key={item.id}>
                            <ActivityItem
                                id={item.id}
                                title={title}
                                description={description}
                                duration={item.duration}
                                publishedAt={publishedAt}
                                image={image}
                                tags={item.tags}
                                onClick={this.onClickActivity}
                                onClickTag={this.onClickTag}
                            />
                        </Column>
                    );
                })}
            </ColumnContainer>
        );
    }

    private renderBtnToTop(): JSX.Element | false {
        const { showBtnToTop } = store;

        return (
            showBtnToTop &&
            <BtnToTop key="btn-to-top" onClick={this.onScrollToTop} gradient>
                To Top
            </BtnToTop>
        );
    }

    private renderError() {
        const { error } = store;

        if (!error) return null;

        return (
            <Column>
                <Error>
                    {error}
                </Error>
            </Column>
        );
    }

    private renderSpinner() {
        const { isLoading } = store;

        return isLoading && <Spinner key="spinner" />;
    }

    private renderEmpty(): string | null {
        const { isLoading, items } = store;

        if (!isLoading && items.length === 0) {
            return 'No results.';
        }

        return null;
    }

    private onChangeSearch = (val: string): void => {
        const show = autocompleteItems.find(show => show.title === val);

        if (show && show.channel) {
            this.onChangeChannel(show.channel);
        }

        store.typedQ = val;
    };

    private onKeyDown = (e: any): void => {
        if (e.keyCode === 13) {
            this.appStore.navigate(`/activities/${store.typedQ}`);
        }
    };

    private onChangeChannel = (val: channel): void => {
        store.channelId = val;
    };

    private onClickActivity = (id: string) => {
        this.appStore.navigate(`/video/${id}`);
    };

    private onAutocompleteClear = () => {
        store.typedQ = '';
    };

    private onClickTag = (tag: string): void => {
        this.appStore.navigate(`/activities/${tag}`);
    };

    private onScrollToTop = () => scrollTo(0, 0);

    private onScroll = () => {
        const { isLoading, nextPageToken, typedQ } = store;
        const maxY = document.body.scrollHeight - innerHeight - 800;

        if (!isLoading && nextPageToken && scrollY >= maxY) {
            store.hideItemsWhenLoading = false;

            if (typedQ) {
                store.search(nextPageToken);
            } else {
                store.loadActivities(nextPageToken);
            }
        }

        store.showBtnToTop = scrollY > innerHeight;
    };
}

export default Activities;

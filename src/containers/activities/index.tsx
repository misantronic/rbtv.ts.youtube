import * as React from 'react';
import { observer } from 'mobx-react';
import { external, inject } from 'tsdi';
import styled from 'styled-components';
import { ActivitiesStore } from './store';
import { AppStore } from '../../store';
import { ActivityItem } from './activity-item';
import { InputAutocomplete } from '../../components/input-autocomplete';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Select } from '../../components/select';
import { Spinner } from '../../components/spinner';
import { Error } from '../../components/error';
import { Button } from '../../components/button';
import { channel, getChannelName } from '../../utils/channels';
import { shows, Show } from '../../utils/shows';
import { beans } from '../../utils/beans';

const autocompleteItems = ([] as Show[]).concat(shows, beans);

const store = new ActivitiesStore();

const StyledAutocomplete = styled(InputAutocomplete)``;

const StyledSelect = styled(Select)``;

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
        const placeholder = `Search ${getChannelName(store.channelId || channel.RBTV)}...`;
        const options = Object.keys(channel).map((key: channel) => ({
            value: channel[key],
            label: getChannelName(channel[key])
        }));

        return (
            <ColumnContainer key="search">
                <Column sm={12} md={8}>
                    <StyledAutocomplete
                        value={store.typedQ}
                        items={autocompleteItems}
                        placeholder={placeholder}
                        onChange={this.onSearchChange}
                        onKeyDown={this.onKeyDown}
                        onClear={this.onAutocompleteClear}
                        autofocus
                    />
                </Column>
                <Column sm={12} md={4}>
                    <StyledSelect
                        value={store.channelId}
                        options={options}
                        simpleValue
                        searchable={false}
                        clearable={false}
                        onChange={this.onChangeChannel as any}
                    />
                </Column>
            </ColumnContainer>
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
                    let image, imageMargin;

                    if (store.useSmallThumbs) {
                        image = item.snippet.thumbnails.medium.url;
                        imageMargin = '0';
                    } else {
                        image = item.snippet.thumbnails.standard.url;
                    }

                    return (
                        <Column sm={12} md={6} lg={4} key={item.id}>
                            <ActivityItem
                                title={item.snippet.title}
                                description={item.snippet.description}
                                duration={item.duration}
                                publishedAt={item.snippet.publishedAt}
                                image={image}
                                imageMargin={imageMargin}
                                tags={item.tags}
                                onClick={() => this.onClickActivity(item.id)}
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

    private onSearchChange = (val: string): void => {
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

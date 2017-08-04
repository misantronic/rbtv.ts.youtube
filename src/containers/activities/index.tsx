import * as React from 'react';
import debounce = require('lodash/debounce');
import { observer } from 'mobx-react';
import { External, Inject } from 'tsdi';
import styled from 'styled-components';
import { ActivitiesStore } from './store';
import { AppStore } from '../../store';
import { ActivityItem } from './activity-item';
import { InputAutocomplete } from '../../components/input-autocomplete';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Select } from '../../components/select';
import { Spinner } from '../../components/spinner';
import { Error } from '../../components/error';
import { channel, getChannelName } from '../../utils/channels';
import { shows, Show } from '../../utils/shows';
import { beans } from '../../utils/beans';

const store = new ActivitiesStore(channel.RBTV);
const autocompleteItems = ([] as Show[]).concat(shows, beans);

interface ActivitiesStoreProps {}

const SearchWrapper = styled.div`
    display: flex;
    margin-bottom: 25px;
`;

const StyledAutocomplete = styled(InputAutocomplete)``;

const StyledSelect = styled(Select)`
    .Select-control {
        border-left: none;
    }
`;

@observer
@External()
export class Activities extends React.Component<ActivitiesStoreProps> {
    @Inject() private appStore: AppStore;

    componentDidMount() {
        addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
    }

    render(): JSX.Element {
        const { items, isLoading, error } = store;

        return (
            <div>
                {this.renderSearch()}
                <ColumnContainer>
                    {error && this.renderError()}
                    {!store.isSearching &&
                        items.map((item: youtube.ActivitiyItem) => {
                            return (
                                <Column sm={12} md={6} lg={4} key={item.id}>
                                    <ActivityItem
                                        title={item.snippet.title}
                                        description={item.snippet.description}
                                        duration={item.duration}
                                        publishedAt={item.snippet.publishedAt}
                                        image={item.snippet.thumbnails.high.url}
                                        tags={item.tags}
                                        onClick={() => this.onClickActivity(item.id)}
                                        onClickTag={this.onClickTag}
                                    />
                                </Column>
                            );
                        })}
                    {isLoading && <Spinner />}
                </ColumnContainer>
            </div>
        );
    }

    private renderSearch(): JSX.Element {
        const placeholder = `Search ${getChannelName(store.channelId)}...`;
        const options = Object.keys(channel).map((key: channel) => ({
            value: channel[key],
            label: getChannelName(channel[key])
        }));

        return (
            <SearchWrapper>
                <StyledAutocomplete
                    value={store.q}
                    items={autocompleteItems}
                    onChange={this.onSearch}
                    onKeyDown={this.onKeyDown}
                    placeholder={placeholder}
                    autofocus
                />
                <StyledSelect
                    value={store.channelId}
                    options={options}
                    simpleValue
                    searchable={false}
                    clearable={false}
                    onChange={this.onChangeChannel as any}
                />
            </SearchWrapper>
        );
    }

    private renderError() {
        const { error } = store;

        return (
            <Column>
                <Error>
                    {error}
                </Error>
            </Column>
        );
    }

    private onSearch = (val: string): void => {
        const show = autocompleteItems.find(show => show.title === val);

        if (show && show.channel) {
            this.onChangeChannel(show.channel);
        }

        store.q = val;
    };

    private onKeyDown = (e: any): void => {
        if (e.keyCode === 13) {
            store.search();
        }
    };

    private onChangeChannel = (val: channel): void => {
        store.channelId = val;
    };

    private onClickActivity = (id: string) => {
        this.appStore.navigate(`/video/${id}`);
    };

    private onClickTag = (tag: string): void => {
        store.q = tag;
        store.search();
    };

    private onScroll = debounce(() => {
        const maxY = document.body.scrollHeight - window.innerHeight - 800;

        if (!store.isLoading && store.nextPageToken && scrollY >= maxY) {
            if (store.q) {
                store.search(store.nextPageToken);
            } else {
                store.loadActivities(store.nextPageToken);
            }
        }
    }, 0);
}

export default Activities;

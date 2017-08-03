import * as React from 'react';
import debounce = require('lodash/debounce');
import { observer } from 'mobx-react';
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
import { shows } from '../../utils/shows';

const store = new ActivitiesStore(channel.RBTV);

interface ActivitiesStoreProps {
    appStore: AppStore;
}

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
export class Activities extends React.Component<ActivitiesStoreProps> {
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
                    {isLoading && <Spinner />}
                    {error && this.renderError()}
                    {!isLoading &&
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
                    items={shows}
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
        const show = shows.find(show => show.title === val);

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
        this.props.appStore.navigate(`/video/${id}`);
    };

    private onClickTag = (tag: string): void => {
        store.q = tag;
        store.search();
    };

    private onScroll = debounce(() => {
        if(scrollY === document.body.scrollHeight - innerHeight) {
            store.loadActivities(store.nextPageToken);
        }
    }, 16);
}

export default Activities;

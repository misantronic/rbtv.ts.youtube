import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { ActivitiesStore } from './store';
import { AppStore } from '../../store';
import { ActivityItem } from './activity-item';
import { InputAutocomplete } from '../../components/input-autocomplete';
import { Select } from '../../components/select';
import { Spinner } from '../../components/spinner';
import { channel, getChannelName } from '../../utils/channels';
import { shows } from '../../utils/shows';

const store = new ActivitiesStore(channel.RBTV);

interface ActivitiesStoreProps {
    appStore: AppStore;
}

const ActivitiesWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const StyledActivityItem = styled(ActivityItem)`
    width: calc(33.3% - 17px);
    margin: 0 25px 25px 0;

    &:nth-child(3n + 3) {
        margin-right: 0;
    }
`;

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
    render(): JSX.Element {
        const { items, isLoading } = store;

        return (
            <div>
                {this.renderSearch()}
                <ActivitiesWrapper>
                    {isLoading && <Spinner />}
                    {!isLoading &&
                        items.map((item: yt.ActivitiyItem) => {
                            return (
                                <StyledActivityItem
                                    key={item.id}
                                    title={item.snippet.title}
                                    description={item.snippet.description}
                                    duration={item.duration}
                                    publishedAt={item.snippet.publishedAt}
                                    image={item.snippet.thumbnails.high.url}
                                    onClick={() => this.onClickActivity(item.id)}
                                />
                            );
                        })}
                </ActivitiesWrapper>
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
        this.props.appStore.redirect('video/:id', { id });
    };
}

export default Activities;

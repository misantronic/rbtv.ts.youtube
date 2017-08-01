import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { ActivitiesStore } from './store';
import { AppStore } from '../../store';
import { ActivityItem } from './activity-item';
import { InputAutocomplete } from '../../components/input-autocomplete';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Select } from '../../components/select';
import { Spinner } from '../../components/spinner';
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
    render(): JSX.Element {
        const { items, isLoading } = store;

        return (
            <div>
                {this.renderSearch()}
                <ColumnContainer>
                    {isLoading && <Spinner />}
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
                                        onClick={() => this.onClickActivity(item.id)}
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

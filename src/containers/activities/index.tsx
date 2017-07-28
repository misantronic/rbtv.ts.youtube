import * as React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { ActivitiesStore, ActivitiyItem } from './store';
import { ActivityItem } from './activity-item';
import { InputText } from '../../components/input-text';
import { Select } from '../../components/select';
import { Spinner } from '../../components/spinner';
import { Channel, getChannelName } from '../../utils/channels';

const store = new ActivitiesStore();

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

const SearchInput = styled(InputText)``;

const StyledSelect = styled(Select)`
    .Select-control {
        border-left: none;
    }
`;

@observer
export class Activities extends React.Component {
    render(): JSX.Element {
        const { items, isLoading } = store;

        return (
            <div>
                {this.renderSearch()}
                <ActivitiesWrapper>
                    {isLoading && this.renderLoader()}
                    {!isLoading &&
                        items.map((item: ActivitiyItem) => {
                            return (
                                <StyledActivityItem
                                    key={item.id}
                                    title={item.snippet.title}
                                    description={item.snippet.description}
                                    id={item.id}
                                    duration={item.duration}
                                    publishedAt={item.snippet.publishedAt}
                                    image={item.snippet.thumbnails.high.url}
                                />
                            );
                        })}
                </ActivitiesWrapper>
            </div>
        );
    }

    private renderSearch(): JSX.Element {
        const placeholder = `Search ${getChannelName(store.channelId)}...`;
        const options = Object.keys(Channel).map((key: Channel) => ({
            value: Channel[key],
            label: getChannelName(Channel[key])
        }));

        return (
            <SearchWrapper>
                <SearchInput value={store.q} onChange={this.onSearch} placeholder={placeholder} />
                <StyledSelect
                    value={store.channelId}
                    options={options}
                    simpleValue
                    clearable={false}
                    onChange={this.onChangeChannel as any}
                />
            </SearchWrapper>
        );
    }

    private renderLoader(): JSX.Element {
        return <Spinner />;
    }

    private onSearch = (val: string): void => {
        store.q = val;
    };

    private onChangeChannel = (val: Channel): void => {
        store.channelId = val;
        store.q = '';
    };
}

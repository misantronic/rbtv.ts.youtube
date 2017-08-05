import * as React from 'react';
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
import { Button } from '../../components/button';
import { channel, getChannelName } from '../../utils/channels';
import { shows, Show } from '../../utils/shows';
import { beans } from '../../utils/beans';

const autocompleteItems = ([] as Show[]).concat(shows, beans);

interface ActivitiesStoreProps {}
interface ActivitiesStoreState {
    store: ActivitiesStore;
    showBtnToTop: boolean;
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

const BtnToTop = styled(Button)`
    position: fixed;
    right: 10px;
    bottom: 10px;
`;

@observer
@External()
export class Activities extends React.Component<ActivitiesStoreProps, ActivitiesStoreState> {
    @Inject() private appStore: AppStore;

    constructor(props) {
        super(props);

        this.state = {
            store: new ActivitiesStore(channel.RBTV),
            showBtnToTop: false
        };
    }

    componentDidMount() {
        addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
    }

    render(): JSX.Element {
        const { items, showLoader } = this.state.store;
        const { showBtnToTop } = this.state;

        return (
            <div>
                {this.renderSearch()}
                <ColumnContainer>
                    {this.renderError()}
                    {!showLoader &&
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
                    {showLoader && <Spinner />}
                </ColumnContainer>
                {showBtnToTop && <BtnToTop onClick={this.onScrollToTop}>To Top</BtnToTop>}
            </div>
        );
    }

    private renderSearch(): JSX.Element {
        const { store } = this.state;
        const placeholder = `Search ${getChannelName(store.channelId || channel.RBTV)}...`;
        const options = Object.keys(channel).map((key: channel) => ({
            value: channel[key],
            label: getChannelName(channel[key])
        }));

        return (
            <SearchWrapper>
                <StyledAutocomplete
                    value={store.q}
                    items={autocompleteItems}
                    placeholder={placeholder}
                    onChange={this.onSearch}
                    onKeyDown={this.onKeyDown}
                    onClear={this.onAutocompleteClear}
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
        const { error } = this.state.store;

        if (!error) return null;

        return (
            <Column>
                <Error>
                    {error}
                </Error>
            </Column>
        );
    }

    private onSearch = (val: string): void => {
        const { store } = this.state;
        const show = autocompleteItems.find(show => show.title === val);

        if (show && show.channel) {
            this.onChangeChannel(show.channel);
        }

        store.q = val;
    };

    private onKeyDown = (e: any): void => {
        const { store } = this.state;

        if (e.keyCode === 13) {
            store.search();
        }
    };

    private onChangeChannel = (val: channel): void => {
        this.state.store.channelId = val;
    };

    private onClickActivity = (id: string) => {
        this.appStore.navigate(`/video/${id}`);
    };

    private onAutocompleteClear = () => {
        this.state.store.q = '';
    };

    private onClickTag = (tag: string): void => {
        const { store } = this.state;

        store.q = tag;
        store.search();
    };

    private onScrollToTop = () => {
        scrollTo(0, 0);
    };

    private onScroll = () => {
        const { store } = this.state;
        const { isLoading, nextPageToken } = store;
        const maxY = document.body.scrollHeight - innerHeight - 800;

        if (!isLoading && nextPageToken && scrollY >= maxY) {
            if (store.q) {
                store.search(store.nextPageToken);
            } else {
                store.loadActivities(store.nextPageToken);
            }
        }

        this.setState({ showBtnToTop: scrollY > innerHeight });
    };
}

export default Activities;

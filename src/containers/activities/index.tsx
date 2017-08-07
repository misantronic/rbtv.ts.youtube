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
            store: new ActivitiesStore()
        };
    }

    componentDidMount() {
        addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);
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
        const { store } = this.state;
        const placeholder = `Search ${getChannelName(store.channelId || channel.RBTV)}...`;
        const options = Object.keys(channel).map((key: channel) => ({
            value: channel[key],
            label: getChannelName(channel[key])
        }));

        return (
            <SearchWrapper key="search">
                <StyledAutocomplete
                    value={store.typedQ}
                    items={autocompleteItems}
                    placeholder={placeholder}
                    onChange={this.onSearchChange}
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

    private renderColumns(): JSX.Element | null {
        const { items, showLoader } = this.state.store;

        if (showLoader) {
            return null;
        }

        return (
            <ColumnContainer key="column-container">
                {this.renderError()}
                {items.map((item: youtube.ActivitiyItem) => {
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
        );
    }

    private renderBtnToTop(): JSX.Element | false {
        const { showBtnToTop } = this.state.store;

        return (
            showBtnToTop &&
            <BtnToTop key="btn-to-top" onClick={this.onScrollToTop} gradient>
                To Top
            </BtnToTop>
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

    private renderSpinner() {
        const { showLoader } = this.state.store;

        return showLoader && <Spinner key="spinner" />;
    }

    private renderEmpty(): string | null {
        const { isLoading, items } = this.state.store;

        if (!isLoading && items.length === 0) {
            return 'No results.';
        }

        return null;
    }

    private onSearchChange = (val: string): void => {
        const { store } = this.state;
        const show = autocompleteItems.find(show => show.title === val);

        if (show && show.channel) {
            this.onChangeChannel(show.channel);
        }

        store.typedQ = val;
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
        this.state.store.typedQ = '';
    };

    private onClickTag = (tag: string): void => {
        const { store } = this.state;

        store.typedQ = tag;
        store.search();
    };

    private onScrollToTop = () => scrollTo(0, 0);

    private onScroll = () => {
        const { store } = this.state;
        const { isLoading, nextPageToken, typedQ } = store;
        const maxY = document.body.scrollHeight - innerHeight - 800;

        if (!isLoading && nextPageToken && scrollY >= maxY) {
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

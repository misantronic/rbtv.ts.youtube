import * as React from 'react';
import { observer } from 'mobx-react';
// import * as Infinite from 'react-infinite';
import { external, inject } from 'tsdi';
import styled from 'styled-components';
import { AppStore } from '../../store';
import { PlaylistsStore } from './store';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { Error } from '../../components/error';
import { Spinner } from '../../components/spinner';
import { Button } from '../../components/button';
import { channel } from '../../utils/channels';
import { baseUrl } from '../../utils/ajax';
import { PlaylistItem } from './playlist-item';
import { Search } from '../search';

const store = new PlaylistsStore();
const autocompleteItems = [];

const BtnToTop = styled(Button)`
    position: fixed;
    right: 10px;
    bottom: 10px;
`;

@external
@observer
export class Playlists extends React.Component {
    @inject private appStore: AppStore;

    componentDidMount() {
        addEventListener('scroll', this.onScroll);

        store.loadPlaylists();
    }

    componentWillUnmount() {
        removeEventListener('scroll', this.onScroll);

        store.reset();
    }

    render(): any {
        return [this.renderSearch(), this.renderColumns(), this.renderSpinner(), this.renderBtnToTop()];
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
        const { filteredItems, loading, hideItemsWhenLoading } = store;

        if (loading && hideItemsWhenLoading) {
            return null;
        }

        return (
            <ColumnContainer key="column-container">
                {this.renderError()}
                {filteredItems.map((item: youtube.PlaylistItem) => {
                    const { title, thumbnails, description } = item.snippet;
                    const { itemCount } = item.contentDetails;
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
                            <PlaylistItem
                                id={item.id}
                                description={description}
                                count={itemCount}
                                image={image}
                                title={title}
                                onClick={this.onClickPlaylist}
                            />
                        </Column>
                    );
                })}
            </ColumnContainer>
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
        const { loading } = store;

        return loading && <Spinner key="spinner" />;
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

    private onClickPlaylist = (id: string) => {
        this.appStore.navigate(`/playlist/${id}`);
    };

    private onChangeSearch = (val: string): void => {
        // const show = autocompleteItems.find(show => show.title === val);

        // if (show && show.channel) {
        //     this.onChangeChannel(show.channel);
        // }

        store.typedQ = val;
    };

    private onKeyDown = (e: any): void => {
        if (e.keyCode === 13) {
            this.appStore.navigate(`/playlists/${store.typedQ}`);
        }
    };

    private onChangeChannel = (val: channel) => (store.channelId = val);

    private onAutocompleteClear = () => (store.typedQ = '');

    private onScrollToTop = () => scrollTo(0, 0);

    private onScroll = () => {
        store.showBtnToTop = scrollY > innerHeight;
    };
}

export default Playlists;

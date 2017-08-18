import * as React from 'react';
import { Column, ColumnContainer } from '../../components/responsive-column';
import { InputAutocomplete } from '../../components/input-autocomplete';
import { Select } from '../../components/select';
import { channel, getChannelName } from '../../utils/channels';

interface SearchProps {
    value: string;
    channelId: channel | undefined;
    autocompleteItems: any[];
    onSearchChange(val: string): void;
    onChannelChange(val: channel): void;
    onAutocompleteClear(): void;
    onKeyDown(e: any): void;
}

export class Search extends React.PureComponent<SearchProps> {
    public render() {
        const {
            autocompleteItems,
            channelId,
            value,
            onKeyDown,
            onChannelChange,
            onSearchChange,
            onAutocompleteClear
        } = this.props;
        const placeholder = `Search ${getChannelName(channelId || channel.RBTV)}...`;
        const options = Object.keys(channel).map((key: channel) => ({
            value: channel[key],
            label: getChannelName(channel[key])
        }));

        return (
            <ColumnContainer key="search">
                <Column sm={12} md={8}>
                    <InputAutocomplete
                        value={value}
                        items={autocompleteItems}
                        placeholder={placeholder}
                        onChange={onSearchChange}
                        onKeyDown={onKeyDown}
                        onClear={onAutocompleteClear}
                        autofocus
                    />
                </Column>
                <Column sm={12} md={4}>
                    <Select
                        value={channelId}
                        options={options}
                        simpleValue
                        searchable={false}
                        clearable={false}
                        onChange={onChannelChange as any}
                    />
                </Column>
            </ColumnContainer>
        );
    }
}

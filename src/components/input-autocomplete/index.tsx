import * as React from 'react';
import styled from 'styled-components';
import { InputText, InputTextProps } from '../input-text';

export interface AutocompleteItem {
    title: string;
}

interface InputAutocompleteProps extends InputTextProps {
    items: AutocompleteItem[];
    onClear?(): void;
}

interface InputAutocompleteState {
    valueWidth: number;
    filteredItems: AutocompleteItem[];
    autocompleteIndex: number;
}

const Wrapper = styled.div`
    position: relative;
    flex: 1;
`;

const AutocompleteContainer = styled.div`
    position: absolute;
    top: 10px;
    pointer-events: none;
    color: grey;
    white-space: pre;
`;

const Clearer = styled.button`
    position: absolute;
    top: 1px;
    right: 0;
    padding: 0 10px;
    font-size: 30px;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    background: none;
    border: none;
    font-weight: lighter;

    &:hover {
        color: #777;
    }
`;

export class InputAutocomplete extends React.PureComponent<InputAutocompleteProps, InputAutocompleteState> {
    el: HTMLCanvasElement;

    constructor(props: InputAutocompleteProps) {
        super(props);

        this.state = {
            valueWidth: 0,
            filteredItems: [],
            autocompleteIndex: 0
        };
    }

    public render(): JSX.Element {
        const { value, onClear } = this.props;
        const showClearer = !!value && !!onClear;

        return (
            <Wrapper>
                <InputText {...this.props} onChange={this.onChange} onKeyDown={this.onKeyDown} />
                {showClearer && <Clearer onClick={this.onClear}>×</Clearer>}
                {this.renderAutocomplete()}
            </Wrapper>
        );
    }

    private renderAutocomplete(): JSX.Element | null {
        const { value } = this.props;
        const { filteredItems, autocompleteIndex } = this.state;
        const title =
            filteredItems.length && filteredItems[autocompleteIndex]
                ? filteredItems[autocompleteIndex].title.substr(value.length)
                : '';

        return (
            <div>
                <AutocompleteContainer style={{ left: this.state.valueWidth }}>
                    {title}
                </AutocompleteContainer>
                <canvas width="700" height="30" ref={this.onCanvas} style={{ display: 'none' }} />
            </div>
        );
    }

    private onCanvas = (el: HTMLCanvasElement): void => {
        this.el = el;
    };

    private onChange = (value: string): void => {
        if (this.el) {
            let filteredItems: AutocompleteItem[] = [];
            const ctx = this.el.getContext('2d');

            if (value) {
                filteredItems = this.props.items.filter(item => new RegExp('^' + value, 'i').test(item.title));
            }

            if (ctx) {
                ctx.clearRect(0, 0, 700, 30);
                ctx.font = '14px Raleway';
                ctx.fillText(value, 1, 1);

                const valueWidth = ctx.measureText(value).width + 13;

                this.setState({ valueWidth, filteredItems, autocompleteIndex: 0 });
            }
        }

        this.props.onChange(value);
    };

    private onClear = (): void => {
        const { onClear } = this.props;

        this.setState({ valueWidth: 0, filteredItems: [], autocompleteIndex: 0 });
        onClear && onClear();
    };

    private onKeyDown = (e: any): void => {
        const { onKeyDown, onChange } = this.props;
        const { filteredItems, autocompleteIndex } = this.state;
        const { keyCode } = e;

        if (keyCode === 9 && filteredItems.length) {
            // TAB
            e.preventDefault();

            const show = filteredItems[autocompleteIndex];

            onChange(show.title);
            this.onKeyDown({ keyCode: 13 });

            return;
        }

        if (keyCode === 40 && filteredItems.length) {
            // ARROW DOWN
            e.preventDefault();

            if (this.state.filteredItems[autocompleteIndex + 1]) {
                this.setState({ autocompleteIndex: autocompleteIndex + 1 });
            }
        }

        if (keyCode === 38 && filteredItems.length) {
            // ARROW UP
            e.preventDefault();

            if (this.state.filteredItems[autocompleteIndex - 1]) {
                this.setState({ autocompleteIndex: autocompleteIndex - 1 });
            }
        }

        if (onKeyDown) {
            onKeyDown(e);
        }
    };
}

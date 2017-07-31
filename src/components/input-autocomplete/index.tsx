import * as React from 'react';
import styled from 'styled-components';
import { InputText, InputTextProps } from '../input-text';
import { shows, Show } from '../../utils/shows';

interface InputAutocompleteProps extends InputTextProps {}
interface InputAutocompleteState {
    valueWidth: number;
    autocompleteShows: Show[];
    autocompleteIndex: number;
}

const Wrapper = styled.div`
    position: relative;
    flex: 1;
`;

const Autocomplete = styled.div`
    position: absolute;
    top: 10px;
    pointer-events: none;
    color: grey;
    white-space: pre;
`;

export class InputAutocomplete extends React.PureComponent<InputAutocompleteProps, InputAutocompleteState> {
    el: HTMLCanvasElement;

    constructor(props: InputAutocompleteProps) {
        super(props);

        this.state = {
            valueWidth: 0,
            autocompleteShows: [],
            autocompleteIndex: 0
        };
    }

    public render(): JSX.Element {
        return (
            <Wrapper>
                <InputText {...this.props} onChange={this.onChange} onKeyDown={this.onKeyDown} />
                {this.renderAutocomplete()}
            </Wrapper>
        );
    }

    private renderAutocomplete(): JSX.Element | null {
        const { value } = this.props;
        const { autocompleteShows, autocompleteIndex } = this.state;
        const showTitle = autocompleteShows.length
            ? autocompleteShows[autocompleteIndex].title.substr(value.length)
            : '';

        return (
            <div>
                <Autocomplete style={{ left: this.state.valueWidth }}>
                    {showTitle}
                </Autocomplete>
                <canvas width="700" height="30" ref={this.onCanvas} style={{ display: 'none' }} />
            </div>
        );
    }

    private onCanvas = (el: HTMLCanvasElement): void => {
        this.el = el;
    };

    private onChange = (value: string): void => {
        if (this.el) {
            let autocompleteShows: Show[] = [];
            const ctx = this.el.getContext('2d');

            if (value) {
                autocompleteShows = shows.filter(show => new RegExp('^' + value, 'i').test(show.title));
            }

            if (ctx) {
                ctx.clearRect(0, 0, 700, 30);
                ctx.font = '14px Raleway';
                ctx.fillText(value, 1, 1);

                const valueWidth = ctx.measureText(value).width + 13;

                this.setState({ valueWidth, autocompleteShows });
            }
        }

        this.props.onChange(value);
    };

    private onKeyDown = (e: any): void => {
        const { onKeyDown, onChange } = this.props;
        const { autocompleteShows, autocompleteIndex } = this.state;
        const { keyCode } = e;

        if (keyCode === 9 && autocompleteShows.length) {
            // TAB
            e.preventDefault();

            const show = autocompleteShows[autocompleteIndex];

            onChange(show.title);
            this.onKeyDown({ keyCode: 13 });

            return;
        }

        if (keyCode === 40 && autocompleteShows.length) {
            // ARROW DOWN
            e.preventDefault();

            if (this.state.autocompleteShows[autocompleteIndex + 1]) {
                this.setState({ autocompleteIndex: autocompleteIndex + 1 });
            }
        }

        if (keyCode === 38 && autocompleteShows.length) {
            // ARROW UP
            e.preventDefault();

            if (this.state.autocompleteShows[autocompleteIndex - 1]) {
                this.setState({ autocompleteIndex: autocompleteIndex - 1 });
            }
        }

        if (onKeyDown) {
            onKeyDown(e);
        }
    };
}

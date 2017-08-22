import * as React from 'react';

interface LazyLoadingProps {
    id?: string;
}

interface LazyLoadingState {
    lazyLoad?: boolean;
}

const loadedIds: string[] = [];

export function lazyLoading(Component: React.ComponentClass<LazyLoadingState>): any {
    return class LazyLoading extends React.PureComponent<LazyLoadingProps, LazyLoadingState> {
        private el: HTMLElement | null;

        constructor(props) {
            super(props);

            // check pool of loaded ids for current props.id
            const isLoaded = !!this.props.id && loadedIds.indexOf(this.props.id) !== -1;

            this.state = {
                lazyLoad: isLoaded
            };
        }

        public componentDidMount() {
            addEventListener('scroll', this.onScroll);
        }

        public componentWillUnmount() {
            removeEventListener('scroll', this.onScroll);
        }

        public render(): JSX.Element {
            return (
                <div ref={this.onEl}>
                    <Component lazyLoad={this.state.lazyLoad} {...this.props} />
                </div>
            );
        }

        private checkScrolling(): void {
            if (this.el && this.el.offsetTop <= scrollY + innerHeight * 2) {
                this.setState({ lazyLoad: true }, () => {
                    if (this.props.id) {
                        loadedIds.push(this.props.id);
                    }

                    this.componentWillUnmount();
                });
            }
        }

        private onEl = (el: HTMLDivElement | null) => {
            this.el = el;

            this.checkScrolling();
        };

        private onScroll = () => this.checkScrolling();
    };
}

import * as React from 'react';

interface LazyLoadingState {
    lazyLoad?: boolean;
}

export function lazyLoading(Component: React.ComponentClass<LazyLoadingState>): any {
    return class LazyLoading extends React.PureComponent<{}, LazyLoadingState> {
        private el: HTMLElement | null;

        constructor(props) {
            super(props);

            this.state = {
                lazyLoad: false
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
                this.setState({ lazyLoad: true });

                this.componentWillUnmount();
            }
        }

        private onEl = (el: HTMLDivElement | null) => {
            this.el = el;

            this.checkScrolling();
        }

        private onScroll = () => this.checkScrolling();
    };
}

import * as React from 'react';

interface LazyLoadingState {
    lazyLoad?: boolean;
}

export function lazyLoading(Component: React.ComponentClass<LazyLoadingState>): any {
    return class LazyLoading extends React.PureComponent<{}, LazyLoadingState> {
        el: HTMLElement | null;

        constructor(props) {
            super(props);

            this.state = {
                lazyLoad: false
            };
        }

        componentDidMount() {
            addEventListener('scroll', this.onScroll);
        }

        componentWillUnmount() {
            removeEventListener('scroll', this.onScroll);
        }

        render(): JSX.Element {
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
        };

        private onScroll = () => this.checkScrolling();
    };
}

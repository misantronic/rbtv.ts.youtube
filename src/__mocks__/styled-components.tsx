import * as React from 'react';
import domElements from './utils/dom-elements';

type StyledInterface = (Component: React.ReactNode) => () => React.ReactNode;

const styled: StyledInterface = (Component: React.ReactNode) => {
    return () => Component;
};

const keyframes = (str: string) => str;

domElements.forEach(domElement => ((styled as any)[domElement] = styled(domElement)));

export { keyframes };
export default styled;

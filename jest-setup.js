/* eslint-disable no-undef */
require('jest-enzyme/lib/index');

jest.mock('styled-components');

// start the dependency injection container before tests
// and clear afterwards
const TSDI = require('tsdi').TSDI;

beforeEach(() => {
    tsdi = new TSDI();
    tsdi.enableComponentScanner();
});
afterEach(() => tsdi.close());

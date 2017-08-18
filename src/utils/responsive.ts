import { component as injectable } from 'tsdi';

export const sizeSm = {
    max: 599
};

export const sizeMd = {
    min: sizeSm.max + 1,
    max: 1199
};

export const sizeLg = {
    min: sizeMd.max + 1
};

export const sizeApp = {
    max: 1034
};

@injectable
export class Responsive {
    sizeSm = sizeSm;
    sizeMd = sizeMd;
    sizeLg = sizeLg;
    sizeApp = sizeApp;
}

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
    public sizeSm = sizeSm;
    public sizeMd = sizeMd;
    public sizeLg = sizeLg;
    public sizeApp = sizeApp;
}

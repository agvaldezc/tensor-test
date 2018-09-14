import { Tensor1D } from '@tensorflow/tfjs';

export interface IDataSet {
    xVector: Tensor1D;
    yVector: Tensor1D;
}

export class DataSet {
    data: IDataSet;

    constructor(data: IDataSet) {
        this.data = data;
    }

    debugDataSet() {
        Object.keys(this.data).map((key) => {
        console.log(key);
        this.data[key].print(true);
      });
    }
}

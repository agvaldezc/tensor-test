import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { IDataSet } from '../helpers';
import { Scalar, Tensor1D } from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  constructor() { }

  generateTrainingData(points: number, coefficients: any, sigma = 0.04): IDataSet {
    return tf.tidy(() => {
      // Generate scalars of the coefficients that Tensorflow understands
      const a: Scalar = tf.scalar(coefficients.a);
      const b: Scalar = tf.scalar(coefficients.b);
      const c: Scalar = tf.scalar(coefficients.c);
      const d: Scalar = tf.scalar(coefficients.d);

      // Generate random points between -1 and 1 using Tensorflow Tensors
      const xs: Tensor1D = tf.randomUniform([points], -1, 1);

      // Generate labels of the points created before
      // Using the form ax^3 + bx^2 + cx + d
      const ys: Tensor1D = a.mul(xs.pow(tf.scalar(3)))
        .add(b.mul(xs.square()))
        .add(c.mul(xs))
        .add(d)
        .add(tf.randomNormal([points], 0, sigma));

      // Get min, max, range to normalize label data
      const yMin: Scalar = ys.min();
      const yMax: Scalar = ys.max();
      const yRange: Scalar = yMax.sub(yMin);
      const ysNormalized: Tensor1D = ys.sub(yMin).div(yRange);

      return {
        xVector: xs,
        yVector: ysNormalized
      };
    });
  }
}

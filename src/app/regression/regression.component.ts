import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as tf from '@tensorflow/tfjs';
import { IDataSet, DataSet } from '../helpers';
import { Tensor1D, Scalar, Tensor, Rank, Variable } from '@tensorflow/tfjs';
import { DataGeneratorService } from '../services/data-generator.service';

@Component({
  selector: 'app-regression',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.scss']
})
export class RegressionComponent implements OnInit {

  linearModel: tf.Sequential;
  prediction: any;
  trainingDataChart: Chart;
  beforeTrainingChart: Chart;
  afterTrainingChart: Chart;
  trainingData: DataSet;
  testData: DataSet;
  realCoefficients = { a: -.8, b: -.2, c: .9, d: .5 };
  a: Variable = tf.variable(tf.scalar(Math.random()));
  b: Variable = tf.variable(tf.scalar(Math.random()));
  c: Variable = tf.variable(tf.scalar(Math.random()));
  d: Variable = tf.variable(tf.scalar(Math.random()));
  numIterations = 75;
  learningRate = 0.5;
  optimizer = tf.train.sgd(this.learningRate);

  constructor(private _dataGeneratorService: DataGeneratorService) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    this.generateTrainingData();
    this.generateCharts();
    // this.trainModel();
  }

  // Generate training data
  generateTrainingData(): void {
    this.trainingData = new DataSet(
      this._dataGeneratorService.generateTrainingData(400, this.realCoefficients)
    );
    this.trainingData.debugDataSet();
  }

  // Takes a 1 Dimensional Tensor and applies the function
  //    to all elements of the Tensor (ax^3 + bx^2 + cx + d)
  predict(x: Tensor1D): Tensor1D {
    return tf.tidy(() => {
      return this.a.mul(x.pow(tf.scalar(3)))
            .add(this.b.mul(x.square()))
            .add(this.c.mul(x))
            .add(this.d);
    });
  }

  // Calculate the mean square error of the predictions against
  loss(predictions: Tensor1D, ys: Tensor1D): Scalar {
    const error = predictions.sub(ys).square().mean();
    return error as Scalar;
  }

  async train(xsTraining: Tensor1D, ysTraining: Tensor1D, iterations: Number) {
    for (let i = 0; i < iterations; i++) {
      this.optimizer.minimize(() => {
        const pred = this.predict(xsTraining);
        return this.loss(pred, this.trainingData.data.yVector);
      });

      await tf.nextFrame();
    }
  }

  async generateCharts() {
    const xsTraining = Array.from(this.trainingData.data.xVector.dataSync());
    const ysTraining = Array.from(this.trainingData.data.yVector.dataSync());

    const trainingPoints = xsTraining.map((x, index) => {
      return { x: x, y: ysTraining[index] };
    });
    const canvas = document.getElementById('data-chart');
    console.log('Canvas is', canvas);

    // Plot training data sets
    this.trainingDataChart = new Chart('training-data-chart', {
      data: {
        datasets: [
          {
            type: 'scatter',
            label: 'Training Data',
            data: trainingPoints,
            showLine: false,
            pointBackgroundColor: '#0000ff'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom'
            }
          ],
          yAxes: [
            {
              type: 'linear'
            }
          ]
        }
      }
    });

    const beforeTrainingPredictions = Array.from(this.predict(this.trainingData.data.xVector).dataSync());
    const beforeTrainingPoints = xsTraining.map((x, index) => {
      return {x: x, y: beforeTrainingPredictions[index]};
    });

    this.beforeTrainingChart = new Chart('before-data-chart', {
      data: {
        datasets: [
          {
            type: 'scatter',
            label: 'Training Data',
            data: trainingPoints,
            showLine: false,
            pointBackgroundColor: '#0000ff'
          },
          {
            type: 'scatter',
            label: 'Before training predictions',
            data: beforeTrainingPoints,
            showLine: false,
            backgroundColor: '#ffff00'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom'
            }
          ],
          yAxes: [
            {
              type: 'linear',
              position: 'bottom'
            }
          ]
        }
      }
    });

    await this.train(this.trainingData.data.xVector, this.trainingData.data.yVector, this.numIterations);

    const afterTrainingPredictions = Array.from(this.predict(this.trainingData.data.xVector).dataSync());
    const afterTrainingPoints = xsTraining.map((x, index) => {
      return {x: x, y: afterTrainingPredictions[index]};
    });

    this.beforeTrainingChart = new Chart('trained-data-chart', {
      data: {
        datasets: [
          {
            type: 'scatter',
            label: 'Training Data',
            data: trainingPoints,
            showLine: false,
            pointBackgroundColor: '#0000ff'
          },
          {
            type: 'scatter',
            label: 'After training predictions',
            data: afterTrainingPoints,
            showLine: false,
            backgroundColor: '#ff0000'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom'
            }
          ],
          yAxes: [
            {
              type: 'linear',
              position: 'bottom'
            }
          ]
        }
      }
    });
  }
}

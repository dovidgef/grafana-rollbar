import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  resolution: number;
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    console.log('instance', instanceSettings.url);
    this.url = instanceSettings.url;
    this.resolution = instanceSettings.jsonData.resolution || 1000.0;
  }

  async getHealth() {
    const result = await getBackendSrv().datasourceRequest({
      url: this.url + '/rollbar',
    });

    return result;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', type: FieldType.time },
          { name: 'Value', type: FieldType.number },
        ],
      });
      // duration of the time range, in milliseconds.
      const duration = to - from;
      // step determines how close in time (ms) the points will be to each other.
      const step = duration / this.resolution;
      for (let t = 0; t < duration; t += step) {
        frame.add({ Time: from + t, Value: Math.sin((2 * Math.PI * query.frequency * t) / duration) });
      }
      return frame;
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    try {
      const response = await this.getHealth();
      console.log('Checking health', response);

      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: 'Error',
        };
      }
    } catch (e) {
      console.error(e);
      return {
        status: 'error',
        message: 'Error',
      };
    }
  }
}

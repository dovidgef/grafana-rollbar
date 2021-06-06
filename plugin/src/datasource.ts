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
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    // console.log('instance', instanceSettings.url);
    this.url = instanceSettings.url;
  }

  async getOccurrences(bucket_size = 60) {
    return await getBackendSrv().datasourceRequest({
      url: this.url + '/rollbar/reports/occurrence_counts',
      params: { bucket_size },
    });
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    console.log('Query options', JSON.stringify(options));
    const data = options.targets.map(async target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', type: FieldType.time },
          { name: 'Value', type: FieldType.number },
        ],
      });
      const res = await this.getOccurrences(query.frequency.value);
      const points = res.data.result.map((p: number[]) => {
        // Convert to millisecond timestamp
        return [p[0] * 1000, p[1]];
      });
      const matchingDatapoints = points.filter((p: number[]) => {
        const t = p[0];
        // console.log(`from: ${from}, to: ${to}, point t: ${t}, point array: ${p}`);
        return t >= from && t <= to;
      });
      // console.log('matching:', matchingDatapoints);
      for (const point of matchingDatapoints) {
        frame.add({ Time: point[0], Value: point[1] });
      }
      return frame;
    });

    return Promise.all(data).then(data => ({ data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    try {
      const response = await this.getOccurrences();
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

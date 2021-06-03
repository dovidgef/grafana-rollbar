import { DataQuery, DataSourceJsonData, SelectableValue } from '@grafana/data';

export interface MyQuery extends DataQuery {
  frequency: SelectableValue;
}

export const defaultQuery: Partial<MyQuery> = {
  frequency: { label: 'Minute', value: 60 },
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
  resolution?: number;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

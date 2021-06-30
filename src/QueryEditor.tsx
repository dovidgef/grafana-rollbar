import defaults from 'lodash/defaults';

import React, { PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { Select } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onFrequencyChange = (v: SelectableValue<any>) => {
    const { onChange, query, onRunQuery } = this.props;
    console.log('onFrequencyChange:', query);
    onChange({ ...query, frequency: v });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { frequency } = query;
    const selectOptions = [
      { label: 'Minute', value: 60 },
      { label: 'Hour', value: 3600 },
      { label: 'Day', value: 86400 },
    ];

    return (
      <div className="gf-form">
        <Select width={6} options={selectOptions} value={frequency} onChange={this.onFrequencyChange} />
      </div>
    );
  }
}

## Rollbar API endpoint
https://api.rollbar.com/api/1/reports/occurrence_counts

## Docker testing environment
`docker run -d -p 3000:3000 -v "$(pwd)"/plugin:/var/lib/grafana/plugins --name=grafana grafana/grafana:7.0.0`

## Restart container to reload changes: `docker restart grafana`

## Deploy Plugin (private)
1. Create API key on Grafana.com with PluginPublisher role `export GRAFANA_API_KEY=<YOUR_API_KEY>`
2. Build plugin `yarn build`
2. Run `grafana-toolkit plugin:sign --rootUrls 'https://mcres.grafana.net,http://localhost:3000'`
3. Zip plugin `zip rollbar-plugin.zip dist -r`

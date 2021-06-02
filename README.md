## Rollbar API endpoint
https://api.rollbar.com/api/1/reports/occurrence_counts

## Docker testing environment
`docker run -d -p 3000:3000 -v "$(pwd)"/plugin:/var/lib/grafana/plugins --name=grafana grafana/grafana:7.0.0`

## Restart container to reload changes: `docker restart grafana`

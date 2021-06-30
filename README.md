# Rollbar Data Source Plugin

This datasource allows you to track [Rollbar](https://rollbar.com) error occurrences.

It allows you to choose frequency of reporting by minutes, hours, or days.

## Setup
In order to use this plugin you will need to generate a Project Access Token

1. Login to your Rollbar account
2. Navigate to Settings > Choose Project > Project Access Tokens > Create Access Token
3. Make sure to give the token `read` access 
4. Copy the token 
5. Install the Rollbar Datasource in your Grafana instance
6. Save the token in the API Key section of its config

## Usage
1. Add a new Panel
2. In the Query section choose Rollbar
3. Select frequency (minute/day/hour) from drop down menu
4. Enjoy



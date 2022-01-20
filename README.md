# Hive HTTP Proxy
[![Hive HTTP Proxy CI](https://github.com/SESARLab/hive-http-proxy/actions/workflows/ci.yml/badge.svg)](https://github.com/SESARLab/hive-http-proxy/actions/workflows/ci.yml)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/gabrieledarrigo/hive-http-proxy)

Hive HTTP Proxy exposes a single POST endpoint to run Hive SQL DDL/DML statements.  
This application was primarily designed to run JMeter HTTP load testing against Apache Hive, in order to compare the results with Apache Druid, in the context of my experimental thesis on[ MIND Foods HUB](https://www.mindfoodshub.com/) Data Lake.

## Abstract

Sadly, [Apache Hive](https://hive.apache.org/) doesn't expose a set of REST API to interact with, similarly to other more recent platforms (like [Apache Druid](https://druid.apache.org/docs/latest/querying/sql.html#http-post), or [Presto](https://prestodb.io/docs/current/develop/client-protocol.html)).  
This means that a client is forced to use Hive JDBC drivers or Hive Thrift drivers to perform TCP connections.  
At the time of this writing, the only available REST API for Hive is [WebHCat](https://cwiki.apache.org/confluence/display/Hive/WebHCat), a layer on top of HCatalog, which is a table and storage management layer for Hadoop.  
While WebHCat is installed with Hive, starting with Hive release 0.11.0, its capability is quite limited;  
a client can run a Hive query or set of commands via the `http://hostname/templeton/v1/hive` endpoint, but the response contains only the ID of a job that runs on background on Hadoop, and an optional callback property, that define a URL to be called upon job completion.  
This makes it very hard to test Apache Hive with JMeter unless to configure the latter to connect to Hive via JDBC (a not so viable option due to the [configuration](https://community.cloudera.com/t5/Community-Articles/JMeter-Setup-for-Hive-Load-Testing/ta-p/247745) [difficulty](http://benn-cs.github.io/impala/2013/04/27/using-apache-jmeter-to-test-hive-through-jdbc/)).  
To solve this problem I decided to write a simple HTTP layer on top of [Javascript Hive driver](https://www.npmjs.com/package/hive-driver) to run Hive SQL statements via HTTP.

## Usage

Install application dependencies and, assuming that you have an Apache Hive instance running on your local host, run the following command:

```bash
$ HIVE_HOST=localhost HIVE_PORT=10000 HIVE_USERNAME=user HIVE_PASSWORD=password npm run start
```

With:

- `HIVE_HOST` is the hostname of the Apache Hive server (default to `localhost`)
- `HIVE_PORT` is the network port of the Apache Hive server (defaults to `10000`)
- `HIVE_USERNAME` is the username used to connect (defaults to `admin`)
- `HIVE_PASSWORD` is the related password

Hive HTTP Proxy runs on port `100001`.

A statement can be executed by doing a POST HTTP call with a JSON palyoad, containing the required `statement` property:

```bash
$ curl -X POST -d '{ "statement": "SELECT 1" }' http://localhost:10001
```

Please note that Hive HTTP Proxy doesn't do any assumption on the statement content, nor does any validation on it; it simply checks for a valid JSON and executes the statement against the configured server.

## Run in a Docker container

Hive HTTP Proxy can run as a dockerized application.

To run the container, just type:

```bash
$ docker run -e HIVE_HOST=localhost -e HIVE_PORT=10000 -e HIVE_USERNAME=user -e HIVE_PASSWORD=password -p 10001:10001 gabrieledarrigo/hive-http-proxy 
```


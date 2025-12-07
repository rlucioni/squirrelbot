# squirrelbot

A Unifi site monitor that sends Slack messages with the current state of a target host.

## Quickstart

Use [nvm](https://github.com/creationix/nvm) to install Node.js and npm:

```bash
$ nvm install
$ nvm use
```

Install dependencies:

```bash
$ npm install
```

## Testing

To test the function locally:

```bash
$ npm run serve
```

Then ping the server to invoke the function:

```bash
$ curl localhost:8080
```

## Deployment

Enable the required services:

```bash
$ make enable
```

Deploy the function to GCP:

```bash
$ make deploy
```

Schedule invocation of the function:

```bash
$ make schedule
```

Update the scheduled invocation:

```bash
$ make reschedule
```

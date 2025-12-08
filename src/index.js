import 'dotenv/config';
import functions from '@google-cloud/functions-framework';
import { WebClient } from '@slack/web-api';

functions.http('squirrelbot', async (_req, res) => {
  const TARGET_HOST_NAME = 'UCK-G2';

  const UNIFI_API_KEY = process.env.UNIFI_API_KEY;
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const SLACK_CHANNEL_ID = process.env.SLACK_CHANNEL_ID;

  if (!UNIFI_API_KEY || !SLACK_BOT_TOKEN || !SLACK_CHANNEL_ID) {
    console.error('missing environment variables');
    return res.status(500).send('config error');
  }

  const slack = new WebClient(SLACK_BOT_TOKEN);

  try {
    // https://developer.ui.com/site-manager-api/list-hosts
    const unifiResponse = await fetch('https://api.ui.com/v1/hosts', {
      method: 'GET',
      headers: {
        'X-API-KEY': UNIFI_API_KEY,
        Accept: 'application/json',
      },
    });

    if (!unifiResponse.ok) {
      await slack.chat.postMessage({
        channel: SLACK_CHANNEL_ID,
        text: `Unifi API error, status ${unifiResponse.status}`,
      });

      throw new Error(`unifi api error, status ${unifiResponse.status}`);
    }

    const data = await unifiResponse.json();
    const hosts = data.data;

    const targetHost = hosts.find(
      (host) => host.reportedState?.name === TARGET_HOST_NAME,
    );

    if (targetHost) {
      const state = targetHost.reportedState.state;

      console.info(`found host ${TARGET_HOST_NAME}, state: ${state}`);

      if (state.toLowerCase() !== 'connected') {
        await slack.chat.postMessage({
          channel: SLACK_CHANNEL_ID,
          text: `Host *${TARGET_HOST_NAME}* is currently *${state}*`,
        });
      }

      res.status(200).send(`found host, state: ${state}`);
    } else {
      console.warn(`host ${TARGET_HOST_NAME} not found`);

      await slack.chat.postMessage({
        channel: SLACK_CHANNEL_ID,
        text: `Host *${TARGET_HOST_NAME}* not found`,
      });

      res.status(404).send('host not found');
    }
  } catch (error) {
    console.error('error executing function:', error.message);

    await slack.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `Error executing function: ${error.message}`,
    });

    res.status(500).send('internal server error');
  }
});

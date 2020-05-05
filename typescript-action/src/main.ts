
import * as core from '@actions/core'
import {IncomingWebhook} from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const url: string = process.env.SLACK_WEBHOOK_URL!

    const defaults = {
      icon_emoji: ':bowtie:',
    }
    const webhook = new IncomingWebhook(url, defaults)

    await webhook.send({
      text: 'I\'ve got news for you...',
    });

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
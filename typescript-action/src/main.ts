
import * as core from '@actions/core'
import * as github from '@actions/github'
import {IncomingWebhook} from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const url: string = process.env.SLACK_WEBHOOK_URL!

    const defaults = {
      icon_emoji: ':bowtie:',
    }
    const webhook = new IncomingWebhook(url, defaults)

    const context = (github as any).context

    core.debug(JSON.stringify(context))

    const sender = context.payload.sender

    const repository = context.payload.repository
    const issue = context.payload.issue
    const comment = context.payload.comment?.body || ''

    const { sha } = github.context;
    const { owner, repo } = github.context.repo;

    await webhook.send({
      text: github.context.workflow,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: `<img src="${sender.avatar_url}"> ${sender.login}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'comment'
          }
        },
        {
          type: 'section',
          block_id: 'section567',
          text: {
            type: 'mrkdwn',
            text: '<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s.'
          },
          accessory: {
            type: 'image',
            image_url: 'https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg',
            alt_text: 'Haunted hotel image'
          }
        },
        {
          type: 'section',
          block_id: 'section789',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Average Rating*\n1.0'
            }
          ]
        }
      ]
    });

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()


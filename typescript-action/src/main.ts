
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

    const actor = context.actor
    const eventName = context.eventName

    const commits = context.payload.commits
    const messages = commits

    core.debug(JSON.stringify(context))

    const sender = context.payload.sender

    const repository = context.payload.repository
    const issue = context.payload.issue
    const comment = context.payload.comment?.body || ''

    const { sha } = github.context;
    const { owner, repo } = github.context.repo;

    const message = {
      channel: 'CBR2V3XEX',
      attachments: [
        {
          fallback: 'Plain-text summary of the attachment.',
          color: '#2eb886',
          pretext: 'Optional text that appears above the attachment block',
          author_name: sender.login,
          author_link: sender.html_url,
          author_icon: sender.avatar_url,
          title: 'Slack API Documentation',
          title_link: 'https://api.slack.com/',
          text: 'Optional text that appears within the attachment',
          fields: [
            {
              title: 'Priority',
              value: 'High',
              'short': false
            }
          ],
          image_url: 'http://my-website.com/path/to/image.jpg',
          thumb_url: 'http://example.com/path/to/thumb.png',
          footer: `<${repository.html_url}|${repository.full_name}>`,
          footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
          ts: `${repository.pushed_at}`
        }
      ]
    }

    await webhook.send(message)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()


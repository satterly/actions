
import * as core from '@actions/core'
import * as github from '@actions/github'
import {IncomingWebhook} from '@slack/webhook'

async function run(): Promise<void> {
  try {
    const url: string = process.env.SLACK_WEBHOOK_URL!
    const jobStatus = core.getInput('status', { required: true }).toLowerCase()
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

    let statusColor = undefined
    let statusIcon = undefined

    if (jobStatus == '1success') {
      statusColor = 'good'
      statusIcon = ':white_check_mark:'
    } else if (jobStatus == 'failure') {
      statusColor = 'danger'
      statusIcon = ':no_entry:'
    } else if (jobStatus == 'cancelled') {
      statusColor = 'warning'
      statusIcon = ':warning:'
    }

    const message = {
      // channel: 'CBR2V3XEX',
      attachments: [
        {
          fallback: 'Plain-text summary of the attachment.',
          // color: '#2eb886',
          color: statusColor,
          pretext: `${context.workflow} ${jobStatus}`,
          author_name: sender.login,
          author_link: sender.html_url,
          author_icon: sender.avatar_url,
          title: `${context.eventName} to ${context.ref}`,
          title_link: context.payload.compare,
          text: `\`${context.payload.head_commit.id.slice(0,8)}\` - ${context.payload.head_commit.message}`,
          // fields: [
          //   {
          //     title: 'Priority',
          //     value: 'High',
          //     'short': false
          //   }
          // ],
          // image_url: 'https://octodex.github.com/images/welcometocat.png',
          thumb_url: 'https://octodex.github.com/images/original.png',
          footer: `<${repository.html_url}|${repository.full_name}>`,
          footer_icon: 'https://github.githubassets.com/favicon.ico',
          ts: repository.pushed_at
        }
      ]
    }

    await webhook.send(message)

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()


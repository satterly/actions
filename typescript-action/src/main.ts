import * as core from '@actions/core'
import * as github from '@actions/github'
import {IncomingWebhook} from '@slack/webhook'

async function run(): Promise<void> {
  try {
    // inputs
    const url: string = process.env.SLACK_WEBHOOK_URL!
    const jobStatus = core.getInput('status', { required: true }).toLowerCase()

    // github event payload
    const context = (github as any).context
    const sender = context.payload.sender
    const repository = context.payload.repository
    const head_commit = context.payload.head_commit

    let statusColor = undefined
    let statusIcon = ':octocat:'

    if (jobStatus == 'success') {
      statusColor = 'good'
      statusIcon = ':ok_hand:'
    } else if (jobStatus == 'failure') {
      statusColor = 'danger'
      statusIcon = ':boom:'
    } else if (jobStatus == 'cancelled') {
      statusColor = 'warning'
      statusIcon = ':fire:'
    }

    const webhook = new IncomingWebhook(url)
    const message = {
      // channel: 'CBR2V3XEX',
      attachments: [
        {
          fallback: `[GitHub]: [${repository.full_name}] ${context.workflow} ${context.eventName} ${jobStatus}`,
          // color: '#2eb886',
          color: statusColor,
          pretext: `${context.workflow} ${jobStatus} ${statusIcon}`,
          author_name: sender.login,
          author_link: sender.html_url,
          author_icon: sender.avatar_url,
          title: `${context.eventName} to ${context.ref}`,
          title_link: context.payload.compare,
          text: `\`${head_commit.id.slice(0,8)}\` - ${head_commit.message}`,
          // fields: [
          //   {
          //     title: 'Priority',
          //     value: 'High',
          //     'short': false
          //   }
          // ],
          // image_url: 'https://octodex.github.com/images/welcometocat.png',
          // thumb_url: 'https://octodex.github.com/images/original.png',
          thumb_url: 'https://octodex.github.com/images/codercat.jpg',
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


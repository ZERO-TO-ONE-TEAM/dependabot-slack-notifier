import {getInput, setFailed} from '@actions/core'
import {sendAlertsToSlack, validateSlackWebhookUrl,} from './destinations'
import {context} from '@actions/github'
import {fetchAlerts} from './fetch-alerts'

async function run(): Promise<void> {
    try {
        const token = getInput('token')
        const slackWebhookUrl = getInput('slack_webhook')
        const count = parseInt(getInput('count'))
        const owner = context.repo.owner
        const repo = context.repo.repo
        const alerts = await fetchAlerts(token, repo, owner, count)
        if (alerts.length > 0) {
            if (!validateSlackWebhookUrl(slackWebhookUrl)) {
                setFailed(new Error('Invalid Slack Webhook URL'))
            } else {
                await sendAlertsToSlack(slackWebhookUrl, alerts)
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            setFailed(err)
        }
    }
}

run()
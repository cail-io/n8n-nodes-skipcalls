# n8n-nodes-skipcalls

Official [n8n](https://n8n.io) nodes for [SkipCalls](https://skipcalls.com), the AI phone receptionist that answers your calls and texts.

- **SkipCalls Trigger** starts a workflow the moment a call ends, a text arrives, or an appointment is booked.
- **SkipCalls** schedules AI outbound calls, replies to texts, and reads call history. It also works as a tool for n8n AI Agents.

## Installation

Self-hosted n8n: **Settings → Community nodes → Install**, enter `n8n-nodes-skipcalls`, and confirm. See the [n8n community nodes guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

1. In SkipCalls, open **Integrations → API Keys** ([app.skipcalls.com/integration?tab=keys](https://app.skipcalls.com/integration?tab=keys)) and create a key. API access and webhooks are part of the SkipCalls PRO plan.
2. In n8n, add a **SkipCalls API** credential and paste the key. Leave **Base URL** as `https://be.skipcalls.com`.

## SkipCalls Trigger

| Event | Fires when |
| --- | --- |
| Incoming Call Completed | Your AI receptionist finished a call (summary, caller, collected data, recording) |
| Incoming Call Failed | An incoming call dropped before the agent could handle it |
| Outbound Call Completed | An AI outbound call finished |
| Outbound Call Failed | An outbound call failed (no answer, busy, rejected, error) |
| SMS Received | A text arrived on one of your numbers |
| SMS Sent | A text was sent from one of your numbers |
| SMS Failed | An outgoing text failed to deliver |
| Appointment Booked | The AI booked an appointment on a call |
| Job Created | A call created a job in Needs you (callback, question or message to send) |
| Job Status Changed | A job was done, not needed, waiting, snoozed, back in Needs you, or expired |
| Estimate Ready | SkipCalls calculated an estimate for a job: total, line items, drafted reply |
| Estimate Sent | An estimate went out to the customer by text or email |

Pick an agent to listen to one receptionist only, or leave it empty for all. n8n registers the webhook when you activate the workflow and removes it when you deactivate it. Active triggers also appear in SkipCalls under **Integrations → n8n**, where you can pause them or change the agent.

## SkipCalls node

| Resource | Operations |
| --- | --- |
| Outbound Call | Schedule, Get, Get Many |
| Incoming Call | Get, Get Many |
| SMS | Send Reply, Get Many (conversations) |
| Agent | Get Many |
| Phone Number | Get Many |

**Schedule** queues an AI call: give the number (E.164, e.g. `+14155551234`) and the goal in plain language. Optional: agent, time to call, timezone, max duration, extra context.

**Send Reply** answers inside an existing SMS conversation from the same number. Map `sms_conversation_id` from an **SMS Received** trigger.

## Example workflows

- Incoming Call Completed → add a row to Google Sheets or create a HubSpot contact.
- New form submission → SkipCalls Schedule → the AI calls the lead within a minute.
- SMS Received → AI Agent (with the SkipCalls tool) → Send Reply.

## Compatibility

Built with `@n8n/node-cli` and tested on n8n 2.45.

## Development

```bash
pnpm install
pnpm dev     # n8n with this node linked, hot reload
pnpm lint
pnpm build
```

Releases are published to npm with provenance from GitHub Actions on version tags (`pnpm run release`).

## Support

[team@skipcalls.com](mailto:team@skipcalls.com) · [skipcalls.com](https://skipcalls.com)

## License

[MIT](LICENSE)

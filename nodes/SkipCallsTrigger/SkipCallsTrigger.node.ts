import {
	NodeConnectionTypes,
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
} from 'n8n-workflow';
import { getAgents, skipCallsRequest } from '../shared/transport';

const EVENTS = [
	{
		name: 'Appointment Booked',
		value: 'APPOINTMENT_BOOKED',
		description: 'The AI booked an appointment on a call',
	},
	{
		name: 'Estimate Ready',
		value: 'ESTIMATE_READY',
		description: 'SkipCalls calculated an estimate for a job, with total, line items and the drafted reply',
	},
	{
		name: 'Incoming Call Completed',
		value: 'INCOMING_CALL_COMPLETED',
		description: 'Your AI receptionist finished a call, with summary and collected data',
	},
	{
		name: 'Incoming Call Failed',
		value: 'INCOMING_CALL_FAILED',
		description: 'An incoming call dropped before the agent could handle it',
	},
	{
		name: 'Job Created',
		value: 'JOB_CREATED',
		description: 'A call created a job in Needs you: a callback, a question, or a message to send',
	},
	{
		name: 'Outbound Call Completed',
		value: 'CALL_COMPLETED',
		description: 'An AI outbound call finished',
	},
	{
		name: 'Outbound Call Failed',
		value: 'CALL_FAILED',
		description: 'An outbound call failed (no answer, busy, rejected, error)',
	},
	{ name: 'SMS Failed', value: 'SMS_FAILED', description: 'An outgoing text failed to deliver' },
	{ name: 'SMS Received', value: 'SMS_RECEIVED', description: 'A text arrived on your number' },
	{ name: 'SMS Sent', value: 'SMS_SENT', description: 'A text was sent from your number' },
];

export class SkipCallsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SkipCalls Trigger',
		name: 'skipCallsTrigger',
		icon: { light: 'file:skipcalls.svg', dark: 'file:skipcalls.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow on SkipCalls calls, texts and bookings',
		defaults: { name: 'SkipCalls Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'skipCallsApi', required: true }],
		webhooks: [
			{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', path: 'webhook' },
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				options: EVENTS,
				default: 'INCOMING_CALL_COMPLETED',
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				default: '',
				description:
					'Only fire for this agent. Leave empty for all agents. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	};

	methods = { loadOptions: { getAgents } };

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// SkipCalls has no "list my hooks" endpoint for API keys; a stored ID means
				// n8n created it on activation and deletes it on deactivation.
				return Boolean(this.getWorkflowStaticData('node').subscriptionId);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const body: IDataObject = {
					targetUrl: this.getNodeWebhookUrl('default'),
					event: this.getNodeParameter('event') as string,
				};
				const agentId = this.getNodeParameter('agentId', '') as string;
				if (agentId) body.agentId = agentId;

				const response = await skipCallsRequest.call(this, 'POST', '/zapier/hooks/subscribe', body);
				this.getWorkflowStaticData('node').subscriptionId = response.id;
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (!staticData.subscriptionId) return true;
				try {
					await skipCallsRequest.call(this, 'DELETE', `/zapier/hooks/${staticData.subscriptionId}`);
				} catch (error) {
					// Already gone (404) is fine; anything else should surface.
					if (error.httpCode !== '404') return false;
				}
				delete staticData.subscriptionId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return { workflowData: [this.helpers.returnJsonArray(this.getBodyData())] };
	}
}

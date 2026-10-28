import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getAgents, getSmsConversations } from '../shared/transport';
import { agentDescription, phoneNumberDescription } from './resources/account';
import { callDescription } from './resources/call';
import { incomingCallDescription } from './resources/incomingCall';
import { smsDescription } from './resources/sms';

export class SkipCalls implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SkipCalls',
		name: 'skipCalls',
		icon: { light: 'file:skipcalls.svg', dark: 'file:skipcalls.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Schedule AI phone calls, reply to texts and read call history in SkipCalls',
		defaults: { name: 'SkipCalls' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'skipCallsApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Incoming Call', value: 'incomingCall' },
					{ name: 'Outbound Call', value: 'call' },
					{ name: 'Phone Number', value: 'phoneNumber' },
					{ name: 'SMS', value: 'sms' },
				],
				default: 'call',
			},
			...callDescription,
			...incomingCallDescription,
			...smsDescription,
			...agentDescription,
			...phoneNumberDescription,
		],
	};

	methods = {
		loadOptions: { getAgents, getSmsConversations },
	};
}

import type { INodeProperties } from 'n8n-workflow';
import { unwrapList } from '../helpers';

/** Read-only lists: agents and phone numbers. */
export const agentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['agent'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many agents',
				description: 'List your AI receptionists and outbound agents',
				routing: {
					request: { method: 'GET', url: '/agents' },
					output: { postReceive: [unwrapList('agents')] },
				},
			},
		],
		default: 'getAll',
	},
];

export const phoneNumberDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['phoneNumber'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many phone numbers',
				description: 'List your SkipCalls phone numbers and the agent on each',
				routing: {
					request: { method: 'GET', url: '/numbers' },
					output: { postReceive: [unwrapList('numbers')] },
				},
			},
		],
		default: 'getAll',
	},
];

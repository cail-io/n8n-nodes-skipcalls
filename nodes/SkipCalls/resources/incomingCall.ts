import type { INodeProperties } from 'n8n-workflow';
import { unwrapList } from '../helpers';
import { limitField } from './shared';

const show = (operation: string[]) => ({ show: { resource: ['incomingCall'], operation } });

export const incomingCallDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['incomingCall'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an incoming call',
				description: 'Get one call your AI receptionist answered',
				routing: {
					request: { method: 'GET', url: '=/incoming-calls/{{$parameter.incomingCallId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many incoming calls',
				description: 'List calls your AI receptionist answered',
				routing: {
					request: { method: 'GET', url: '/incoming-calls' },
					output: { postReceive: [unwrapList('calls')] },
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Incoming Call ID',
		name: 'incomingCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['get']),
	},
	limitField('incomingCall', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: show(['getAll']),
		options: [
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				default: '',
				description:
					'Only calls answered by this agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: { send: { type: 'query', property: 'agentId' } },
			},
			{
				displayName: 'Caller Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'phoneNumber' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: ['FINISHED', 'PROCESSED', 'FAILED', 'IN_PROGRESS'].map((value) => ({
					name: value,
					value,
				})),
				default: 'PROCESSED',
				routing: { send: { type: 'query', property: 'status' } },
			},
		],
	},
];

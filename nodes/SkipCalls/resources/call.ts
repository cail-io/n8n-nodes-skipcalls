import type { INodeProperties } from 'n8n-workflow';
import { unwrapList } from '../helpers';
import { limitField } from './shared';

const show = (operation: string[]) => ({ show: { resource: ['call'], operation } });

const CALL_STATUSES = [
	'QUEUED',
	'IN_PROGRESS',
	'AWAITING_CONNECTION',
	'SUCCESS',
	'FAILED',
	'NOT_STARTED',
	'CANCELLED',
	'CALL_TRANSFERRED',
];

export const callDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['call'] } },
		options: [
			{
				name: 'Schedule',
				value: 'schedule',
				action: 'Schedule an AI outbound call',
				description:
					'Queue an AI outbound call with a goal. It dials at the given time, or right away.',
				routing: { request: { method: 'POST', url: '/calls/schedule' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an outbound call',
				description: 'Get one outbound call with its summary and recording',
				routing: { request: { method: 'GET', url: '=/calls/{{$parameter.callId}}' } },
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many outbound calls',
				description: 'List past outbound calls',
				routing: {
					request: { method: 'GET', url: '/calls' },
					output: { postReceive: [unwrapList('calls')] },
				},
			},
		],
		default: 'schedule',
	},

	// Schedule
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		default: '',
		placeholder: '+14155551234',
		description: 'Number to dial, in E.164 format',
		displayOptions: show(['schedule']),
		routing: { send: { type: 'body', property: 'phoneNumber' } },
	},
	{
		displayName: 'Goal',
		name: 'goal',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		description:
			'What the AI should accomplish on the call. Include names, times, addresses and any context it needs.',
		displayOptions: show(['schedule']),
		routing: { send: { type: 'body', property: 'goal' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['schedule']),
		options: [
			{
				displayName: 'Additional Context',
				name: 'additionalContext',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Background the agent can reference during the call',
				routing: { send: { type: 'body', property: 'additionalContext' } },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				default: '',
				description:
					'Agent whose voice and instructions run the call. Leave empty for your default outbound agent. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: { send: { type: 'body', property: 'agentId' } },
			},
			{
				displayName: 'Max Duration (Minutes)',
				name: 'maxDurationMinutes',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 15,
				routing: { send: { type: 'body', property: 'maxDurationMinutes' } },
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
				description: 'When to place the call. Leave empty to dial immediately.',
				routing: { send: { type: 'body', property: 'scheduledAt' } },
			},
			{
				displayName: 'Share Profile With Agent',
				name: 'includePrivateData',
				type: 'boolean',
				default: false,
				description:
					'Whether the agent may reference your profile (name, address, business details) on the call',
				routing: { send: { type: 'body', property: 'includePrivateData' } },
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				placeholder: 'America/Los_Angeles',
				description: 'IANA timezone for Scheduled At. Defaults to America/Los_Angeles.',
				routing: { send: { type: 'body', property: 'timezone' } },
			},
		],
	},

	// Get
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['get']),
	},

	// Get Many
	limitField('call', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: show(['getAll']),
		options: [
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'phoneNumber' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: CALL_STATUSES.map((value) => ({ name: value, value })),
				default: 'SUCCESS',
				routing: { send: { type: 'query', property: 'status' } },
			},
		],
	},
];

import type { INodeProperties } from 'n8n-workflow';
import { unwrapList } from '../helpers';
import { limitField } from './shared';

const show = (operation: string[]) => ({ show: { resource: ['sms'], operation } });

export const smsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sms'] } },
		options: [
			{
				name: 'Send Reply',
				value: 'sendReply',
				action: 'Send an SMS reply',
				description: 'Reply in an existing SMS conversation, from the same number',
				routing: {
					request: {
						method: 'POST',
						url: '=/sms/conversations/{{encodeURIComponent($parameter.conversationId)}}/send',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many SMS conversations',
				description: 'List recent SMS conversations',
				routing: {
					request: { method: 'GET', url: '/sms/conversations' },
					output: { postReceive: [unwrapList('conversations')] },
				},
			},
		],
		default: 'sendReply',
	},
	{
		displayName: 'Conversation Name or ID',
		name: 'conversationId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getSmsConversations' },
		required: true,
		default: '',
		description:
			'Map sms_conversation_id from the SkipCalls Trigger "SMS Received" event. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: show(['sendReply']),
	},
	{
		displayName: 'Message',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		displayOptions: show(['sendReply']),
		routing: { send: { type: 'body', property: 'content' } },
	},
	limitField('sms', 'getAll'),
];

import type { INodeProperties } from 'n8n-workflow';

export function limitField(resource: string, operation: string, maxValue = 100): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: [resource], operation: [operation] } },
		routing: { send: { type: 'query', property: 'limit' } },
	};
}

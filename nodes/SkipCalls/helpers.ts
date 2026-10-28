import type {
	IDataObject,
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	PostReceiveAction,
} from 'n8n-workflow';

/**
 * SkipCalls list endpoints return either a bare array or `{ <key>: [...] }`.
 * Turn both into one n8n item per record.
 */
export function unwrapList(key: string): PostReceiveAction {
	return async function (
		this: IExecuteSingleFunctions,
		_items: INodeExecutionData[],
		response: IN8nHttpFullResponse,
	): Promise<INodeExecutionData[]> {
		const body = response.body as IDataObject | IDataObject[];
		const records = Array.isArray(body) ? body : ((body?.[key] as IDataObject[]) ?? []);
		return records.map((json) => ({ json }));
	};
}

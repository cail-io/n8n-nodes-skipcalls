import type {
	IDataObject,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

const DEFAULT_BASE_URL = 'https://be.skipcalls.com';

type Context = IHookFunctions | ILoadOptionsFunctions;

export async function skipCallsRequest(
	this: Context,
	method: IHttpRequestMethods,
	url: string,
	body?: IDataObject,
	qs?: IDataObject,
) {
	const credentials = await this.getCredentials<{ baseUrl?: string }>('skipCallsApi');
	const baseUrl = (credentials.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
	return this.helpers.httpRequestWithAuthentication.call(this, 'skipCallsApi', {
		method,
		url: `${baseUrl}${url}`,
		body,
		qs,
		json: true,
	});
}

function toList(body: unknown, key: string): IDataObject[] {
	if (Array.isArray(body)) return body as IDataObject[];
	return ((body as IDataObject)?.[key] as IDataObject[]) ?? [];
}

export async function getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const agents = toList(await skipCallsRequest.call(this, 'GET', '/agents'), 'agents');
	return agents
		.filter((agent) => agent.isActive !== false)
		.map((agent) => ({ name: String(agent.name), value: String(agent.id) }));
}

export async function getSmsConversations(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const body = await skipCallsRequest.call(this, 'GET', '/sms/conversations', undefined, {
		limit: 50,
	});
	return toList(body, 'conversations')
		.filter((conversation) => conversation.status !== 'ENDED')
		.map((conversation) => {
			const agent = (conversation.agent as IDataObject | undefined)?.name;
			const preview = conversation.lastMessageContent
				? ` · ${String(conversation.lastMessageContent).slice(0, 40)}`
				: '';
			return {
				name: `${conversation.phoneNumberFrom ?? '?'}${agent ? ` — ${agent}` : ''}${preview}`,
				value: String(conversation.id),
			};
		});
}

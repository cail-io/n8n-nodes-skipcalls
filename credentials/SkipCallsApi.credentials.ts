import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SkipCallsApi implements ICredentialType {
	name = 'skipCallsApi';

	displayName = 'SkipCalls API';

	icon: Icon = { light: 'file:skipcalls.svg', dark: 'file:skipcalls.svg' };

	documentationUrl =
		'https://github.com/cail-io/n8n-nodes-skipcalls?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Create a key in SkipCalls under Integrations → API Keys (https://app.skipcalls.com/integration?tab=keys)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://be.skipcalls.com',
			description: 'Leave as is unless SkipCalls support gave you a different API address',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/users/me',
		},
	};
}

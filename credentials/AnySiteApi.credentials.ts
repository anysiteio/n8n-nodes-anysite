// credentials/AnySiteApi.credentials.ts
import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class AnySiteApi implements ICredentialType {
	name = 'anySiteApi';
	displayName = 'AnySite API';
	documentationUrl = 'https://anysite.io/redoc';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			description: 'Required for management API endpoints (chat, connections, posts, etc.)',
		},
	];

	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				'access-token': '={{$credentials.apiKey}}',
			},
		},
	} as IAuthenticateGeneric;
}

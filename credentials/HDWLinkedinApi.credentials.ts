// credentials/HDWLinkedinApi.credentials.ts
import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HDWLinkedinApi implements ICredentialType {
	name = 'hdwLinkedinApi';
	displayName = 'HDW LinkedIn';
	documentationUrl = 'https://horizondatawave.ai/redoc';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			description: 'Required for management API endpoints (chat, connections, posts, etc.)',
			required: false,
		},
	];

	authenticate = {
		type: 'generic',
		properties: {
			headers: {
				'access-token': '={{$credentials.apiKey}}'
			}
		}
	} as IAuthenticateGeneric;
}

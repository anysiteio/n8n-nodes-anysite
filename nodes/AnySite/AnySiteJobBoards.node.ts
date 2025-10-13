import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class AnySiteJobBoards implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AnySite Job Boards (beta)',
		name: 'anySiteJobBoards',
		icon: 'file:light.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with AnySite Job Boards API',
		defaults: {
			name: 'AnySite Job Boards',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'anySiteApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.anysite.io',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Glassdoor', value: 'glassdoor' }],
				default: 'glassdoor',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['glassdoor'] } },
				options: [
					{
						name: 'Get Job List',
						value: 'getJobList',
						description: 'Search for Glassdoor job listings',
						action: 'Search for glassdoor job listings',
						routing: {
							request: {
								method: 'POST',
								url: '/api/glassdoor/joblist',
								body: {
									keyword: '={{$parameter["keyword"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getJobList',
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Software Engineer',
				description: 'Search keyword, e.g., "Software Engineer"',
				displayOptions: { show: { resource: ['glassdoor'], operation: ['getJobList'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 20,
				description: 'Number of job listings per page from 1 to 100',
				displayOptions: { show: { resource: ['glassdoor'], operation: ['getJobList'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
				displayOptions: { show: { resource: ['glassdoor'], operation: ['getJobList'] } },
			},
			{
				displayName: 'Additional Filters',
				name: 'additionalFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['glassdoor'], operation: ['getJobList'] } },
				options: [
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description:
							'Location name, e.g., "New York". Used if searching within a specific city/state.',
						routing: { request: { body: { location: '={{$value}}' } } },
					},
					{
						displayName: 'Location ID',
						name: 'location_id',
						type: 'string',
						default: '',
						description: 'Internal Glassdoor location ID (usually not set directly)',
						routing: { request: { body: { location_id: '={{$value}}' } } },
					},
					{
						displayName: 'Location Type',
						name: 'location_type',
						type: 'options',
						options: [
							{ name: 'City', value: '1' },
							{ name: 'State', value: '2' },
							{ name: 'Country', value: '3' },
						],
						default: '1',
						description: 'Location type (CITY, STATE, or COUNTRY)',
						routing: { request: { body: { location_type: '={{$value}}' } } },
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'options',
						options: [
							{ name: 'USA', value: 'usa' },
							{ name: 'Australia', value: 'australia' },
							{ name: 'Germany', value: 'germany' },
							{ name: 'United Kingdom', value: 'uk' },
							{ name: 'Canada', value: 'canada' },
							{ name: 'France', value: 'france' },
							{ name: 'Japan', value: 'japan' },
							{ name: 'India', value: 'india' },
							{ name: 'Brazil', value: 'brazil' },
							{ name: 'Spain', value: 'spain' },
							{ name: 'Italy', value: 'italy' },
							{ name: 'Netherlands', value: 'netherlands' },
							{ name: 'Switzerland', value: 'switzerland' },
							{ name: 'Austria', value: 'austria' },
							{ name: 'Belgium', value: 'belgium' },
							{ name: 'Sweden', value: 'sweden' },
							{ name: 'Singapore', value: 'singapore' },
							{ name: 'Hong Kong', value: 'hong kong' },
							{ name: 'Mexico', value: 'mexico' },
							{ name: 'Ireland', value: 'ireland' },
						],
						default: 'usa',
						description: 'Country for the Glassdoor domain',
						routing: { request: { body: { country: '={{$value}}' } } },
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination from 1 to 10 (default: 1)',
						routing: { request: { body: { page: '={{$value}}' } } },
					},
					{
						displayName: 'Company Size',
						name: 'company_size',
						type: 'options',
						options: [
							{ name: 'Any Size', value: 0 },
							{ name: '1-200 Employees', value: 1 },
							{ name: '201-500 Employees', value: 2 },
							{ name: '501-1000 Employees', value: 3 },
							{ name: '1000-5000 Employees', value: 4 },
							{ name: '5000+ Employees', value: 5 },
						],
						default: 0,
						description: 'Company size filter',
						routing: { request: { body: { company_size: '={{$value}}' } } },
					},
					{
						displayName: 'Remote Only',
						name: 'is_remote',
						type: 'boolean',
						default: false,
						description: 'Whether to filter only remote jobs',
						routing: { request: { body: { is_remote: '={{$value}}' } } },
					},
					{
						displayName: 'Hours Old',
						name: 'hours_old',
						type: 'number',
						default: '',
						description: 'Show job listings published in the last X hours',
						routing: { request: { body: { hours_old: '={{$value}}' } } },
					},
					{
						displayName: 'Easy Apply',
						name: 'easy_apply',
						type: 'boolean',
						default: false,
						description: 'Filter job listings with "Easy Apply"',
						routing: { request: { body: { easy_apply: '={{$value}}' } } },
					},
					{
						displayName: 'Job Type',
						name: 'job_type',
						type: 'string',
						default: '',
						description:
							'Job type (e.g., "fulltime", "parttime", etc.). Supports international variants.',
						routing: { request: { body: { job_type: '={{$value}}' } } },
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('hdwLinkedinApi');
		if (!credentials) {
			throw new Error('No credentials provided!');
		}
		const accountId = credentials.accountId as string;
		if (!accountId) {
			throw new Error('Account ID is missing in credentials!');
		}

		const baseURL = 'https://api.horizondatawave.ai';

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const timeout = this.getNodeParameter('timeout', i) as number;
				let endpoint = '';
				const body: Record<string, any> = {
					timeout,
					account_id: accountId,
				};

				if (resource === 'glassdoor' && operation === 'getJobList') {
					endpoint = '/api/glassdoor/joblist';
					body.keyword = this.getNodeParameter('keyword', i) as string;
					body.count = this.getNodeParameter('count', i) as number;

					const additionalFilters = this.getNodeParameter('additionalFilters', i, {}) as Record<
						string,
						any
					>;
					for (const key in additionalFilters) {
						if (additionalFilters.hasOwnProperty(key) && additionalFilters[key] !== '') {
							body[key] = additionalFilters[key];
						}
					}
				}

				const options = {
					method: 'POST' as const,
					url: `${baseURL}${endpoint}`,
					body,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					json: true,
				};

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'hdwLinkedinApi',
					options,
				);

				if (Array.isArray(responseData)) {
					for (const element of responseData) {
						returnData.push({ json: element });
					}
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error: any) {
				// Enhanced error handling to extract information from headers and response body
				let errorMessage = error.message;
				let errorDetails = 'No detailed error information available';
				let httpStatus = '';
				let apiError = '';
				let requestId = '';
				let executionTime = '';
				let tokenPoints = '';

				// Extract information from HTTP response if available
				if (error.response) {
					httpStatus = error.response.status || '';

					// Extract custom headers from HDW API
					if (error.response.headers) {
						apiError = error.response.headers['x-error'] || '';
						requestId = error.response.headers['x-request-id'] || '';
						executionTime = error.response.headers['x-execution-time'] || '';
						tokenPoints = error.response.headers['x-token-points'] || '';
					}

					// Try to get error details from response body
					if (error.response.data) {
						if (typeof error.response.data === 'string') {
							errorDetails = error.response.data;
						} else if (typeof error.response.data === 'object') {
							errorDetails = JSON.stringify(error.response.data);
						}
					}

					// If we have API error from headers, use it as the main error message
					if (apiError) {
						errorMessage = `${apiError} (HTTP ${httpStatus})`;
					}

					// Build comprehensive error details
					const detailParts = [];
					if (apiError) detailParts.push(`API Error: ${apiError}`);
					if (httpStatus) detailParts.push(`HTTP Status: ${httpStatus}`);
					if (requestId) detailParts.push(`Request ID: ${requestId}`);
					if (executionTime) detailParts.push(`Execution Time: ${executionTime}s`);
					if (tokenPoints) detailParts.push(`Token Points: ${tokenPoints}`);
					if (error.response.data && error.response.data !== '{}') {
						detailParts.push(
							`Response Body: ${typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data}`,
						);
					}

					if (detailParts.length > 0) {
						errorDetails = detailParts.join(' | ');
					}
				}

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							details: errorDetails,
							httpStatus: httpStatus,
							apiError: apiError,
							requestId: requestId,
							executionTime: executionTime,
							tokenPoints: tokenPoints,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class HdwReddit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HDW Reddit',
		name: 'hdwReddit',
		icon: 'file:hdw_logo.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with Horizon Data Wave Reddit API',
		defaults: {
			name: 'HDW Reddit',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'hdwLinkedinApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.horizondatawave.ai',
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
				options: [{ name: 'Search', value: 'search' }],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{
						name: 'Search Posts',
						value: 'searchPosts',
						description: 'Search for Reddit posts',
						action: 'Search for reddit posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/reddit/search/posts',
								body: {
									query: '={{$parameter["query"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'searchPosts',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'crypto bitcoin',
				description: 'Search query for Reddit posts',
				displayOptions: { show: { resource: ['search'], operation: ['searchPosts'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 20,
				description: 'Maximum number of posts to return',
				displayOptions: { show: { resource: ['search'], operation: ['searchPosts'] } },
			},
			{
				displayName: 'Advanced Search Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['searchPosts'] } },
				options: [
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'options',
						options: [
							{ name: 'Relevance', value: 'relevance' },
							{ name: 'Hot', value: 'hot' },
							{ name: 'New', value: 'new' },
							{ name: 'Top', value: 'top' },
							{ name: 'Rising', value: 'rising' },
							{ name: 'Comments', value: 'comments' },
						],
						default: 'relevance',
						description: 'Sort order for search results',
						routing: { request: { body: { sort: '={{$value}}' } } },
					},
					{
						displayName: 'Time Filter',
						name: 'time_filter',
						type: 'options',
						options: [
							{ name: 'All Time', value: 'all' },
							{ name: 'Hour', value: 'hour' },
							{ name: 'Day', value: 'day' },
							{ name: 'Week', value: 'week' },
							{ name: 'Month', value: 'month' },
							{ name: 'Year', value: 'year' },
						],
						default: 'day',
						description: 'Time period to search within',
						routing: { request: { body: { time_filter: '={{$value}}' } } },
					},
					{
						displayName: 'Subreddit',
						name: 'subreddit',
						type: 'string',
						default: '',
						placeholder: 'cryptocurrency',
						description: 'Specific subreddit to search in (without r/)',
						routing: { request: { body: { subreddit: '={{$value}}' } } },
					},
				],
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
				displayOptions: { show: { resource: ['search'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const baseURL = 'https://api.horizondatawave.ai';
		const delayInMs = 100;

		const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const timeout = this.getNodeParameter('timeout', i) as number;

				let endpoint = '';
				const body: Record<string, any> = { timeout };

				if (resource === 'search') {
					if (operation === 'searchPosts') {
						endpoint = '/api/reddit/search/posts';
						body.query = this.getNodeParameter('query', i) as string;
						body.count = this.getNodeParameter('count', i) as number;

						const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as Record<
							string,
							any
						>;
						for (const key in advancedOptions) {
							if (advancedOptions[key] !== '') {
								body[key] = advancedOptions[key];
							}
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

				if (i < items.length - 1) {
					await sleep(delayInMs);
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

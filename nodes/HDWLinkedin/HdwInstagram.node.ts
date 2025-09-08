import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class HdwInstagram implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HDW Instagram',
		name: 'hdwInstagram',
		icon: 'file:hdw_logo.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with Horizon Data Wave Instagram API',
		defaults: {
			name: 'HDW Instagram',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Post', value: 'post' },
					{ name: 'Search', value: 'search' },
				],
				default: 'user',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['user'] } },
				options: [
					{
						name: 'Get Profile',
						value: 'getProfile',
						description: 'Get Instagram user profile',
						action: 'Get instagram user profile',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/user',
								body: {
									user: '={{$parameter["user"]}}',
									timeout: '={{$parameter["timeout"]}}',
									with_creation_date: '={{$parameter["with_creation_date"]}}',
								},
							},
						},
					},
					{
						name: 'Get Posts',
						value: 'getPosts',
						description: 'Get Instagram user posts',
						action: 'Get instagram user posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/user/posts',
								body: {
									user: '={{$parameter["user"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Friendships',
						value: 'getFriendships',
						description: 'Get Instagram user followers/following',
						action: 'Get instagram user friendships',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/user/friendships',
								body: {
									user: '={{$parameter["user"]}}',
									count: '={{$parameter["count"]}}',
									type: '={{$parameter["friendshipType"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Reels',
						value: 'getReels',
						description: 'Get Instagram user reels',
						action: 'Get instagram user reels',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/user/reels',
								body: {
									user: '={{$parameter["user"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getProfile',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['post'] } },
				options: [
					{
						name: 'Get Post',
						value: 'getPost',
						description: 'Get detailed Instagram post information',
						action: 'Get instagram post details',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/post',
								body: {
									post: '={{$parameter["post"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Comments',
						value: 'getComments',
						description: 'Get Instagram post comments',
						action: 'Get instagram post comments',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/post/comments',
								body: {
									post: '={{$parameter["post"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Likes',
						value: 'getLikes',
						description: 'Get Instagram post likes',
						action: 'Get instagram post likes',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/post/likes',
								body: {
									post: '={{$parameter["post"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getPost',
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
						description: 'Search Instagram posts by query',
						action: 'Search instagram posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/instagram/search/posts',
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
				displayName: 'User',
				name: 'user',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'cristiano',
				description: 'Instagram username, user ID, or URL',
				displayOptions: { show: { resource: ['user'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 12,
				description: 'Maximum number of posts to return',
				displayOptions: { show: { resource: ['user'], operation: ['getPosts'] } },
			},
			{
				displayName: 'Friendship Type',
				name: 'friendshipType',
				type: 'options',
				required: true,
				options: [
					{ name: 'Followers', value: 'followers' },
					{ name: 'Following', value: 'following' },
				],
				default: 'followers',
				description: 'Type of friendship to retrieve',
				displayOptions: { show: { resource: ['user'], operation: ['getFriendships'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 50,
				description: 'Maximum number of friendships to return',
				displayOptions: { show: { resource: ['user'], operation: ['getFriendships'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 12,
				description: 'Maximum number of reels to return',
				displayOptions: { show: { resource: ['user'], operation: ['getReels'] } },
			},
			{
				displayName: 'Post ID',
				name: 'post',
				type: 'string',
				required: true,
				default: '',
				placeholder: '3676612811870810696_1777543238',
				description: 'Instagram post ID',
				displayOptions: { show: { resource: ['post'], operation: ['getPost', 'getComments', 'getLikes'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 20,
				description: 'Maximum number of comments to return',
				displayOptions: { show: { resource: ['post'], operation: ['getComments'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 100,
				description: 'Maximum number of likes to return',
				displayOptions: { show: { resource: ['post'], operation: ['getLikes'] } },
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Intel',
				description: 'Search query for Instagram posts',
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
				displayName: 'With Creation Date',
				name: 'with_creation_date',
				type: 'boolean',
				default: false,
				description: 'Whether to include account creation date in the response',
				displayOptions: { show: { resource: ['user'], operation: ['getProfile'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
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

				if (resource === 'user') {
					const user = this.getNodeParameter('user', i) as string;
					body.user = user;

					if (operation === 'getProfile') {
						endpoint = '/api/instagram/user';
						body.with_creation_date = this.getNodeParameter('with_creation_date', i, false) as boolean;
					} else if (operation === 'getPosts') {
						endpoint = '/api/instagram/user/posts';
						body.count = this.getNodeParameter('count', i) as number;
					} else if (operation === 'getFriendships') {
						endpoint = '/api/instagram/user/friendships';
						body.count = this.getNodeParameter('count', i) as number;
						body.type = this.getNodeParameter('friendshipType', i) as string;
					} else if (operation === 'getReels') {
						endpoint = '/api/instagram/user/reels';
						body.count = this.getNodeParameter('count', i) as number;
					}
				} else if (resource === 'post') {
					const post = this.getNodeParameter('post', i) as string;
					body.post = post;

					if (operation === 'getPost') {
						endpoint = '/api/instagram/post';
					} else if (operation === 'getComments') {
						endpoint = '/api/instagram/post/comments';
						body.count = this.getNodeParameter('count', i) as number;
					} else if (operation === 'getLikes') {
						endpoint = '/api/instagram/post/likes';
						body.count = this.getNodeParameter('count', i) as number;
					}
				} else if (resource === 'search') {
					if (operation === 'searchPosts') {
						endpoint = '/api/instagram/search/posts';
						body.query = this.getNodeParameter('query', i) as string;
						body.count = this.getNodeParameter('count', i) as number;
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

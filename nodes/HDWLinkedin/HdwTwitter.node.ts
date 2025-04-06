import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class HdwTwitter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HDW Twitter',
		name: 'hdwTwitter',
		icon: 'file:hdw_logo.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with Horizon Data Wave Twitter (X) API',
		defaults: {
			name: 'HDW Twitter',
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
						description: 'Get Twitter user profile',
						action: 'Get Twitter user profile',
						routing: {
							request: {
								method: 'POST',
								url: '/api/twitter/user',
								body: {
									user: '={{$parameter["user"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Posts',
						value: 'getPosts',
						description: 'Get Twitter user posts',
						action: 'Get Twitter user posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/twitter/user/posts',
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
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{
						name: 'Search Users',
						value: 'searchUsers',
						description: 'Search for Twitter users',
						action: 'Search for Twitter users',
						routing: {
							request: {
								method: 'POST',
								url: '/api/twitter/search/users',
								body: {
									query: '={{$parameter["query"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Search Posts',
						value: 'searchPosts',
						description: 'Search for Twitter posts (tweets)',
						action: 'Search for Twitter posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/twitter/search/posts',
								body: {
									query: '={{$parameter["query"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'searchUsers',
			},
			// User Parameters
			{
				displayName: 'User',
				name: 'user',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'elonmusk',
				description: 'Twitter username, handle, or URL',
				displayOptions: { show: { resource: ['user'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of posts to return',
				displayOptions: { show: { resource: ['user'], operation: ['getPosts'] } },
			},
			// Search Parameters
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'crypto OR bitcoin',
				description: 'Search query',
				displayOptions: { show: { resource: ['search'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 20,
				description: 'Maximum number of results to return',
				displayOptions: { show: { resource: ['search'] } },
			},
			// Advanced Search Posts Parameters
			{
				displayName: 'Advanced Search Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['searchPosts'] } },
				options: [
					{
						displayName: 'Exact Phrase',
						name: 'exact_phrase',
						type: 'string',
						default: '',
						description: 'Tweets containing this exact phrase',
						routing: { request: { body: { exact_phrase: '={{$value}}' } } }
					},
					{
						displayName: 'Any of These Words',
						name: 'any_of_these_words',
						type: 'string',
						default: '',
						description: 'Tweets containing any of these words (comma-separated)',
						routing: {
							send: {
								type: 'body',
								property: 'any_of_these_words',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'None of These Words',
						name: 'none_of_these_words',
						type: 'string',
						default: '',
						description: 'Tweets containing none of these words (comma-separated)',
						routing: {
							send: {
								type: 'body',
								property: 'none_of_these_words',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'These Hashtags',
						name: 'these_hashtags',
						type: 'string',
						default: '',
						description: 'Tweets containing these hashtags (comma-separated, without #)',
						routing: {
							send: {
								type: 'body',
								property: 'these_hashtags',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'options',
						options: [
							{ name: 'English', value: 'English' },
							{ name: 'Arabic', value: 'Arabic' },
							{ name: 'Chinese', value: 'Simplified Chinese' },
							{ name: 'French', value: 'French' },
							{ name: 'German', value: 'German' },
							{ name: 'Hindi', value: 'Hindi' },
							{ name: 'Japanese', value: 'Japanese' },
							{ name: 'Korean', value: 'Korean' },
							{ name: 'Portuguese', value: 'Portuguese' },
							{ name: 'Russian', value: 'Russian' },
							{ name: 'Spanish', value: 'Spanish' },
						],
						default: 'English',
						description: 'Language of tweets to search for',
						routing: { request: { body: { language: '={{$value}}' } } }
					},
					{
						displayName: 'From These Accounts',
						name: 'from_these_accounts',
						type: 'string',
						default: '',
						description: 'Tweets from these accounts (comma-separated usernames)',
						routing: {
							send: {
								type: 'body',
								property: 'from_these_accounts',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'To These Accounts',
						name: 'to_these_accounts',
						type: 'string',
						default: '',
						description: 'Tweets to these accounts (comma-separated usernames)',
						routing: {
							send: {
								type: 'body',
								property: 'to_these_accounts',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'Mentioning These Accounts',
						name: 'mentioning_these_accounts',
						type: 'string',
						default: '',
						description: 'Tweets mentioning these accounts (comma-separated, with @)',
						routing: {
							send: {
								type: 'body',
								property: 'mentioning_these_accounts',
								value: '={{ $value.split(",").map(item => item.trim()) }}',
							},
						}
					},
					{
						displayName: 'Minimum Replies',
						name: 'min_replies',
						type: 'number',
						default: 0,
						description: 'Minimum number of replies',
						routing: { request: { body: { min_replies: '={{$value}}' } } }
					},
					{
						displayName: 'Minimum Likes',
						name: 'min_likes',
						type: 'number',
						default: 0,
						description: 'Minimum number of likes',
						routing: { request: { body: { min_likes: '={{$value}}' } } }
					},
					{
						displayName: 'Minimum Retweets',
						name: 'min_retweets',
						type: 'number',
						default: 0,
						description: 'Minimum number of retweets',
						routing: { request: { body: { min_retweets: '={{$value}}' } } }
					},
					{
						displayName: 'From Date',
						name: 'from_date',
						type: 'dateTime',
						default: '',
						description: 'Starting date for tweets search',
						routing: {
							send: {
								type: 'body',
								property: 'from_date',
								value: '={{ Math.round(new Date($value).getTime() / 1000) }}',
							},
						}
					},
					{
						displayName: 'To Date',
						name: 'to_date',
						type: 'dateTime',
						default: '',
						description: 'Ending date for tweets search',
						routing: {
							send: {
								type: 'body',
								property: 'to_date',
								value: '={{ Math.round(new Date($value).getTime() / 1000) }}',
							},
						}
					},
					{
						displayName: 'Search Type',
						name: 'search_type',
						type: 'options',
						options: [
							{ name: 'Top', value: 'Top' },
							{ name: 'Latest', value: 'Latest' },
						],
						default: 'Top',
						description: 'Type of search results',
						routing: { request: { body: { search_type: '={{$value}}' } } }
					},
				],
			},
			// Common parameters
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
			},
		],
	};
}

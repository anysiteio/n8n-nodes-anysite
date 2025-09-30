import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class AnySiteLinkedin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AnySite LinkedIn',
		name: 'anySiteLinkedin',
		icon: 'file:light.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with AnySite LinkedIn API',
		defaults: {
			name: 'AnySite LinkedIn',
		},
		inputs: ['main'],
		outputs: ['main'],
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
				options: [
					{ name: 'User', value: 'user' },
					{ name: 'Email', value: 'email' },
					{ name: 'Post', value: 'post' },
					{ name: 'Company', value: 'company' },
					{ name: 'Search', value: 'search' },
					{ name: 'Google', value: 'google' },
					{ name: 'Group', value: 'group' },
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
						name: 'Search',
						value: 'search',
						description: 'Search for LinkedIn users',
						action: 'Search for linked in users',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/search/users',
								body: {
									keywords: '={{$parameter["keywords"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Profile',
						value: 'getProfile',
						description: 'Get LinkedIn user profile',
						action: 'Get linked in user profile',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/user',
								body: {
									user: '={{$parameter["user"]}}',
									with_experience: '={{$parameter["withExperience"]}}',
									with_education: '={{$parameter["withEducation"]}}',
									with_skills: '={{$parameter["withSkills"]}}',
								},
							},
						},
					},
					{
						name: 'Get Posts',
						value: 'getPosts',
						description: 'Get LinkedIn user posts',
						action: 'Get linked in user posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/user/posts',
								body: {
									urn: '={{$parameter["urn"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Reactions',
						value: 'getReactions',
						description: 'Get LinkedIn user reactions',
						action: 'Get linked in user reactions',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/user/reactions',
								body: {
									urn: '={{$parameter["urn"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get User Comments',
						value: 'getUserComments',
						description: 'Get LinkedIn user comments',
						action: 'Get linkedin user comments',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['email'] } },
				options: [
					{
						name: 'Get User by Email',
						value: 'getUserByEmail',
						description: 'Find LinkedIn user by email',
						action: 'Find linked in user by email',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/email/user',
								body: {
									email: '={{$parameter["email"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getUserByEmail',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['post'] } },
				options: [
					{
						name: 'Get Post Comments',
						value: 'getPostComments',
						description: 'Get comments on a LinkedIn post',
						action: 'Get linked in post comments',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/post/comments',
								body: {
									urn: '={{$parameter["urn"]}}',
									sort: '={{$parameter["sort"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Post Reposts',
						value: 'getPostReposts',
						description: 'Get reposts of a LinkedIn post',
						action: 'Get linked in post reposts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/post/reposts',
								body: {
									urn: '={{$parameter["urn"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getPostComments',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['company'] } },
				options: [
					{
						name: 'Get Company',
						value: 'getCompany',
						description: 'Get LinkedIn company information',
						action: 'Get linked in company information',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/company',
								body: {
									company: '={{$parameter["company"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Company Employees',
						value: 'getCompanyEmployees',
						description: 'Get employees of a LinkedIn company',
						action: 'Get linked in company employees',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/company/employees',
								body: {
									companies: '={{$parameter["companies"]}}',
									keywords: '={{$parameter["keywords"]}}',
									first_name: '={{$parameter["firstName"]}}',
									last_name: '={{$parameter["lastName"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Get Company Posts',
						value: 'getCompanyPosts',
						description: 'Get posts from a LinkedIn company',
						action: 'Get linked in company posts',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/company/posts',
								body: {
									urn: '={{$parameter["urn"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					// Add the new operation here:
					{
						name: 'Get Company Employee Stats',
						value: 'getCompanyEmployeeStats',
						description: 'Get employee statistics of a LinkedIn company',
						action: 'Get linked in company employee statistics',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/company/employee_stats',
								body: {
									urn: '={{$parameter["urn"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getCompany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [
					{
						name: 'Sales Navigator Search',
						value: 'salesNavigatorSearch',
						description: 'Advanced LinkedIn search using Sales Navigator',
						action: 'Search linked in with sales navigator',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/sn_search/users',
								body: {
									keywords: '={{$parameter["keywords"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Search Jobs',
						value: 'searchJobs',
						description: 'Search for LinkedIn jobs',
						action: 'Search for linked in jobs',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/search/jobs',
								body: {
									keywords: '={{$parameter["keywords"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Search Companies',
						value: 'searchCompanies',
						description: 'Search for LinkedIn companies',
						action: 'Search for linked in companies',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/search/companies',
								body: {
									keywords: '={{$parameter["keywords"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Search Industries',
						value: 'searchIndustries',
						description: 'Search for LinkedIn industries',
						action: 'Search for linked in industries',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/search/industries',
								body: {
									name: '={{$parameter["name"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Search Locations',
						value: 'searchLocations',
						description: 'Search for LinkedIn locations',
						action: 'Search for linked in locations',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/search/locations',
								body: {
									name: '={{$parameter["name"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'salesNavigatorSearch',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['google'] } },
				options: [
					{
						name: 'Search Companies',
						value: 'searchCompanies',
						description: 'Search for LinkedIn companies using Google',
						action: 'Search for linked in companies via google',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/google/company',
								body: {
									keywords: '={{$parameter["keywords"]}}',
									with_urn: '={{$parameter["withUrn"]}}',
									count_per_keyword: '={{$parameter["countPerKeyword"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
					{
						name: 'Google Search',
						value: 'googleSearch',
						description: 'Perform a Google search',
						action: 'Perform a google search',
						routing: {
							request: {
								method: 'POST',
								url: '/api/google/search',
								body: {
									query: '={{$parameter["query"]}}',
									count: '={{$parameter["count"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'searchCompanies',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['group'] } },
				options: [
					{
						name: 'Get Group',
						value: 'getGroup',
						description: 'Get LinkedIn group information',
						action: 'Get linked in group information',
						routing: {
							request: {
								method: 'POST',
								url: '/api/linkedin/group',
								body: {
									group: '={{$parameter["group"]}}',
									timeout: '={{$parameter["timeout"]}}',
								},
							},
						},
					},
				],
				default: 'getGroup',
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				placeholder: 'software engineer',
				description: 'Any keyword for searching in the user page',
				displayOptions: { show: { resource: ['user'], operation: ['search'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results (max 1000)',
				displayOptions: { show: { resource: ['user'], operation: ['search'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
				displayOptions: { show: { resource: ['user'], operation: ['search'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { resource: ['user'], operation: ['search'] } },
				options: [
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string',
						default: '',
						description: 'Exact first name',
						routing: { request: { body: { first_name: '={{$value}}' } } },
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
						description: 'Exact last name',
						routing: { request: { body: { last_name: '={{$value}}' } } },
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Exact word in the title',
						routing: { request: { body: { title: '={{$value}}' } } },
					},
					{
						displayName: 'Company Keywords',
						name: 'company_keywords',
						type: 'string',
						default: '',
						description: 'Exact word in the company name',
						routing: { request: { body: { company_keywords: '={{$value}}' } } },
					},
					{
						displayName: 'School Keywords',
						name: 'school_keywords',
						type: 'string',
						default: '',
						description: 'Exact word in the school name',
						routing: { request: { body: { school_keywords: '={{$value}}' } } },
					},
					{
						displayName: 'Current Company',
						name: 'current_company',
						type: 'string',
						default: '',
						description: 'Company URN or name',
						routing: { request: { body: { current_company: '={{$value}}' } } },
					},
					{
						displayName: 'Past Company',
						name: 'past_company',
						type: 'string',
						default: '',
						description: 'Past company URN or name',
						routing: { request: { body: { past_company: '={{$value}}' } } },
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Location name or URN',
						routing: { request: { body: { location: '={{$value}}' } } },
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'string',
						default: '',
						description: 'Industry URN or name',
						routing: { request: { body: { industry: '={{$value}}' } } },
					},
					{
						displayName: 'Education',
						name: 'education',
						type: 'string',
						default: '',
						description: 'Education URN or name',
						routing: { request: { body: { education: '={{$value}}' } } },
					},
				],
			},
			{
				displayName: 'User',
				name: 'user',
				type: 'string',
				required: true,
				default: '',
				description: 'User alias, URL, or URN',
				displayOptions: { show: { resource: ['user'], operation: ['getProfile'] } },
			},
			{
				displayName: 'Include Experience',
				name: 'withExperience',
				type: 'boolean',
				default: true,
				description: 'Whether to include experience information',
				displayOptions: { show: { resource: ['user'], operation: ['getProfile'] } },
			},
			{
				displayName: 'Include Education',
				name: 'withEducation',
				type: 'boolean',
				default: true,
				description: 'Whether to include education information',
				displayOptions: { show: { resource: ['user'], operation: ['getProfile'] } },
			},
			{
				displayName: 'Include Skills',
				name: 'withSkills',
				type: 'boolean',
				default: true,
				description: 'Whether to include skills information',
				displayOptions: { show: { resource: ['user'], operation: ['getProfile'] } },
			},
			{
				displayName: 'User URN',
				name: 'urn',
				type: 'string',
				required: true,
				default: '',
				description: 'User URN (must include prefix, e.g. fsd_profile:ACoAA...)',
				displayOptions: { show: { resource: ['user'], operation: ['getPosts', 'getReactions', 'getUserComments'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['user'], operation: ['getPosts', 'getReactions', 'getUserComments'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['user'], operation: ['getPosts', 'getReactions', 'getUserComments'] } },
			},
			{
				displayName: 'Commented After',
				name: 'commented_after',
				type: 'number',
				default: '',
				description: 'Filter comments that created after the specified timestamp (optional)',
				displayOptions: { show: { resource: ['user'], operation: ['getUserComments'] } },
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				description: 'Email address to search for',
				displayOptions: { show: { resource: ['email'], operation: ['getUserByEmail'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 5,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['email'], operation: ['getUserByEmail'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['email'], operation: ['getUserByEmail'] } },
			},
			{
				displayName: 'Post URN',
				name: 'urn',
				type: 'string',
				required: true,
				default: '',
				description: 'Post URN (must include prefix, e.g. activity:7234173400267538433)',
				displayOptions: {
					show: { resource: ['post'], operation: ['getPostComments', 'getPostReposts'] },
				},
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Relevance', value: 'relevance' },
					{ name: 'Recent', value: 'recent' },
				],
				default: 'relevance',
				description: 'Sort type for comments',
				displayOptions: { show: { resource: ['post'], operation: ['getPostComments'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: {
					show: { resource: ['post'], operation: ['getPostComments', 'getPostReposts'] },
				},
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: {
					show: { resource: ['post'], operation: ['getPostComments', 'getPostReposts'] },
				},
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				default: '',
				description: 'Text content of the post',
				displayOptions: { show: { resource: ['post'], operation: ['createPost'] } },
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{ name: 'Anyone', value: 'ANYONE' },
					{ name: 'Connections Only', value: 'CONNECTIONS_ONLY' },
				],
				default: 'ANYONE',
				description: 'Post visibility',
				displayOptions: { show: { resource: ['post'], operation: ['createPost'] } },
			},
			{
				displayName: 'Comment Scope',
				name: 'commentScope',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Connections Only', value: 'CONNECTIONS_ONLY' },
					{ name: 'None', value: 'NONE' },
				],
				default: 'ALL',
				description: 'Who can comment on the post',
				displayOptions: { show: { resource: ['post'], operation: ['createPost'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['post'], operation: ['createPost'] } },
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				required: true,
				default: '',
				description: 'Company alias, URL or URN (e.g. "openai" or "company:1441")',
				displayOptions: { show: { resource: ['company'], operation: ['getCompany'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['company'], operation: ['getCompany'] } },
			},
			{
				displayName: 'Companies',
				name: 'companies',
				type: 'string',
				required: true,
				default: '',
				description: 'Company URNs (comma-separated list, e.g. "company:14064608,company:1441")',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
				routing: {
					send: {
						type: 'body',
						property: 'companies',
						value: '={{ $value.split(",").map(item => item.trim()) }}',
					},
				},
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				description: 'Any keyword for searching employees',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Search for exact first name',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Search for exact last name',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployees'] } },
			},
			{
				displayName: 'Company URN',
				name: 'urn',
				type: 'string',
				required: true,
				default: '',
				description: 'Company URN, only company urn type is allowed (e.g. "company:11130470")',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyPosts'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyPosts'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyPosts'] } },
			},
			{
				displayName: 'Company URN',
				name: 'urn',
				type: 'string',
				required: true,
				default: '',
				description: 'Company URN (must include prefix, e.g. "company:79111745")',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployeeStats'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['company'], operation: ['getCompanyEmployeeStats'] } },
			},

			{
				displayName: 'Group',
				name: 'group',
				type: 'string',
				required: true,
				default: '',
				description: 'Group URN or URL',
				displayOptions: { show: { resource: ['group'], operation: ['getGroup'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['group'], operation: ['getGroup'] } },
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				description: 'Any keyword for searching in the user profile',
				displayOptions: { show: { resource: ['search'], operation: ['salesNavigatorSearch'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results (max 2500)',
				displayOptions: { show: { resource: ['search'], operation: ['salesNavigatorSearch'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds (20-1500)',
				displayOptions: { show: { resource: ['search'], operation: ['salesNavigatorSearch'] } },
			},
			{
				displayName: 'Additional Filters',
				name: 'additionalFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['salesNavigatorSearch'] } },
				options: [
					{
						displayName: 'First Names',
						name: 'first_names',
						type: 'string',
						default: '',
						description: 'Comma-separated list of exact first names',
						routing: {
							send: {
								type: 'body',
								property: 'first_names',
								value:
									'={{ $value ? $value.split(",").map(item => item.trim()).filter(Boolean) : [] }}',
							},
						},
					},
					{
						displayName: 'Last Names',
						name: 'last_names',
						type: 'string',
						default: '',
						description: 'Comma-separated list of exact last names',
						routing: {
							send: {
								type: 'body',
								property: 'last_names',
								value:
									'={{ $value ? $value.split(",").map(item => item.trim()).filter(Boolean) : [] }}',
							},
						},
					},
					{
						displayName: 'Current Titles',
						name: 'current_titles',
						type: 'string',
						default: '',
						description: 'Comma-separated list of exact words in current titles',
						routing: {
							send: {
								type: 'body',
								property: 'current_titles',
								value:
									'={{ $value ? $value.split(",").map(item => item.trim()).filter(Boolean) : [] }}',
							},
						},
					},
					{
						displayName: 'Past Titles',
						name: 'past_titles',
						type: 'string',
						default: '',
						description: 'Comma-separated list of exact words in past titles',
						routing: {
							send: {
								type: 'body',
								property: 'past_titles',
								value:
									'={{ $value ? $value.split(",").map(item => item.trim()).filter(Boolean) : [] }}',
							},
						},
					},
					{
						displayName: 'Company Keyword',
						name: 'company_keyword',
						type: 'string',
						default: '',
						description: 'Keyword for current company text filter in Sales Navigator',
						routing: { request: { body: { company_keyword: '={{$value}}' } } },
					},
					{
						displayName: 'Past Company Keyword',
						name: 'past_company_keyword',
						type: 'string',
						default: '',
						description: 'Keyword for past company text filter in Sales Navigator',
						routing: { request: { body: { past_company_keyword: '={{$value}}' } } },
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Location name or URN',
						routing: {
							send: {
								type: 'body',
								property: 'location',
								value:
									'={{ $value ? ($value.includes(",") ? $value.split(",").map(item => item.trim()).filter(Boolean) : $value) : "" }}',
							},
						},
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'string',
						default: '',
						description: 'Industry URN or name',
					},
					{
						displayName: 'Current Companies',
						name: 'current_companies',
						type: 'string',
						default: '',
						description: 'Current company URN or name',
						routing: {
							send: {
								type: 'body',
								property: 'current_companies',
								value:
									'={{ $value ? ($value.includes(",") ? $value.split(",").map(item => item.trim()).filter(Boolean) : $value) : "" }}',
							},
						},
					},
					{
						displayName: 'Past Companies',
						name: 'past_companies',
						type: 'string',
						default: '',
						description: 'Past company URN or name',
						routing: {
							send: {
								type: 'body',
								property: 'past_companies',
								value:
									'={{ $value ? ($value.includes(",") ? $value.split(",").map(item => item.trim()).filter(Boolean) : $value) : "" }}',
							},
						},
					},
					{
						displayName: 'Education',
						name: 'education',
						type: 'string',
						default: '',
						description: 'Education URN or name',
						routing: {
							send: {
								type: 'body',
								property: 'education',
								value:
									'={{ $value ? ($value.includes(",") ? $value.split(",").map(item => item.trim()).filter(Boolean) : $value) : "" }}',
							},
						},
					},
					{
						displayName: 'Company Locations',
						name: 'company_locations',
						type: 'string',
						default: '',
						description: 'Company location name or URN',
						routing: {
							send: {
								type: 'body',
								property: 'company_locations',
								value:
									'={{ $value ? ($value.includes(",") ? $value.split(",").map(item => item.trim()).filter(Boolean) : $value) : "" }}',
							},
						},
					},
					{
						displayName: 'Is Posted On LinkedIn',
						name: 'is_posted_on_linkedin',
						type: 'boolean',
						default: false,
						description: 'Users who have recently published content on the platform',
						routing: { request: { body: { is_posted_on_linkedin: '={{$value}}' } } },
					},
					{
						displayName: 'Company Sizes',
						name: 'company_sizes',
						type: 'multiOptions',
						options: [
							{ name: 'Self-Employed', value: 'Self-employed' },
							{ name: '1-10', value: '1-10' },
							{ name: '11-50', value: '11-50' },
							{ name: '51-200', value: '51-200' },
							{ name: '201-500', value: '201-500' },
							{ name: '501-1,000', value: '501-1,000' },
							{ name: '1,001-5,000', value: '1,001-5,000' },
							{ name: '5,001-10,000', value: '5,001-10,000' },
							{ name: '10,001+', value: '10,001+' },
						],
						default: [],
						description: 'Company size ranges',
					},
					{
						displayName: 'Company Types',
						name: 'company_types',
						type: 'multiOptions',
						options: [
							{ name: 'Public Company', value: 'Public Company' },
							{ name: 'Privately Held', value: 'Privately Held' },
							{ name: 'Non Profit', value: 'Non Profit' },
							{ name: 'Educational Institution', value: 'Educational Institution' },
							{ name: 'Partnership', value: 'Partnership' },
							{ name: 'Self Employed', value: 'Self Employed' },
							{ name: 'Self Owned', value: 'Self Owned' },
							{ name: 'Government Agency', value: 'Government Agency' },
						],
						default: [],
						description: 'Types of the current company',
					},
					{
						displayName: 'Languages',
						name: 'languages',
						type: 'multiOptions',
						options: [
							{ name: 'Arabic', value: 'Arabic' },
							{ name: 'English', value: 'English' },
							{ name: 'Spanish', value: 'Spanish' },
							{ name: 'Portuguese', value: 'Portuguese' },
							{ name: 'Chinese', value: 'Chinese' },
							{ name: 'French', value: 'French' },
							{ name: 'Italian', value: 'Italian' },
							{ name: 'Russian', value: 'Russian' },
							{ name: 'German', value: 'German' },
							{ name: 'Dutch', value: 'Dutch' },
							{ name: 'Turkish', value: 'Turkish' },
							{ name: 'Tagalog', value: 'Tagalog' },
							{ name: 'Polish', value: 'Polish' },
							{ name: 'Korean', value: 'Korean' },
							{ name: 'Japanese', value: 'Japanese' },
							{ name: 'Malay', value: 'Malay' },
							{ name: 'Norwegian', value: 'Norwegian' },
							{ name: 'Danish', value: 'Danish' },
							{ name: 'Romanian', value: 'Romanian' },
							{ name: 'Swedish', value: 'Swedish' },
							{ name: 'Bahasa Indonesia', value: 'Bahasa Indonesia' },
							{ name: 'Czech', value: 'Czech' },
						],
						default: [],
						description: 'Profile languages',
					},
					{
						displayName: 'Functions',
						name: 'functions',
						type: 'multiOptions',
						options: [
							{ name: 'Accounting', value: 'Accounting' },
							{ name: 'Administrative', value: 'Administrative' },
							{ name: 'Arts and Design', value: 'Arts and Design' },
							{ name: 'Business Development', value: 'Business Development' },
							{ name: 'Community and Social Services', value: 'Community and Social Services' },
							{ name: 'Consulting', value: 'Consulting' },
							{ name: 'Education', value: 'Education' },
							{ name: 'Engineering', value: 'Engineering' },
							{ name: 'Entrepreneurship', value: 'Entrepreneurship' },
							{ name: 'Finance', value: 'Finance' },
							{ name: 'Healthcare Services', value: 'Healthcare Services' },
							{ name: 'Human Resources', value: 'Human Resources' },
							{ name: 'Information Technology', value: 'Information Technology' },
							{ name: 'Legal', value: 'Legal' },
							{ name: 'Marketing', value: 'Marketing' },
							{ name: 'Media and Communication', value: 'Media and Communication' },
							{
								name: 'Military and Protective Services',
								value: 'Military and Protective Services',
							},
							{ name: 'Operations', value: 'Operations' },
							{ name: 'Product Management', value: 'Product Management' },
							{ name: 'Program and Project Management', value: 'Program and Project Management' },
							{ name: 'Purchasing', value: 'Purchasing' },
							{ name: 'Quality Assurance', value: 'Quality Assurance' },
							{ name: 'Research', value: 'Research' },
							{ name: 'Real Estate', value: 'Real Estate' },
							{ name: 'Sales', value: 'Sales' },
							{ name: 'Customer Success and Support', value: 'Customer Success and Support' },
						],
						default: [],
						description: 'Job functions',
					},
					{
						displayName: 'Levels',
						name: 'levels',
						type: 'multiOptions',
						options: [
							{ name: 'Entry', value: 'Entry' },
							{ name: 'Director', value: 'Director' },
							{ name: 'Owner', value: 'Owner' },
							{ name: 'CXO', value: 'CXO' },
							{ name: 'Vice President', value: 'Vice President' },
							{ name: 'Experienced Manager', value: 'Experienced Manager' },
							{ name: 'Entry Manager', value: 'Entry Manager' },
							{ name: 'Strategic', value: 'Strategic' },
							{ name: 'Senior', value: 'Senior' },
							{ name: 'Trainy', value: 'Trainy' },
						],
						default: [],
						description: 'Job level',
					},
					{
						displayName: 'Years in Current Company',
						name: 'years_in_the_current_company',
						type: 'multiOptions',
						options: [
							{ name: '0-1', value: '0-1' },
							{ name: '1-2', value: '1-2' },
							{ name: '3-5', value: '3-5' },
							{ name: '6-10', value: '6-10' },
							{ name: '10+', value: '10+' },
						],
						default: [],
						description: 'Years in the current company',
					},
					{
						displayName: 'Years in Current Position',
						name: 'years_in_the_current_position',
						type: 'multiOptions',
						options: [
							{ name: '0-1', value: '0-1' },
							{ name: '1-2', value: '1-2' },
							{ name: '3-5', value: '3-5' },
							{ name: '6-10', value: '6-10' },
							{ name: '10+', value: '10+' },
						],
						default: [],
						description: 'Years in the current position',
					},
				],
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				default: '',
				description:
					'Any keyword for searching companies. For exact search put desired keywords into brackets.',
				displayOptions: { show: { resource: ['search'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['search'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['search'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Additional Filters',
				name: 'additionalFilters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['searchCompanies'] } },
				options: [
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'Location URN (geo:*) or name',
						routing: { request: { body: { location: '={{$value}}' } } },
					},
					{
						displayName: 'Industry',
						name: 'industry',
						type: 'string',
						default: '',
						description: 'Industry URN (industry:*) or name',
						routing: { request: { body: { industry: '={{$value}}' } } },
					},
					{
						displayName: 'Employee Count',
						name: 'employee_count',
						type: 'multiOptions',
						options: [
							{ name: '1-10', value: '1-10' },
							{ name: '11-50', value: '11-50' },
							{ name: '51-200', value: '51-200' },
							{ name: '201-500', value: '201-500' },
							{ name: '501-1,000', value: '501-1000' },
							{ name: '1,001-5,000', value: '1001-5000' },
							{ name: '5,001-10,000', value: '5001-10000' },
							{ name: '10,001+', value: '10001+' },
						],
						default: [],
						description: 'Company sizes to filter by',
						routing: { request: { body: { employee_count: '={{$value}}' } } },
					},
				],
			},
			{
				displayName: 'Industry Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Industry name to search for',
				displayOptions: { show: { resource: ['search'], operation: ['searchIndustries'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['search'], operation: ['searchIndustries'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['search'], operation: ['searchIndustries'] } },
			},
			{
				displayName: 'Location Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Location name to search for',
				displayOptions: { show: { resource: ['search'], operation: ['searchLocations'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results',
				displayOptions: { show: { resource: ['search'], operation: ['searchLocations'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['search'], operation: ['searchLocations'] } },
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				required: true,
				default: '',
				description: 'Company keywords for search (comma-separated)',
				displayOptions: { show: { resource: ['google'], operation: ['searchCompanies'] } },
				routing: {
					send: {
						type: 'body',
						property: 'keywords',
						value: '={{ $value.split(",").map(item => item.trim()) }}',
					},
				},
			},
			{
				displayName: 'Include URNs',
				name: 'withUrn',
				type: 'boolean',
				default: false,
				description: 'Whether to include URNs in response (increases execution time)',
				displayOptions: { show: { resource: ['google'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Results Per Keyword',
				name: 'countPerKeyword',
				type: 'number',
				default: 1,
				description: 'Maximum results per keyword (1-10)',
				displayOptions: { show: { resource: ['google'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['google'], operation: ['searchCompanies'] } },
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'Search query (e.g., "python fastapi")',
				displayOptions: { show: { resource: ['google'], operation: ['googleSearch'] } },
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				default: 10,
				description: 'Maximum number of results (1-20)',
				displayOptions: { show: { resource: ['google'], operation: ['googleSearch'] } },
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Timeout in seconds',
				displayOptions: { show: { resource: ['google'], operation: ['googleSearch'] } },
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const delayInMs = 1000;

		const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				const method: IHttpRequestMethods = 'POST';
				const body: Record<string, any> = {};

				if (resource === 'user') {
					if (operation === 'search') {
						endpoint = '/api/linkedin/search/users';
						body.keywords = this.getNodeParameter('keywords', i, '') as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;

						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as IDataObject;
						if (additionalFields.first_name) body.first_name = additionalFields.first_name;
						if (additionalFields.last_name) body.last_name = additionalFields.last_name;
						if (additionalFields.title) body.title = additionalFields.title;
						if (additionalFields.company_keywords)
							body.company_keywords = additionalFields.company_keywords;
						if (additionalFields.school_keywords)
							body.school_keywords = additionalFields.school_keywords;
						if (additionalFields.current_company)
							body.current_company = additionalFields.current_company;
						if (additionalFields.past_company) body.past_company = additionalFields.past_company;
						if (additionalFields.location) body.location = additionalFields.location;
						if (additionalFields.industry) body.industry = additionalFields.industry;
						if (additionalFields.education) body.education = additionalFields.education;
					} else if (operation === 'getProfile') {
						endpoint = '/api/linkedin/user';

						const userParam = this.getNodeParameter('user', i) as string;

						body.user = userParam;
						body.with_experience = this.getNodeParameter('withExperience', i, true) as boolean;
						body.with_education = this.getNodeParameter('withEducation', i, true) as boolean;
						body.with_skills = this.getNodeParameter('withSkills', i, true) as boolean;
					} else if (operation === 'getPosts') {
						endpoint = '/api/linkedin/user/posts';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getReactions') {
						endpoint = '/api/linkedin/user/reactions';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getUserComments') {
						endpoint = '/api/linkedin/user/comments';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
						const commentedAfter = this.getNodeParameter('commented_after', i, '') as number;
						if (commentedAfter) {
							body.commented_after = commentedAfter;
						}
					}
				} else if (resource === 'email') {
					if (operation === 'getUserByEmail') {
						endpoint = '/api/linkedin/email/user';
						body.email = this.getNodeParameter('email', i) as string;
						body.count = this.getNodeParameter('count', i, 5) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				} else if (resource === 'post') {
					if (operation === 'getPostComments') {
						endpoint = '/api/linkedin/post/comments';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.sort = this.getNodeParameter('sort', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getPostReposts') {
						endpoint = '/api/linkedin/post/reposts';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				} else if (resource === 'company') {
					if (operation === 'getCompany') {
						endpoint = '/api/linkedin/company';
						body.company = this.getNodeParameter('company', i) as string;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getCompanyEmployees') {
						endpoint = '/api/linkedin/company/employees';
						const companiesValue = this.getNodeParameter('companies', i) as string;
						body.companies = companiesValue.split(',').map((item) => item.trim());
						body.keywords = this.getNodeParameter('keywords', i, '') as string;
						body.first_name = this.getNodeParameter('firstName', i, '') as string;
						body.last_name = this.getNodeParameter('lastName', i, '') as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getCompanyPosts') {
						endpoint = '/api/linkedin/company/posts';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'getCompanyEmployeeStats') {
						endpoint = '/api/linkedin/company/employee_stats';
						body.urn = this.getNodeParameter('urn', i) as string;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				} else if (resource === 'search') {
					if (operation === 'salesNavigatorSearch') {
						endpoint = '/api/linkedin/sn_search/users';
						body.keywords = this.getNodeParameter('keywords', i, '') as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;

						const additionalFilters = this.getNodeParameter(
							'additionalFilters',
							i,
							{},
						) as IDataObject;

						// text fields → arrays
						const textFields = ['first_names', 'last_names', 'current_titles', 'past_titles'];
						for (const field of textFields) {
							if (additionalFilters[field]) {
								body[field] = (additionalFilters[field] as string)
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean);
							}
						}

						// URN fields → array if all items are URNs, otherwise back to comma-string
						const urnPrefixes: Record<string, string> = {
							industry: 'urn:li:industry:',
							location: 'urn:li:geo:',
							current_companies: 'urn:li:company:',
							past_companies: 'urn:li:company:',
							education: 'urn:li:company:',
							company_locations: 'urn:li:geo:',
						};
						for (const [field, prefix] of Object.entries(urnPrefixes)) {
							const raw = additionalFilters[field];
							if (raw == null) continue;

							const arr = Array.isArray(raw)
								? raw.map((item) => String(item).trim()).filter(Boolean)
								: String(raw)
										.split(',')
										.map((item) => item.trim())
										.filter(Boolean);
							if (arr.length === 0) continue;

							const allUrns = arr.every((item) => item.startsWith(prefix));
							body[field] = allUrns ? arr : arr.join(', ');
						}

						// boolean flag
						if (additionalFilters.is_posted_on_linkedin !== undefined) {
							body.is_posted_on_linkedin = additionalFilters.is_posted_on_linkedin as boolean;
						}

						// multi-option fields → as-is
						const multiOptionFields = [
							'company_sizes',
							'company_types',
							'languages',
							'functions',
							'levels',
							'years_in_the_current_company',
							'years_in_the_current_position',
						];
						for (const field of multiOptionFields) {
							if (Array.isArray(additionalFilters[field])) {
								body[field] = additionalFilters[field];
							}
						}

						// Single keyword filters
						if (additionalFilters.company_keyword) {
							body.company_keyword = additionalFilters.company_keyword as string;
						}
						if (additionalFilters.past_company_keyword) {
							body.past_company_keyword = additionalFilters.past_company_keyword as string;
						}
					} else if (operation === 'searchJobs') {
						endpoint = '/api/linkedin/search/jobs';
						body.keywords = this.getNodeParameter('keywords', i, '') as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;

						const additionalFilters = this.getNodeParameter(
							'additionalFilters',
							i,
							{},
						) as IDataObject;
						if (additionalFilters.sort) body.sort = additionalFilters.sort;
						if (additionalFilters.experience_level)
							body.experience_level = additionalFilters.experience_level;
						if (additionalFilters.job_types) body.job_types = additionalFilters.job_types;
						if (additionalFilters.work_types) body.work_types = additionalFilters.work_types;
						if (additionalFilters.industry) body.industry = additionalFilters.industry;
						if (additionalFilters.company) {
							if (
								typeof additionalFilters.company === 'string' &&
								additionalFilters.company.includes(',')
							) {
								body.company = additionalFilters.company.split(',').map((item) => item.trim());
							} else {
								body.company = additionalFilters.company;
							}
						}
						if (additionalFilters.location) body.location = additionalFilters.location;
						if (additionalFilters.from_date) body.from_date = additionalFilters.from_date;
						if (additionalFilters.to_date) body.to_date = additionalFilters.to_date;
					} else if (operation === 'searchCompanies') {
						endpoint = '/api/linkedin/search/companies';
						body.keywords = this.getNodeParameter('keywords', i, '') as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;

						const additionalFilters = this.getNodeParameter(
							'additionalFilters',
							i,
							{},
						) as IDataObject;
						if (additionalFilters.location) body.location = additionalFilters.location;
						if (additionalFilters.industry) body.industry = additionalFilters.industry;
						if (additionalFilters.employee_count)
							body.employee_count = additionalFilters.employee_count;
					} else if (operation === 'searchIndustries') {
						endpoint = '/api/linkedin/search/industries';
						body.name = this.getNodeParameter('name', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'searchLocations') {
						endpoint = '/api/linkedin/search/locations';
						body.name = this.getNodeParameter('name', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				} else if (resource === 'google') {
					if (operation === 'searchCompanies') {
						endpoint = '/api/linkedin/google/company';
						const keywordsValue = this.getNodeParameter('keywords', i) as string;
						body.keywords = keywordsValue.split(',').map((item) => item.trim());
						body.with_urn = this.getNodeParameter('withUrn', i, false) as boolean;
						body.count_per_keyword = this.getNodeParameter('countPerKeyword', i, 1) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					} else if (operation === 'googleSearch') {
						endpoint = '/api/google/search';
						body.query = this.getNodeParameter('query', i) as string;
						body.count = this.getNodeParameter('count', i, 10) as number;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				} else if (resource === 'group') {
					if (operation === 'getGroup') {
						endpoint = '/api/linkedin/group';
						body.group = this.getNodeParameter('group', i) as string;
						body.timeout = this.getNodeParameter('timeout', i, 300) as number;
					}
				}

				const options: IHttpRequestOptions = {
					method,
					url: `https://api.horizondatawave.ai${endpoint}`,
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

import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class HdwJobBoards implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HDW Job Boards (beta)',
		name: 'hdwJobBoards',
		icon: 'file:hdw_logo.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integrate with Horizon Data Wave Job Boards API',
		defaults: {
			name: 'HDW Job Boards',
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
					{ name: 'Glassdoor', value: 'glassdoor' },
				],
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
						action: 'Search for Glassdoor job listings',
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
			// Glassdoor Job List Parameters
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
						description: 'Location name, e.g., "New York". Used if searching within a specific city/state.',
						routing: { request: { body: { location: '={{$value}}' } } }
					},
					{
						displayName: 'Location ID',
						name: 'location_id',
						type: 'string',
						default: '',
						description: 'Internal Glassdoor location ID (usually not set directly).',
						routing: { request: { body: { location_id: '={{$value}}' } } }
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
						default: '',
						description: 'Location type (CITY, STATE, or COUNTRY).',
						routing: { request: { body: { location_type: '={{$value}}' } } }
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
						description: 'Country for the Glassdoor domain.',
						routing: { request: { body: { country: '={{$value}}' } } }
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination from 1 to 10 (default: 1).',
						routing: { request: { body: { page: '={{$value}}' } } }
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
						description: 'Company size filter.',
						routing: { request: { body: { company_size: '={{$value}}' } } }
					},
					{
						displayName: 'Remote Only',
						name: 'is_remote',
						type: 'boolean',
						default: false,
						description: 'Whether to filter only remote jobs.',
						routing: { request: { body: { is_remote: '={{$value}}' } } }
					},
					{
						displayName: 'Hours Old',
						name: 'hours_old',
						type: 'number',
						default: '',
						description: 'Show job listings published in the last X hours.',
						routing: { request: { body: { hours_old: '={{$value}}' } } }
					},
					{
						displayName: 'Easy Apply',
						name: 'easy_apply',
						type: 'boolean',
						default: false,
						description: 'Filter job listings with "Easy Apply".',
						routing: { request: { body: { easy_apply: '={{$value}}' } } }
					},
					{
						displayName: 'Job Type',
						name: 'job_type',
						type: 'string',
						default: '',
						description: 'Job type (e.g., "fulltime", "parttime", etc.). Supports international variants.',
						routing: { request: { body: { job_type: '={{$value}}' } } }
					},
				],
			}
		],
	};
}

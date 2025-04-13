import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class HdwWebParser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HDW Web Parser (beta)',
		name: 'hdwWebParser',
		icon: 'file:hdw_logo.png',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Parse and crawl websites using Horizon Data Wave API',
		defaults: {
			name: 'HDW Web Parser',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape',
						value: 'scrape',
						description: 'Scrape a single webpage',
						action: 'Scrape a single webpage',
					},
					{
						name: 'Map',
						value: 'map',
						description: 'Discover URLs from a starting point',
						action: 'Discover URLs from a starting point',
					},
					{
						name: 'Crawl',
						value: 'crawl',
						description: 'Start a crawl of multiple pages from a URL',
						action: 'Start a crawl of multiple pages from a URL',
					},
				],
				default: 'scrape',
			},
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'string',
				default: '',
				description: 'Custom API base URL (leave empty to use default)',
			},
			// Scrape Parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				description: 'The URL to scrape',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Formats',
				name: 'formats',
				type: 'multiOptions',
				options: [
					{ name: 'Markdown', value: 'markdown' },
					{ name: 'HTML', value: 'html' },
					{ name: 'Raw HTML', value: 'rawHtml' },
					{ name: 'Screenshot', value: 'screenshot' },
					{ name: 'Links', value: 'links' },
					{ name: 'Full Page Screenshot', value: 'screenshot@fullPage' },
				],
				default: ['markdown'],
				description: 'Content formats to extract',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Only Main Content',
				name: 'onlyMainContent',
				type: 'boolean',
				default: true,
				description: 'Extract only the main content, filtering out navigation, footers, etc.',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Mobile',
				name: 'mobile',
				type: 'boolean',
				default: false,
				description: 'Use mobile viewport',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Skip TLS Verification',
				name: 'skipTlsVerification',
				type: 'boolean',
				default: false,
				description: 'Skip TLS certificate verification',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Timeout (ms)',
				name: 'timeout',
				type: 'number',
				default: 10000,
				description: 'Maximum time in milliseconds to wait for the page to load',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Remove Base64 Images',
				name: 'removeBase64Images',
				type: 'boolean',
				default: false,
				description: 'Remove base64 encoded images from output',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			// Map Parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				description: 'Starting URL for URL discovery',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Search Term',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Optional search term to filter URLs',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Ignore Sitemap',
				name: 'ignoreSitemap',
				type: 'boolean',
				default: false,
				description: 'Skip sitemap.xml discovery and only use HTML links',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Sitemap Only',
				name: 'sitemapOnly',
				type: 'boolean',
				default: false,
				description: 'Only use sitemap.xml for discovery, ignore HTML links',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Include Subdomains',
				name: 'includeSubdomains',
				type: 'boolean',
				default: false,
				description: 'Include URLs from subdomains in results',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 1000,
				description: 'Maximum number of URLs to return',
				displayOptions: { show: { operation: ['map'] } },
			},
			// Crawl Parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				description: 'Starting URL for the crawl',
				displayOptions: { show: { operation: ['crawl'] } },
			},
			{
				displayName: 'Timeout (seconds)',
				name: 'timeout',
				type: 'number',
				default: 300,
				description: 'Maximum time in seconds for the crawl operation',
				displayOptions: { show: { operation: ['crawl'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const customBaseUrl = this.getNodeParameter('baseUrl', i, '') as string;

				let endpoint = '';
				const body: Record<string, any> = {};

				// Use custom base URL if provided, otherwise use default
				const baseURL = customBaseUrl || 'https://api.horizondatawave.ai/api/website';

				if (operation === 'scrape') {
					endpoint = '/scrape';
					body.url = this.getNodeParameter('url', i) as string;
					body.formats = this.getNodeParameter('formats', i) as string[];
					body.onlyMainContent = this.getNodeParameter('onlyMainContent', i) as boolean;
					body.mobile = this.getNodeParameter('mobile', i) as boolean;
					body.skipTlsVerification = this.getNodeParameter('skipTlsVerification', i) as boolean;
					body.timeout = this.getNodeParameter('timeout', i) as number;
					body.removeBase64Images = this.getNodeParameter('removeBase64Images', i) as boolean;
				}
				else if (operation === 'map') {
					endpoint = '/map';
					body.url = this.getNodeParameter('url', i) as string;

					const search = this.getNodeParameter('search', i, '') as string;
					if (search) {
						body.search = search;
					}

					body.ignoreSitemap = this.getNodeParameter('ignoreSitemap', i) as boolean;
					body.sitemapOnly = this.getNodeParameter('sitemapOnly', i) as boolean;
					body.includeSubdomains = this.getNodeParameter('includeSubdomains', i) as boolean;
					body.limit = this.getNodeParameter('limit', i) as number;
				}
				else if (operation === 'crawl') {
					endpoint = '/crawl';
					body.url = this.getNodeParameter('url', i) as string;
					body.timeout = this.getNodeParameter('timeout', i) as number;
				}

				const options = {
					method: 'POST' as const,
					url: `${baseURL}${endpoint}`,
					body,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					json: true,
				};

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'hdwLinkedinApi',
					options
				);

				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					// @ts-ignore
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

# n8n-nodes-hdw

This is an n8n community node. It lets you use Horizon Data Wave LinkedIn API services in your n8n workflows.

Horizon Data Wave provides advanced LinkedIn data extraction capabilities, allowing you to search for users, view profiles, analyze posts, and gather company information.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.
[NPM Packege](https://www.npmjs.com/package/n8n-nodes-hdw)

```bash
npm install n8n-nodes-hdw
```

## Operations

This node supports the following resources and operations:

### User Resource
- **Search**: Search for LinkedIn users with various filters including keywords, name, title, company, location
- **Get Profile**: Get detailed LinkedIn user profile information
- **Get Posts**: Retrieve posts from a specific LinkedIn user
- **Get Reactions**: Get reactions from a specific LinkedIn user

### Email Resource
- **Get User by Email**: Find LinkedIn user profiles associated with an email address

### Post Resource
- **Get Post Comments**: Retrieve comments on a LinkedIn post
- **Get Post Reposts**: Get reposts of a LinkedIn post

### Company Resource
- **Get Company**: Retrieve detailed information about a LinkedIn company
- **Get Company Employees**: Search for employees of a specific LinkedIn company

### Search Resource
- **Sales Navigator Search**: Perform advanced user searches using LinkedIn Sales Navigator filters

### Google Resource
- **Search Companies**: Find LinkedIn companies using Google search
- **Google Search**: Perform a general Google search

## Credentials

To use this node, you need an API key from Horizon Data Wave:

1. Register for an account at [horizondatawave.ai](https://app.horizondatawave.ai/)
2. Navigate to your account settings to generate an API key
3. For operations that require account management (like chat, connections, etc.), you'll also need to provide your Account ID

When setting up the node in n8n, add your credentials using the "HDW LinkedIn API" credential type.

## Compatibility

- Requires Node.js 18.10 or later
- Compatible with n8n versions that support the N8N Nodes API Version 1

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Horizon Data Wave API Documentation](https://horizondatawave.ai/redoc)
* [Horizon Data Wave Website](https://horizondatawave.ai)

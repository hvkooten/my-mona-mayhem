import type { APIRoute } from 'astro';

export const prerender = false;

// In-memory cache with 5-minute TTL
interface CacheEntry {
	data: any;
	timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

function isCacheValid(entry: CacheEntry): boolean {
	return Date.now() - entry.timestamp < CACHE_TTL;
}

function validateUsername(username: string | undefined): { valid: boolean; error?: string } {
	if (!username) {
		return { valid: false, error: 'Username parameter is required' };
	}

	if (username.trim() === '') {
		return { valid: false, error: 'Username cannot be empty' };
	}

	// GitHub username rules: alphanumeric and hyphens, max 39 characters
	const usernameRegex = /^[a-zA-Z0-9-]{1,39}$/;
	if (!usernameRegex.test(username)) {
		return { 
			valid: false, 
			error: 'Invalid username format. Must be alphanumeric with hyphens, max 39 characters' 
		};
	}

	return { valid: true };
}

export const GET: APIRoute = async ({ params }) => {
	const { username } = params;

	// Validate username
	const validation = validateUsername(username);
	if (!validation.valid) {
		return new Response(
			JSON.stringify({ error: validation.error }),
			{
				status: 400,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			}
		);
	}

	const normalizedUsername = username!.toLowerCase();

	// Check cache
	const cachedEntry = cache.get(normalizedUsername);
	if (cachedEntry && isCacheValid(cachedEntry)) {
		return new Response(
			JSON.stringify(cachedEntry.data),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'X-Cache': 'HIT',
				},
			}
		);
	}

	// Fetch from GitHub
	try {
		const githubUrl = `https://github.com/${username}.contribs`;
		const response = await fetch(githubUrl);

		if (!response.ok) {
			if (response.status === 404) {
				return new Response(
					JSON.stringify({ 
						error: `User '${username}' not found on GitHub`,
						details: 'The username does not exist or has no public contributions'
					}),
					{
						status: 404,
						headers: { 
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}

			if (response.status === 503) {
				return new Response(
					JSON.stringify({ 
						error: 'GitHub service temporarily unavailable',
						details: 'Please try again in a few moments'
					}),
					{
						status: 503,
						headers: { 
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
						},
					}
				);
			}

			return new Response(
				JSON.stringify({ 
					error: 'Failed to fetch contribution data from GitHub',
					details: `GitHub returned status ${response.status}`
				}),
				{
					status: 500,
					headers: { 
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		const data = await response.json();

		// Validate response structure
		if (!data || typeof data !== 'object') {
			return new Response(
				JSON.stringify({ 
					error: 'Invalid response from GitHub',
					details: 'Received malformed contribution data'
				}),
				{
					status: 500,
					headers: { 
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		// Store in cache
		cache.set(normalizedUsername, {
			data,
			timestamp: Date.now(),
		});

		return new Response(
			JSON.stringify(data),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Cache-Control': 'public, max-age=300',
					'X-Cache': 'MISS',
				},
			}
		);
	} catch (error) {
		console.error('Error fetching GitHub contributions:', error);
		
		return new Response(
			JSON.stringify({ 
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error occurred',
				username
			}),
			{
				status: 500,
				headers: { 
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			}
		);
	}
};

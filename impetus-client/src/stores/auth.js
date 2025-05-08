import { writable } from 'svelte/store';

export const user = writable(null);
export const isLoading = writable(true);
export const error = writable(null);

function getToken() {
	const token = new URLSearchParams(window.location.search).get('token');
	if (token) {
		localStorage.setItem('token', token);
		window.history.replaceState({}, '', '/');
		return token;
	}

	return localStorage.getItem('token');
}

export const fetchUser = async () => {
	isLoading.set(true);
	error.set(null);
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const token = getToken();
	if (!token) {
		user.set(null);
		isLoading.set(false);
		return;
	}

	try {
		const response = await fetch('/api/users/profile', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			user.set(await response.json());
		} else {
			throw new Error('Not authenticated');
		}
	} catch (error) {
		error.set(error.message);
		localStorage.removeItem('token');
	} finally {
		isLoading.set(false);
	}
};

export const logout = () => {
	user.set(null);
	localStorage.removeItem('token');
};

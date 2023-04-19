// Implementation of long polling: https://javascript.info/long-polling
export async function longPoll(callback: any, everySeconds = 5) {
	const response = await callback();
	return response;
}

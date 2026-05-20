import axios from 'axios';

let handler = async (m, { usedPrefix, command, text }) => {
	if (!text) throw `Usage: ${usedPrefix + command} Ela Vira Mortal`;
	m.react('🔁');

	try {
		const res = await yts(text);

		const Audio = res.map((item) => ({
			title: item.title,
			description: `🕛 ${item.duration} | 👤 ${item.channel}`,
			id: `${usedPrefix}ytmp3 ${item.url}`,
		}));

		const Video = res.map((item) => ({
			title: item.title,
			description: `🕛 ${item.duration} | 👤 ${item.channel}`,
			id: `${usedPrefix}ytmp4 ${item.url}`,
		}));

		conn.sendButton(
			m.chat,
			{
				text: `Search results for "${text}"`,
				footer: global.namebot,
				buttons: [
					{
						name: 'single_select',
						buttonParamsJson: JSON.stringify({
							title: 'Audio (MP3)',
							sections: [
								{
									title: 'Audio List',
									rows: Audio,
								},
							],
						}),
					},
					{
						name: 'single_select',
						buttonParamsJson: JSON.stringify({
							title: 'Video (MP4)',
							sections: [
								{
									title: 'Video List',
									rows: Video,
								},
							],
						}),
					},
				],
				messageParamsJson: JSON.stringify({
					bottom_sheet: {
						list_title: 'YouTube Downloader',
						button_title: 'Choose Format',
						in_thread_buttons_limit: 1,
					},
				}),
			},
			{ quoted: m }
		);
	} catch (e) {
		return m.reply(e.message);
	}
};

handler.help = ['yts'];
handler.tags = ['downloader'];
handler.command = /^(yts)$/i;
handler.limit = false;

export default handler;

// Scrape Link: https://github.com/purujawa06-bot/Na-api/blob/main/lib/ytsearch.js

/**
 * Function to search songs on devers-en-geste.fr and display YouTube links
 * @param {string} query - Search keyword
 */
async function yts(query) {
	if (!query) throw new Error('Query is required.');

	const baseURL = 'https://www.devers-en-geste.fr/search';

	try {
		const response = await axios.get(baseURL, {
			params: {
				q: query,
			},
			headers: {
				Accept: 'application/json, text/javascript, */*; q=0.01',
				'X-Requested-With': 'XMLHttpRequest',
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
				Referer: 'https://www.devers-en-geste.fr/',
			},
		});

		const data = response.data;

		if (!data.items) return [];

		return data.items.map((item) => ({
			title: item.title,
			url: `https://www.youtube.com/watch?v=${item.id}`,
			videoId: item.id,
			channel: item.channelTitle,
			duration: item.duration,
			size: item.size,
			thumbnail: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
		}));
	} catch (error) {
		throw new Error(error.message);
	}
}
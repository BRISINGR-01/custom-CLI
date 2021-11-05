module.exports = query => query.includes('?')
	? Object.fromEntries(
			query
			.replace(/.*?\?/, '')
			.split('&')
			.map(subQuery => subQuery.split('='))
		)
	: '';
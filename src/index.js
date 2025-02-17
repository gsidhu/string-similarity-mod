module.exports = {
	compareTwoStrings:compareTwoStrings,
	findBestMatch:findBestMatch
};

function compareTwoStrings(first, second) {
	first = first.replace(/\s+/g, '')
	second = second.replace(/\s+/g, '')

	if (first === second) return 1; // identical or empty
	if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

	let firstBigrams = new Map();
	for (let i = 0; i < first.length - 1; i++) {
		const bigram = first.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram) + 1
			: 1;

		firstBigrams.set(bigram, count);
	};

	let intersectionSize = 0;
	for (let i = 0; i < second.length - 1; i++) {
		const bigram = second.substring(i, i + 2);
		const count = firstBigrams.has(bigram)
			? firstBigrams.get(bigram)
			: 0;

		if (count > 0) {
			firstBigrams.set(bigram, count - 1);
			intersectionSize++;
		}
	}

	return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

function findBestMatch(mainString, targetStrings, _threshold=0) {
	if (!areArgsValid(mainString, targetStrings, _threshold)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings. Third is an optional number between 0 and 1.');
	
	const ratings = [];
	let bestMatchIndex = 0;

	for (let i = 0; i < targetStrings.length; i++) {
		const currentTargetString = targetStrings[i];
		const currentRating = compareTwoStrings(mainString, currentTargetString)

		// MOD 2
		if (currentRating < _threshold) continue;
		// Why do this?
		// This way the user is saved a for-loop later on to filter out the matches that are below the threshold
		// END MOD 2

		// MOD 1
		// Return the index of the target string along with its rating
		ratings.push({target: currentTargetString, rating: currentRating, index: i})
		// Why do this?
		// This helps in the case that the user originally has an array of objects in which name is just one of the values
		// The user passes the names in a separate array (targetStrings) to findBestMatch
		// Then if the user filters based on the threshold rating, the original index is still retained
		// So the user can find the match in the original array by using this index
		// END MOD 1
		if (currentRating > ratings[bestMatchIndex].rating) {
			// MOD 2 (cont.) Have to change this because the i refers to the index of the targetStrings array
			// but bestMatchIndex refers to the ratings array which becomes a subset of targetStrings if threshold != 0
			bestMatchIndex = ratings.length - 1
			// END MOD 2
		}
	}
	
	
	const bestMatch = ratings[bestMatchIndex]
	
	return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex };
}

function areArgsValid(mainString, targetStrings, threshold) {
	if (typeof mainString !== 'string') return false;
	if (!Array.isArray(targetStrings)) return false;
	if (!targetStrings.length) return false;
	if (targetStrings.find( function (s) { return typeof s !== 'string'})) return false;
	if (typeof threshold !== 'number') return false;
	return true;
}
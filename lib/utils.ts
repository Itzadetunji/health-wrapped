import AsyncStorage from "@react-native-async-storage/async-storage";

// Store data
export const storeData = async (key: string, value: any) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		console.error("Error saving data", e);
	}
};

// Retrieve data
export const getData = async (key: string) => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.error("Error reading data", e);
	}
};

// Remove data
export const removeData = async (key: string) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.error("Error removing data", e);
	}
};

// Clear all data
export const clearAll = async () => {
	try {
		await AsyncStorage.clear();
	} catch (e) {
		console.error("Error clearing data", e);
	}
};

export const getStepsQuote = (steps: number, isMonth: boolean = false) => {
	const period = isMonth ? "month" : "year";
	if (steps === 0)
		return `Hmm, looks like you took a ${period} off from walking. The couch called, you answered.`;
	if (steps < (isMonth ? 80000 : 1000000))
		return "Every journey begins with a single step. You took a few this time!";
	if (steps < (isMonth ? 250000 : 3000000))
		return "You walked the equivalent of crossing a small country!";
	if (steps < (isMonth ? 400000 : 5000000))
		return "You could've walked from New York to Los Angeles with those steps!";
	return `You walked the equivalent of ${isMonth ? "4" : "50"} marathons this ${period}. Legend.`;
};

export const getSwimQuote = (distance: number, isMonth: boolean = false) => {
	const period = isMonth ? "month" : "year";
	if (distance === 0)
		return `Hmm, you didn't get to swim this ${period}. I'm sure the sharks missed you.`;
	if (distance < (isMonth ? 400 : 5000))
		return "You dipped your toes in! Every stroke counts.";
	if (distance < (isMonth ? 1600 : 20000))
		return "Just keep swimming, just keep swimming...";
	if (distance < (isMonth ? 4000 : 50000))
		return "You could've swam across the English Channel with that distance!";
	return "Michael Phelps is taking notes. Seriously impressive.";
};

export const getCaloriesQuote = (
	calories: number,
	isMonth: boolean = false,
) => {
	if (calories === 0)
		return "Zero calories burned? Were you in hibernation mode?";
	if (calories < (isMonth ? 8000 : 100000))
		return "You're warming up! Every calorie burned is progress.";
	if (calories < (isMonth ? 25000 : 300000))
		return "That's enough energy to power a small village!";
	if (calories < (isMonth ? 40000 : 500000))
		return "You could've run your own fitness empire with that energy!";
	return `That's about ${isMonth ? "25" : "300"} slices of pizza! Or ${isMonth ? "40" : "500"} donuts. Your choice.`;
};

export const getSleepQuote = (hours: number, isMonth: boolean = false) => {
	if (hours === 0)
		return "Did you even sleep? Please tell me you blinked at least.";
	if (hours < (isMonth ? 160 : 2000))
		return "Burning the candle at both ends? Your pillow misses you.";
	if (hours < (isMonth ? 200 : 2500))
		return "Decent rest, but your dreams want more screen time.";
	if (hours < (isMonth ? 250 : 3000))
		return "Sleep is the best meditation. You're getting good at it!";
	return "You're basically a professional sleeper. Olympic-level dreaming.";
};

export const getFlightsQuote = (flights: number, isMonth: boolean = false) => {
	if (flights === 0)
		return "Stairs? Never heard of them. Team elevator all the way.";
	if (flights < (isMonth ? 40 : 500))
		return "Baby steps to the summit! Keep climbing.";
	if (flights < (isMonth ? 160 : 2000))
		return "You climbed higher than most people's ambitions!";
	if (flights < (isMonth ? 400 : 5000))
		return "That's halfway up Mount Everest. Without the oxygen mask.";
	return "Ain't no mountain high enough. You conquered them all.";
};

export const getExerciseQuote = (minutes: number, isMonth: boolean = false) => {
	if (minutes === 0) return "Exercise? In this economy? Fair enough.";
	if (minutes < (isMonth ? 80 : 1000))
		return "Rome wasn't built in a day, and neither is fitness!";
	if (minutes < (isMonth ? 400 : 5000))
		return "You're building momentum! The gains are real.";
	if (minutes < (isMonth ? 800 : 10000))
		return "Stronger every single day. Keep that fire burning!";
	return "You basically lived at the gym. Respect.";
};

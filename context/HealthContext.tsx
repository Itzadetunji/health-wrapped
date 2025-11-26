import HealthKit, {
	type CategoryTypeIdentifier,
	CategoryValueSleepAnalysis,
	type QuantityTypeIdentifier,
	requestAuthorization,
} from "@kingstinct/react-native-healthkit";
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useState,
} from "react";
import { Alert } from "react-native";

export interface HealthData {
	steps: number;
	swimDistance: number;
	calories: number;
	sleep: number; // in hours
	flights: number;
	exercise: number; // in minutes
}

interface HealthContextType {
	data: HealthData;
	loading: boolean;
	authorized: boolean;
	isPro: boolean;
	selectedYear: number;
	setSelectedYear: Dispatch<SetStateAction<number>>;
	authenticate: () => Promise<boolean>;
	fetchDataForYear: (year: number) => Promise<HealthData | null>;
	togglePro: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
	const currentYear = new Date().getFullYear();

	const [data, setData] = useState<HealthData>({
		steps: 0,
		swimDistance: 0,
		calories: 0,
		sleep: 0,
		flights: 0,
		exercise: 0,
	});
	const [loading, setLoading] = useState(false);
	const [authorized, setAuthorized] = useState(false);
	const [isPro, setIsPro] = useState(true);
	const [selectedYear, setSelectedYear] = useState(currentYear);

	const togglePro = () => setIsPro((prev) => !prev);

	const fetchDataForYear = async (year: number): Promise<HealthData | null> => {
		setLoading(true);
		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		// If current year, cap end date to now
		const now = new Date();
		if (year === now.getFullYear()) {
			// Use now as end date if we are looking at current year
			// But actually, for "Wrapped" usually you want up to now.
			// Let's just use the full year range, HealthKit handles future dates fine (returns 0 or up to now)
		}

		try {
			// Steps
			const stepsStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierStepCount",
				["cumulativeSum"],
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);
			const steps = stepsStats.sumQuantity?.quantity ?? 0;

			// Swim Distance
			const swimStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierDistanceSwimming",
				["cumulativeSum"],
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);
			const swimDistance = swimStats.sumQuantity?.quantity ?? 0;

			// Calories
			const caloriesStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierActiveEnergyBurned",
				["cumulativeSum"],
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);
			const calories = caloriesStats.sumQuantity?.quantity ?? 0;

			// Flights
			const flightsStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierFlightsClimbed",
				["cumulativeSum"],
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);
			const flights = flightsStats.sumQuantity?.quantity ?? 0;

			// Exercise Time
			const exerciseStats = await HealthKit.queryStatisticsForQuantity(
				"HKQuantityTypeIdentifierAppleExerciseTime",
				["cumulativeSum"],
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);
			const exercise = exerciseStats.sumQuantity?.quantity ?? 0;

			// Sleep
			const sleepSamples = await HealthKit.queryCategorySamples(
				"HKCategoryTypeIdentifierSleepAnalysis",
				{
					filter: {
						startDate,
						endDate,
					},
				}
			);

			let totalSleepMinutes = 0;
			sleepSamples.forEach((sample) => {
				if (
					sample.value === CategoryValueSleepAnalysis.asleepUnspecified ||
					sample.value === CategoryValueSleepAnalysis.asleepCore ||
					sample.value === CategoryValueSleepAnalysis.asleepDeep ||
					sample.value === CategoryValueSleepAnalysis.asleepREM
				) {
					const start = new Date(sample.startDate).getTime();
					const end = new Date(sample.endDate).getTime();
					totalSleepMinutes += (end - start) / (1000 * 60);
				}
			});
			const sleep = totalSleepMinutes / 60; // Hours

			const newData = {
				steps,
				swimDistance,
				calories,
				sleep,
				flights,
				exercise,
			};

			setData(newData);
			return newData;
		} catch (e) {
			console.error("Error fetching health data", e);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const authenticate = async () => {
		setLoading(true);
		try {
			const readPermissions: (
				| QuantityTypeIdentifier
				| CategoryTypeIdentifier
			)[] = [
				"HKQuantityTypeIdentifierStepCount",
				"HKQuantityTypeIdentifierDistanceSwimming",
				"HKQuantityTypeIdentifierActiveEnergyBurned",
				"HKCategoryTypeIdentifierSleepAnalysis",
				"HKQuantityTypeIdentifierFlightsClimbed",
				"HKQuantityTypeIdentifierAppleExerciseTime",
			];

			const isAuthorized = await requestAuthorization({
				toRead: readPermissions,
			});

			setAuthorized(isAuthorized);

			if (isAuthorized) {
				const fetchedData = await fetchDataForYear(new Date().getFullYear());
				if (fetchedData && fetchedData.steps === 0) {
					Alert.alert(
						"No Health Data Found",
						"We couldn't find any steps data for this year. Please ensure you have granted 'Steps' permission in Health settings.\n\nGo to Settings > Health > Data Access & Devices > Health Wrapped > Turn On All",
						[{ text: "OK" }]
					);
				}
			}
			return isAuthorized;
		} catch (e) {
			console.error("Error requesting authorization", e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return (
		<HealthContext.Provider
			value={{
				data,
				loading,
				authorized,
				isPro,
				selectedYear,
				setSelectedYear,
				authenticate,
				fetchDataForYear,
				togglePro,
			}}
		>
			{children}
		</HealthContext.Provider>
	);
};

export const useHealth = () => {
	const context = useContext(HealthContext);
	if (context === undefined) {
		throw new Error("useHealth must be used within a HealthProvider");
	}
	return context;
};

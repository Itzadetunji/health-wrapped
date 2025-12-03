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
	useEffect,
	useState,
} from "react";
import { Alert, Platform } from "react-native";
import Purchases, { type CustomerInfo } from "react-native-purchases";

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
	selectedMonth: number | null;
	setSelectedMonth: Dispatch<SetStateAction<number | null>>;
	authenticate: () => Promise<boolean>;
	fetchDataForYear: (
		year: number,
		month?: number | null
	) => Promise<HealthData | null>;
	updateProStatus: (customerInfo: CustomerInfo) => void;
	restorePurchases: () => Promise<void>;
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
	const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // null = full year

	useEffect(() => {
		Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

		if (Platform.OS === "ios") {
			Purchases.configure({ apiKey: "appl_YCLwMgPFWYNCUKxYgEOiOQxWAHM" });
		}

		getCustomerInfo();
		// getOfferings();
	}, []);
	// test_UcQQRwJVPXUxmGlfsgBojPxMNrH
	// appl_YCLwMgPFWYNCUKxYgEOiOQxWAHM

	const getCustomerInfo = async () => {
		const customerInfo = await Purchases.getCustomerInfo();
		console.log("Customer Info:", customerInfo);
		updateProStatus(customerInfo);
	};

	// const getOfferings = async () => {
	// 	const offerings = await Purchases.getOfferings();
	// 	if (
	// 		offerings.current !== null &&
	// 		offerings.current.availablePackages.length !== 0
	// 	) {
	// 		console.log("Offerings:", JSON.stringify(offerings, null, 2));
	// 	}
	// };

	const updateProStatus = (customerInfo: CustomerInfo) => {
		const isProActive =
			typeof customerInfo.entitlements.active.health_wrapped_yearly !==
			"undefined";
		// setIsPro(isProActive);
		setIsPro(true);
	};

	const restorePurchases = async () => {
		try {
			const customerInfo = await Purchases.restorePurchases();
			updateProStatus(customerInfo);
			if (
				typeof customerInfo.entitlements.active.health_wrapped_yearly !==
				"undefined"
			) {
				Alert.alert("Success", "Purchases restored successfully");
			} else {
				Alert.alert("Notice", "No active subscription found to restore");
			}
		} catch (e: any) {
			Alert.alert("Error", e.message);
		}
	};

	const fetchDataForYear = async (
		year: number,
		month: number | null = null
	): Promise<HealthData | null> => {
		setLoading(true);

		const now = new Date();
		let startDate: Date;
		let endDate: Date;

		if (month !== null && typeof month === "number") {
			// month is 0-indexed (0 = January)
			startDate = new Date(year, month, 1, 0, 0, 0);
			// last day of the month: create date for the 0th day of next month
			endDate = new Date(year, month + 1, 0, 23, 59, 59);
		} else {
			// Full year
			startDate = new Date(year, 0, 1, 0, 0, 0);
			endDate = new Date(year, 11, 31, 23, 59, 59);
		}

		// If querying the current year (or current month within the current year), cap the end date to now
		if (year === now.getFullYear()) {
			if (month === null) {
				endDate = now;
			} else if (typeof month === "number") {
				// If the month being requested is the current month or a future month, cap to now
				const monthStart = new Date(year, month, 1);
				const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
				if (now >= monthStart && now <= monthEnd) {
					endDate = now;
				} else if (now < monthStart) {
					// requesting a future month - set endDate to now which will produce no data
					endDate = now;
				}
			}
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
				selectedMonth,
				setSelectedMonth,
				authenticate,
				fetchDataForYear,
				restorePurchases,
				updateProStatus,
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

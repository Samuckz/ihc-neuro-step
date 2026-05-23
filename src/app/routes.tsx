import { createBrowserRouter } from "react-router";
import { HomeScreen } from "./components/HomeScreen";
import { UserConfigScreen } from "./components/UserConfigScreen";
import { TrainingTypeScreen } from "./components/TrainingTypeScreen";
import { ExerciseSelectionScreen } from "./components/ExerciseSelectionScreen";
import { ExerciseExecutionScreen } from "./components/ExerciseExecutionScreen";
import { ResultsScreen } from "./components/ResultsScreen";

export const router = createBrowserRouter([
  { path: "/", Component: HomeScreen },
  { path: "/config", Component: UserConfigScreen },
  { path: "/training-type", Component: TrainingTypeScreen },
  { path: "/exercises", Component: ExerciseSelectionScreen },
  { path: "/execution", Component: ExerciseExecutionScreen },
  { path: "/results", Component: ResultsScreen },
]);

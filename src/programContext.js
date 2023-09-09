import { createContext } from 'react';

/*
createContext method will help us create a Context instance,
which will help us send data to the various components
 */

export const ProgramContext = createContext(undefined);
export const WorkoutContext = createContext(undefined);
export const ProgramScheduleContext = createContext(undefined);
export const ProgramScheduleAssignmentContext = createContext(undefined);
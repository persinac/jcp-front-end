export const postProgramAndSchedule = async (programName, programType, programDescription, programScheduleStartDate, programScheduleEndDate) => {
    const response = await fetch(`${process.env.API_URL}/bot/register`,
        {
            method: "POST",
            body: JSON.stringify({
                "programName": programName,
                "programType": programType,
                "programDescription": programDescription,
                "programScheduleStartDate": programScheduleStartDate,
                "programScheduleEndDate": programScheduleEndDate
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

export const getProgramCount = async () => {
    const response = await fetch(`${process.env.API_URL}/program/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getPrograms = async (currentPage, sortBy) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.API_URL}/program?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getAllProgramSchedule = async (currentPage, sortBy) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.API_URL}/program-schedule?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramScheduleByProgramId = async (programId, currentPage, sortBy) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.API_URL}/program-schedule/${programId}?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getWorkoutsByProgramId = async (programId) => {
    const response = await fetch(`${process.env.API_URL}/program-workout/program/${programId}?pageSize=1000`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createNewWorkouts = async (listOfNewWorkouts) => {
    const response = await fetch(`${process.env.API_URL}/program-workout`,
        {
            method: "POST",
            body: JSON.stringify(listOfNewWorkouts),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateWorkouts = async (listOfWorkouts) => {
    const response = await fetch(`${process.env.API_URL}/program-workout/update`,
        {
            method: "PUT",
            body: JSON.stringify(listOfWorkouts),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const removeWorkouts = async (workoutIds) => {
    const response = await fetch(`${process.env.API_URL}/program-workout`,
        {
            method: "DELETE",
            body: JSON.stringify(workoutIds),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const getAccountingDataCount = async (table) => {
    const response = await fetch(`${process.env.API_URL}/table/${table}/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getAccountingData = async (table, currentPage) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.API_URL}/table/${table}?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

const formatTimestamp = (dateToFormat) => {
    const copyDate = new Date(dateToFormat);
    const year = copyDate.getFullYear();
    const month = String(copyDate.getMonth() + 1).padStart(2, '0');

    // Ensure day is a two-digit number
    const day = String(copyDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/****************
 PROGRAMS
 ****************/
export const getProgramCount = async () => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getPrograms = async (currentPage, sortBy) => {
    const pageSize = 10;
    const sortByIDAscDesc = sortBy || "DESC";
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByIDAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const updateProgram = async (program) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program/${program.id}`,
        {
            method: "PUT",
            body: JSON.stringify({
                "name": program.name,
                "type": program.type,
                "description": program.description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

export const createProgram = async (program) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program`,
        {
            method: "POST",
            body: JSON.stringify(program),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

/*********************
 PROGRAM SCHEDULE
 *********************/
export const getAllProgramSchedule = async (currentPage, sortBy) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-schedule?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramScheduleByProgramId = async (programId, currentPage, sortBy) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-schedule/program/${programId}?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const updateProgramSchedule = async (programSchedule) => {
    programSchedule.start_date = formatTimestamp(programSchedule.start_date)
    programSchedule.end_date = formatTimestamp(programSchedule.end_date)
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-schedule/${programSchedule.id}`,
        {
            method: "PUT",
            body: JSON.stringify(programSchedule),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const createProgramSchedule = async (programSchedule) => {
    programSchedule.start_date = formatTimestamp(programSchedule.start_date)
    programSchedule.end_date = formatTimestamp(programSchedule.end_date)
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-schedule`,
        {
            method: "POST",
            body: JSON.stringify(programSchedule),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

/*******************************
 PROGRAM ASSIGNMENT
 *******************************/
export const getProgramAssignmentForAssignment = async (programScheduleId) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-assignment/program-schedule/assign/${programScheduleId}?pageSize=1000`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createProgramAssignments = async (newProgramAssignments) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-assignment`,
        {
            method: "POST",
            body: JSON.stringify(newProgramAssignments),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateProgramAssignments = async (modifiedProgramAssignments) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-assignment`,
        {
            method: "PUT",
            body: JSON.stringify(modifiedProgramAssignments),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const deleteProgramAssignments = async (programAssignmentIds) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-assignment`,
        {
            method: "DELETE",
            body: JSON.stringify(programAssignmentIds),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

/*******************************
 WORKOUTS
 ********************************/
export const getWorkoutsByProgramId = async (programId) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-workout/program/${programId}?pageSize=1000`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createNewWorkouts = async (listOfNewWorkouts) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-workout`,
        {
            method: "POST",
            body: JSON.stringify(listOfNewWorkouts),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateWorkouts = async (listOfWorkouts) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-workout/update`,
        {
            method: "PUT",
            body: JSON.stringify(listOfWorkouts),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const removeWorkouts = async (workoutIds) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/program-workout`,
        {
            method: "DELETE",
            body: JSON.stringify(workoutIds),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

/*******************************
 ATHLETES
 *******************************/

export const getAthleteCount = async () => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getAthletes = async (currentPage, sortBy) => {
    const pageSize = 10;
    const sortByNameAscDesc = sortBy || "ASC";
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByNameAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getAthleteById = async (athleteId) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete/${athleteId}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createNewAthlete = async (listOfNewAthletes) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete/create`,
        {
            method: "POST",
            body: JSON.stringify(listOfNewAthletes),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateAthlete = async (listOfAthletes) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete/update`,
        {
            method: "PUT",
            body: JSON.stringify(listOfAthletes),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const removeAthletes = async (athleteIds) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/athlete/remove`,
        {
            method: "DELETE",
            body: JSON.stringify(workoutIds),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

/*******************************
    PROGRAM DELIVERY - DISCORD
 *******************************/
const programDeliveryDiscordDomain = "program-delivery"
const programDeliveryDiscordSubDomain = "discord"
const discordDeliveryURL = `${process.env.JCP_API_ENDPOINT}/api/${programDeliveryDiscordDomain}/${programDeliveryDiscordSubDomain}`
export const getProgramDeliveryDiscordConfigs = async (currentPage, sortBy) => {
    const pageSize = 10;
    const sortByNameAscDesc = sortBy || "ASC";
    const response = await fetch(`${discordDeliveryURL}?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByNameAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramDeliveryDiscordConfigsByProgramId = async (programId, currentPage, sortBy) => {
    const pageSize = 10;
    const sortByNameAscDesc = sortBy || "ASC";
    const response = await fetch(`${discordDeliveryURL}/program/${programId}?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByNameAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramDeliveryDiscordConfigById = async (configId) => {
    const response = await fetch(`${discordDeliveryURL}/${configId}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createProgramDeliveryDiscordConfig = async (listOfConfigs) => {
    const response = await fetch(`${discordDeliveryURL}/create`,
        {
            method: "POST",
            body: JSON.stringify(listOfConfigs),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateProgramDeliveryDiscordConfigs = async (listOfConfigs) => {
    const response = await fetch(`${discordDeliveryURL}/update`,
        {
            method: "PUT",
            body: JSON.stringify(listOfConfigs),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const removeProgramDeliveryDiscordConfigs = async (configIds) => {
    const response = await fetch(`${discordDeliveryURL}/remove`,
        {
            method: "DELETE",
            body: JSON.stringify(configIds),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

/*******************************
 PROGRAM DELIVERY - EMAIL
 *******************************/
const programDeliveryEmailDomain = "program-delivery"
const programDeliveryEmailSubDomain = "email"
const emailDeliveryURL = `${process.env.JCP_API_ENDPOINT}/api/${programDeliveryEmailDomain}/${programDeliveryEmailSubDomain}`
export const getProgramDeliveryEmailConfigs = async (currentPage, sortBy) => {
    const pageSize = 10;
    const sortByNameAscDesc = sortBy || "ASC";
    const response = await fetch(`${emailDeliveryURL}?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByNameAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramDeliveryEmailConfigsByProgramId = async (programId, currentPage, sortBy) => {
    const pageSize = 10;
    const sortByNameAscDesc = sortBy || "ASC";
    const response = await fetch(`${emailDeliveryURL}/program/${programId}?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortByNameAscDesc}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getProgramDeliveryEmailConfigById = async (configId) => {
    const response = await fetch(`${emailDeliveryURL}/${configId}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createProgramDeliveryEmailConfig = async (listOfConfigs) => {
    const response = await fetch(`${emailDeliveryURL}/create`,
        {
            method: "POST",
            body: JSON.stringify(listOfConfigs),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateProgramDeliveryEmailConfigs = async (listOfConfigs) => {
    const response = await fetch(`${emailDeliveryURL}/update`,
        {
            method: "PUT",
            body: JSON.stringify(listOfConfigs),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const removeProgramDeliveryEmailConfigs = async (configIds) => {
    const response = await fetch(`${emailDeliveryURL}/remove`,
        {
            method: "DELETE",
            body: JSON.stringify(configIds),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    return await response.json()
}

export const getAccountingDataCount = async (table) => {
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/table/${table}/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getAccountingData = async (table, currentPage) => {
    const pageSize = 10;
    const response = await fetch(`${process.env.JCP_API_ENDPOINT}/api/table/${table}?page=${currentPage}&pageSize=${pageSize}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}
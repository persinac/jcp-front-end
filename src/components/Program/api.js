const PROGRAM_DOMAIN = "program"
const NOTES_SUB_DOMAIN = "notes"
const PROGRAM_NOTES_URL = `${process.env.API_URL}/api/${PROGRAM_DOMAIN}/${NOTES_SUB_DOMAIN}`

export const getNotesCount = async () => {
    const response = await fetch(`${PROGRAM_NOTES_URL}/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getNotesByProgramId = async (programId) => {
    const response = await fetch(`${PROGRAM_NOTES_URL}/search?by=program_id&input=${programId}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createNotes = async (newNotes) => {
    const response = await fetch(`${PROGRAM_NOTES_URL}/create`,
        {
            method: "POST",
            body: JSON.stringify(newNotes),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateNotes = async (modifiedNotes) => {
    const response = await fetch(`${PROGRAM_NOTES_URL}/update`,
        {
            method: "PUT",
            body: JSON.stringify(modifiedNotes),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

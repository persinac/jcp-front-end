const SETTINGS_DOMAIN = "settings"
const DISCORD_SUB_DOMAIN = "discord"
const SETTINGS_DISCORD_URL = `${process.env.API_URL}/api/${SETTINGS_DOMAIN}/${DISCORD_SUB_DOMAIN}`

export const getDiscordSettingsCount = async () => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}/count`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const getDiscordSettings = async () => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}

export const createDiscordSettings = async (newDiscordConf) => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}/create`,
        {
            method: "POST",
            body: JSON.stringify(newDiscordConf),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const updateDiscordSettings = async (modifiedDiscordConf) => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}/update`,
        {
            method: "PUT",
            body: JSON.stringify(modifiedDiscordConf),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const deleteDiscordSettings = async (discordSettingIds) => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}/remove`,
        {
            method: "DELETE",
            body: JSON.stringify(discordSettingIds),
            headers: {
                'Content-Type': 'application/json'
            }})
    return await response.json()
}

export const fuzzySearchForAutoComplete = async (input) => {
    const response = await fetch(`${SETTINGS_DISCORD_URL}/search?input=${input}`,
        {
            method: "GET",
            headers: {}
        })
    return await response.json()
}
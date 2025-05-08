import { INSIGHTS_API_URL } from '$env/static/private';
import fetch from 'node-fetch'

const MICROSERVICE_URL = INSIGHTS_API_URL

async function callInsightsAPI(payload) {
    try {
        const response = await fetch(MICROSERVICE_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text()
            console.error("Insights API error: ", errorData)
            //throw new Error(`Insights API error: ${response.status}-${JSON.stringify(errorData)}`)
        }

        const result = await response.json();
        console.log(result)
        return result
    } catch(error) {
        console.error('Error calling the Insights API', error)
        //throw error
    }
}

export {callInsightsAPI}
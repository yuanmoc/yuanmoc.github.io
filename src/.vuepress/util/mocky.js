// https://jsonblob.com/
import { fromBase64 } from '@jsonjoy.com/base64';

const id = 'MTM2OTU0NjU1NTA3NzYxNTYxNg=='

const decodedUint8Array = fromBase64(id);
const decodedString = new TextDecoder().decode(decodedUint8Array);

export async function getLikes() {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${decodedString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    if (!response.ok) {
        console.log(response.text())
        return {}
    }
    return response.json()
}

export async function updateLikes(data) {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${decodedString}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        console.log(response.text())
    }
}

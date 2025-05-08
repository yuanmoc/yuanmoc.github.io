// https://jsonblob.com/

const id = '1369546555077615616'

export async function getLikes() {
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
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
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
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

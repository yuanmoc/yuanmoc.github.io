
const userId = 'c0b961fe-b45e-41b9-ac36-362ed983d5ae'
const itemId = '528808f3-0eba-4887-b4e1-5711d105a907'
const apiKey = 'af40ec2b-029f-403b-9cb5-c990287c01b2'

export async function getLikes() {
    const response = await fetch(`https://api.jsonstorage.net/v1/json/${userId}/${itemId}`, {
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
    const response = await fetch(`https://api.jsonstorage.net/v1/json/${userId}/${itemId}?apiKey=${apiKey}`, {
        method: 'PATCH',
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

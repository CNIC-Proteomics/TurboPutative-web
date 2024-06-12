import fetch from 'node-fetch'

const fetchCMM = () => {
    return Promise(res => {
        fetch(
            CMM_URI,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            }
        ).then(value => res(value));
    });
}

export default fetchCMM
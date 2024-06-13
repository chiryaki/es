export class Api {
  static #ref = 'https://graphql.anilist.co'
  static #headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  static async request(query, variables, props) {
    const response = await fetch(Api.#ref, {
      method: 'POST',
      headers: Api.#headers,
      body: JSON.stringify({
        query,
        variables
      }),
    })

    if (response.ok) {
      const json = await response.json()

      return props.reduce((acc, curr) => acc[curr], json)
    }
  }
}
import { EventEmitter } from 'events'

import { Api } from '../../api/index.js'

import { readGql } from './utils.js'

export class Scheduler extends EventEmitter {
  async start() {
    const utcNow = Date.now()
    const time = utcNow - utcNow % 86400000 + 86400000
    const query = await readGql('AiringSchedule')
    const data = await Api.request(query, {
      page: 1,
      time: time / 1000,
    }, ['data', 'Page'])

    return this.#notify(data.airingSchedules, data.pageInfo, time)
  }

  async #notify(airingSchedule, pageInfo, time) {
    if (airingSchedule.length === 0) {
      return setTimeout(() => this.start(),
        time - Date.now())
    }

    const [nextAiring] = airingSchedule

    setTimeout(() => {
      const airingNow = airingSchedule.filter(el => el.timeUntilAiring === nextAiring.timeUntilAiring)

      for (const el of airingNow) {
        this.emit('notification', el)
      }

      const nextAirings = airingSchedule.slice(airingNow.length)

      if (nextAirings.length == 0) {
        if (pageInfo.hasNextPage) return this.start()
        else return setTimeout(() => this.start(),
          time - Date.now())
      } else {
        return this.#notify(nextAirings, pageInfo, time)
      }
    }, nextAiring.timeUntilAiring)
  }
}
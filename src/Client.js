import { Client } from 'discord.js'

import { Scheduler } from './services/schedule/index.js'
import { generateEmbed } from './services/schedule/utils.js'

export default class Es extends Client {
  scheduler = new Scheduler()

  constructor(options) {
    super({
      intents: 33349,
      ...options,
    })

    this.on('ready', this.onReady)
  }

  async onReady() {
    const channel = await this.channels.fetch(process.env.CHANNEL_ID)

    this.scheduler.addListener('notification', el => {
      const embed = generateEmbed(el)

      channel.send({
        embeds: [embed]
      })
    })

    this.scheduler.start()
  }

  start(token) {
    return this.login(token ?? process.env.TOKEN)
  }
}
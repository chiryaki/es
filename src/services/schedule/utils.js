import { readFile } from 'fs/promises'
import { join } from 'path'

export function readGql(query) {
  const path = join(import.meta.dirname, 'queries', `${query}.gql`)
  const content = readFile(path, { encoding: 'utf-8' })

  return content
}

export function generateEmbed({ episode, media }) {
  const externalLinks = media.externalLinks
    .map(externalLinks => `[${externalLinks.site}](${externalLinks.url})`)
    .join(' | ')

  return {
    author: {
      name: 'AniList',
      icon_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/512px-AniList_logo.svg.png',
      url: 'https://anilist.co',
    },
    description: `Episode ${episode} of [${media.title.romaji}](${media.siteUrl}) has just aired.\n
    ${externalLinks}
    `,
    thumbnail: {
      url: media.coverImage.large
    },
    image: {
      url: media.bannerImage
    },
    timestamp: new Date().toISOString(),
    footer: {
      text: `${media.episodes ?? '?'} episodes - ${media.duration ?? '?'}min`
    }
  }
}
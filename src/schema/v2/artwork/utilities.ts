import { parse } from "url"

export const isDimensional = (value) => parseFloat(value) > 0
export const isTinyDimensional = (value) => parseFloat(value) > 3

export const isTwoDimensional = ({ width, height, depth, diameter }) => {
  return (
    isDimensional(width) &&
    isDimensional(height) &&
    !isDimensional(diameter) &&
    // It's quite reasonable for a gallery to put on a depth of under an
    // inch for an artwork that we should treat as being something we can
    // up for view in room.
    !isTinyDimensional(depth)
  )
}

export const isTooBig = ({ width, height, metric }) => {
  const LIMIT = { in: 600, cm: 1524 } // 50 feet
  return parseFloat(width) > LIMIT[metric] || parseFloat(height) > LIMIT[metric]
}

export const isEmbeddedVideo = ({ website, category }) =>
  website && website.match("vimeo|youtu") && category && category.match("Video")

export const embed = (website, { width, height, autoplay }) => {
  if (!website) return null

  const { host } = parse(website)
  const id = website.split("/").pop()

  switch (host) {
    case "youtu.be":
    case "youtube.com":
      return `<iframe width='${width}' height='${height}' src='https://www.youtube.com/embed/${id}?rel=0&amp;showinfo=0&amp;autoplay=${
        autoplay // eslint-disable-line max-len
          ? 1
          : 0
      }' frameborder='0' allowfullscreen></iframe>`

    case "vimeo.com":
      return `<iframe width='${width}' height='${height}' src='//player.vimeo.com/video/${id}?color=ffffff&amp;autoplay=${
        autoplay // eslint-disable-line max-len
          ? 1
          : 0
      }' frameborder='0' allowfullscreen></iframe>`

    default:
      return null
  }
}

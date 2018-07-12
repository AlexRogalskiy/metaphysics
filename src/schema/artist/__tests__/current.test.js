/* eslint-disable promise/always-return */
import { runQuery } from "test/utils"

describe("Artist type", () => {
  const artist = {
    id: "percy-z",
    birthday: "2012",
  }
  const artistLoader = () => Promise.resolve(artist)

  const showsResponse = {
    body: [
      {
        start_at: "2018-12-21T12:00:00+00:00",
        end_at: "2018-12-31T12:00:00+00:00",
        partner: {
          name: "Catty Partner",
        },
        id: "catty-show",
        name: "Catty Show",
        location: {
          city: "Quonochontaug",
        },
      },
    ],
  }
  const relatedShowsLoader = jest
    .fn()
    .mockReturnValue(Promise.resolve(showsResponse))

  const salesResponse = [
    {
      live_start_at: "2018-12-28T12:00:00+00:00",
      id: "catty-sale",
      name: "Catty Sale",
    },
  ]
  const relatedSalesLoader = jest
    .fn()
    .mockReturnValue(Promise.resolve(salesResponse))

  const rootValue = { artistLoader, relatedSalesLoader, relatedShowsLoader }

  it("returns a current sale", () => {
    const query = `
      {
        artist(id: "percy-z") {
          currentEvent {
            status
            details
            name
            href
          }
        }
      }
    `

    return runQuery(query, rootValue).then(
      ({
        artist: { currentEvent: { status, partner, details, name, href } },
      }) => {
        expect(name).toBe("Catty Sale")
        expect(status).toBe("Currently at auction")
        expect(details).toBe("Live bidding begins at Dec 28, 2018")
        expect(href).toBe("/auction/catty-sale")
      }
    )
  })

  it("returns a current show", () => {
    rootValue.relatedSalesLoader = () => Promise.resolve([])
    const query = `
      {
        
        artist(id: "percy-z") {
          currentEvent {
            status
            details
            name
            href
            partner
          }
        }
      }
    `

    return runQuery(query, rootValue).then(
      ({
        artist: { currentEvent: { name, status, details, href, partner } },
      }) => {
        expect(name).toBe("Catty Show")
        expect(status).toBe("Currently on view")
        expect(href).toBe("/show/catty-show")
        expect(partner).toBe("Catty Partner")
        expect(details).toBe("Quonochontaug, Dec 21 – 31")
      }
    )
  })

  it("returns null when there is no current event", () => {
    rootValue.relatedSalesLoader = () => Promise.resolve([])
    rootValue.relatedShowsLoader = () => Promise.resolve({ body: [] })
    const query = `
      {
        artist(id: "percy-z") {
          currentEvent {
            name
          }
        }
      }
    `

    return runQuery(query, rootValue).then(({ artist: { currentEvent } }) => {
      expect(currentEvent).toBeNull()
    })
  })
})

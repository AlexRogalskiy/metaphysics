/* eslint-disable promise/always-return */
import moment from "moment"
import { runQuery } from "schema/v1/test/utils"

describe("PartnerShow type", () => {
  let showData = null
  let context = null

  beforeEach(() => {
    showData = {
      id: "new-museum-1-2015-triennial-surround-audience",
      start_at: "2015-02-25T12:00:00+00:00",
      end_at: "2015-05-24T12:00:00+00:00",
      press_release: "**foo** *bar*",
      displayable: true,
      partner: {
        id: "new-museum",
      },
      display_on_partner_profile: true,
      eligible_artworks_count: 8,
    }

    context = {
      showLoader: sinon.stub().returns(Promise.resolve(showData)),
    }
  })

  it("include true has_location flag for shows with location", () => {
    showData.location = "test location"
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          has_location
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          has_location: true,
        },
      })
    })
  })
  it("include true has_location flag for shows with fair_location", () => {
    showData.fair = "test location"
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          has_location
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          has_location: true,
        },
      })
    })
  })
  it("include true has_location flag for shows with partner_city", () => {
    showData.partner_city = "test location"
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          has_location
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          has_location: true,
        },
      })
    })
  })
  it("include false has_location flag for shows without any location", () => {
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          has_location
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          has_location: false,
        },
      })
    })
  })
  it("doesn't return a show that’s not displayable", () => {
    showData.displayable = false
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          name
        }
      }
    `
    return runQuery(query, context)
      .then(() => {
        throw new Error("Did not expect query to not throw an error")
      })
      .catch((error) => {
        expect(error.message).toEqual("Show Not Found")
      })
  })

  it("includes a formattable start and end date", () => {
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          id
          start_at(format: "dddd, MMMM Do YYYY, h:mm:ss a")
          end_at(format: "YYYY")
        }
      }
    `

    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          id: "new-museum-1-2015-triennial-surround-audience",
          start_at: "Wednesday, February 25th 2015, 12:00:00 pm",
          end_at: "2015",
        },
      })
    })
  })

  it("includes a formatted exhibition period", () => {
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          exhibition_period
        }
      }
    `

    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          exhibition_period: "February 25 – May 24, 2015",
        },
      })
    })
  })
  it("includes an update on upcoming status changes", () => {
    showData.end_at = moment().add(1, "d")
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          status_update
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          status_update: "Closing tomorrow",
        },
      })
    })
  })
  it("includes the html version of markdown", () => {
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          press_release(format: markdown)
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          press_release: "<p><strong>foo</strong> <em>bar</em></p>\n",
        },
      })
    })
  })
  it("includes the total number of artworks", () => {
    context.partnerShowArtworksLoader = sinon
      .stub()
      .returns(Promise.resolve({ headers: { "x-total-count": 42 } }))
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          counts {
            artworks
          }
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          counts: {
            artworks: 42,
          },
        },
      })
    })
  })
  it("includes the total number of eligible artworks", () => {
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          counts {
            eligible_artworks
          }
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          counts: {
            eligible_artworks: 8,
          },
        },
      })
    })
  })
  it("includes the number of artworks by a specific artist", () => {
    context.partnerShowArtworksLoader = sinon
      .stub()
      .returns(Promise.resolve({ headers: { "x-total-count": 2 } }))
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          counts {
            artworks(artist_id: "juliana-huxtable")
          }
        }
      }
    `
    return runQuery(query, context).then((data) => {
      expect(data).toEqual({
        partner_show: {
          counts: {
            artworks: 2,
          },
        },
      })
    })
  })
  it("does not return errors when there is no cover image", () => {
    context.partnerShowArtworksLoader = sinon
      .stub()
      .returns(Promise.resolve({ body: [] }))
    const query = `
      {
        partner_show(id: "new-museum-1-2015-triennial-surround-audience") {
          cover_image {
            id
          }
        }
      }
    `
    return runQuery(query, context).then(({ partner_show }) => {
      expect(partner_show).toEqual({
        cover_image: null,
      })
    })
  })

  describe("#artworksConnection", () => {
    let artworksResponse

    beforeEach(() => {
      artworksResponse = [
        {
          id: "michelangelo-pistoletto-untitled-12",
        },
        {
          id: "lucio-fontana-concetto-spaziale-attese-139",
        },
        {
          id: "pier-paolo-calzolari-untitled-146",
        },
      ]
      context = {
        partnerShowArtworksLoader: () =>
          Promise.resolve({
            body: artworksResponse,
            headers: { "x-total-count": artworksResponse.length },
          }),
        showLoader: () => Promise.resolve(showData),
      }
    })

    it("returns artworks", async () => {
      const query = `
        {
          partner_show(id: "cardi-gallery-cardi-gallery-at-art-basel-miami-beach-2018") {
            artworksConnection(first: 3) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `

      const data = await runQuery(query, context)

      expect(data).toEqual({
        partner_show: {
          artworksConnection: {
            edges: [
              {
                node: {
                  id: "michelangelo-pistoletto-untitled-12",
                },
              },
              {
                node: {
                  id: "lucio-fontana-concetto-spaziale-attese-139",
                },
              },
              {
                node: {
                  id: "pier-paolo-calzolari-untitled-146",
                },
              },
            ],
          },
        },
      })
    })

    it("returns hasNextPage=true when first is below total", async () => {
      const query = `
        {
          partner_show(id: "cardi-gallery-cardi-gallery-at-art-basel-miami-beach-2018") {
            artworksConnection(first: 1) {
              pageInfo {
                hasNextPage
              }
            }
          }
        }
      `

      const data = await runQuery(query, context)

      expect(data).toEqual({
        partner_show: {
          artworksConnection: {
            pageInfo: {
              hasNextPage: true,
            },
          },
        },
      })
    })

    it("returns hasNextPage=false when first is above total", async () => {
      const query = `
        {
          partner_show(id: "cardi-gallery-cardi-gallery-at-art-basel-miami-beach-2018") {
            artworksConnection(first: 3) {
              pageInfo {
                hasNextPage
              }
            }
          }
        }
      `

      const data = await runQuery(query, context)

      expect(data).toEqual({
        partner_show: {
          artworksConnection: {
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      })
    })
  })
})

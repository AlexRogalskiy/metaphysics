import { runQuery } from "schema/v2/test/utils"
import gql from "lib/gql"

describe("previewSavedSearch", () => {
  const query = gql`
    {
      previewSavedSearch(attributes: { acquireable: true }) {
        labels {
          field
          name
          displayValue
          value
        }
      }
    }
  `

  it("returns a previewed saved search", async () => {
    const { previewSavedSearch } = await runQuery(query)

    expect(previewSavedSearch.labels).toEqual([
      {
        field: "acquireable",
        name: "Ways to Buy",
        displayValue: "Buy Now",
        value: "true",
      },
    ])
  })
})

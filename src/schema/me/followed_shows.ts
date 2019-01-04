import { ShowType } from "schema/show"
import { UserType } from "schema/user"
import { IDFields } from "schema/object_identification"

import { pageable, getPagingParameters } from "relay-cursor-paging"
import { connectionDefinitions, connectionFromArraySlice } from "graphql-relay"
import { GraphQLObjectType } from "graphql"

const FollowedShowEdge = new GraphQLObjectType({
  name: "FollowedShowEdge",
  fields: {
    partner_show: {
      type: ShowType,
    },
    ...IDFields,
  },
})

export const FollowedShowConnection = connectionDefinitions({
  name: "FollowedShowConnection",
  // FIXME: 'edgeType' does not exist in type 'ConnectionConfig'
  // @ts-ignore
  edgeType: FollowedShowEdge,
  nodeType: ShowType,
})

export default {
  type: FollowedShowConnection.connectionType,
  args: pageable({}),
  description: "A list of the current user’s currently followed shows",
  resolve: (
    _root,
    options,
    _request,
    { rootValue: { followedShowsLoader } }
  ) => {
    if (!followedShowsLoader) return null

    const { limit: size, offset } = getPagingParameters(options)
    const gravityArgs = {
      size,
      offset,
      total_count: true,
    }

    return followedShowsLoader(gravityArgs).then(({ body, headers }) => {
      console.log("followed shows:")
      const payload = body.map(item => item.partner_show)
      console.dir(payload)
      return connectionFromArraySlice(payload, options, {
        arrayLength: headers["x-total-count"],
        sliceStart: offset,
      })
    })
  },
}

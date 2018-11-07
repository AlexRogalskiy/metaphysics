import { assign } from "lodash"
import { formatMoney } from "accounting"
import {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql"

export const amount = resolve => ({
  type: GraphQLString,
  description: "A formatted price with various currency formatting options.",
  args: {
    decimal: {
      type: GraphQLString,
      defaultValue: ".",
    },
    format: {
      type: GraphQLString,
      description:
        "Allows control of symbol position (%v = value, %s = symbol)",
      defaultValue: "%s%v",
    },
    precision: {
      type: GraphQLInt,
      defaultValue: 0,
    },
    symbol: {
      type: GraphQLString,
    },
    thousand: {
      type: GraphQLString,
      defaultValue: ",",
    },
  },
  resolve: (obj, options) => {
    const cents = resolve(obj)
    if (!cents) return null
    const symbol = options.symbol || obj.symbol
    return formatMoney(
      cents / 100,
      assign({}, options, {
        symbol,
      })
    )
  },
})

const money = ({ name, resolve }) => ({
  resolve: x => x,
  type: new GraphQLObjectType({
    name,
    fields: {
      amount: amount(obj => resolve(obj).cents),
      cents: {
        type: GraphQLFloat,
        description: "An amount of money expressed in cents.",
        resolve: obj => {
          const { cents } = resolve(obj)
          if (!cents) return null
          return cents
        },
      },
      display: {
        type: GraphQLString,
        description: "A pre-formatted price.",
        resolve: obj => {
          const { display } = resolve(obj)
          if (!display) return null
          return display
        },
      },
    },
  }),
})

export const MoneyInput = new GraphQLInputObjectType({
  name: "MoneyInput",
  fields: {
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: "amount in dollars or major unit",
    },
    currencyCode: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        "ISO 4217 Currency code of the this amount, https://en.wikipedia.org/wiki/ISO_4217",
    },
  },
})

export default money

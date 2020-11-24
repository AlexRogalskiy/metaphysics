import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from "graphql"
import { isArray, omit, pickBy } from "lodash"
import { ResolverContext } from "types/graphql"

export const GravityMutationErrorType = new GraphQLObjectType<
  any,
  ResolverContext
>({
  name: "GravityMutationError",
  fields: () => ({
    type: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString,
    },
    detail: {
      type: GraphQLString,
    },
    error: {
      type: GraphQLString,
    },
    fieldErrors: {
      type: GraphQLList(FieldErrorResultsType),
    },
  }),
})

export const formatGravityError = (error) => {
  const errorSplit = error.message?.split(" - ")

  if (errorSplit && errorSplit.length > 1) {
    try {
      const parsedError = JSON.parse(errorSplit[1])
      const { error, detail, text } = parsedError
      const fieldErrorResults =
        detail && Object.keys(pickBy(detail, isArray))?.length

      if (fieldErrorResults) {
        const fieldErrors = formatGravityErrorDetails(detail)
        return {
          fieldErrors,
          ...omit(parsedError, "detail"),
        }
      }

      if (error) {
        return {
          type: "error",
          message: error,
          detail: text,
        }
      } else {
        return { ...parsedError }
      }
    } catch (e) {
      return { message: errorSplit[1] }
    }
  } else {
    return null
  }
}

export const FieldErrorResultsType = new GraphQLObjectType<
  any,
  ResolverContext
>({
  name: "FieldErrorResults",
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    message: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
})

type FieldErrorType = {
  name: string
  message: string
}

const formatGravityErrorDetails = (
  detail: Record<string, string[]>
): FieldErrorType[] => {
  const fieldErrors: FieldErrorType[] = []

  Object.keys(detail).forEach((key) => {
    fieldErrors.push({
      name: key,
      message: detail[key].join(", "),
    })
  })
  return fieldErrors
}

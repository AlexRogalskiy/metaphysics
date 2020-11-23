import {
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLList,
} from "graphql"
import { mutationWithClientMutationId } from "graphql-relay"

import { UserType } from "../user"
import Me from "./"
import { ResolverContext } from "types/graphql"
import {
  formatGravityError,
  GravityMutationErrorType,
} from "lib/gravityErrorHandler"

export const EditableLocationFields = new GraphQLInputObjectType({
  name: "EditableLocation",
  fields: {
    address: {
      description: "First line of an address",
      type: GraphQLString,
    },
    address2: {
      description: "Second line of an address",
      type: GraphQLString,
    },
    city: {
      description: "The city the location is based in",
      type: GraphQLString,
    },
    country: {
      description: "The county the location is based in",
      type: GraphQLString,
    },
    summary: {
      description: "An optional display string for the location",
      type: GraphQLString,
    },
    postalCode: {
      description: "Postal code for a string",
      type: GraphQLString,
    },
    state: {
      description: "The (optional) name of the state for location",
      type: GraphQLString,
    },
    stateCode: {
      description: "The (optional) state code of the state for location",
      type: GraphQLString,
    },
  } /*
  FIXME: Generated by the snake_case to camelCase codemod.
         Either use this to fix inputs and/or remove this comment.
  {
    const {
      address2,
      postalCode,
      stateCode,
      ..._newFields
    } = newFields;
    const oldFields = {
      address2: address_2,
      postalCode: postal_code,
      stateCode: state_code,
      ..._newFields
    };
  }
  */,
})

const UpdateMyProfileMutationSuccessType = new GraphQLObjectType<
  any,
  ResolverContext
>({
  name: "UpdateMyProfileMutationSuccess",
  isTypeOf: (data) => data.id,
  fields: () => ({
    user: {
      type: UserType,
      resolve: (user) => user,
    },
  }),
})

const UpdateMyProfileMutationFailureType = new GraphQLObjectType<
  any,
  ResolverContext
>({
  name: "UpdateMyProfileMutationFailure",
  isTypeOf: (data) => {
    return data._type === "GravityMutationError"
  },
  fields: () => ({
    mutationError: {
      type: GravityMutationErrorType,
      resolve: (err) => err,
    },
  }),
})

export const UpdateMyProfileMutationFieldErrorType = new GraphQLObjectType<
  any,
  ResolverContext
>({
  name: "UpdateMyProfileMutationFieldError",
  fields: {
    email: {
      type: GraphQLList(GraphQLString),
    },
    password: {
      type: GraphQLList(GraphQLString),
    },
  },
})

const UpdateMyProfileMutationType = new GraphQLUnionType({
  name: "UpdateMyProfileMutation",
  types: [
    UpdateMyProfileMutationSuccessType,
    UpdateMyProfileMutationFailureType,
  ],
})

export default mutationWithClientMutationId<any, any, ResolverContext>({
  name: "UpdateMyProfile",
  description: "Update the current logged in user.",
  inputFields: {
    name: {
      description: "The given name of the user.",
      type: GraphQLString,
    },
    email: {
      description: "The given email of the user.",
      type: GraphQLString,
    },
    phone: {
      description: "The given phone number of the user.",
      type: GraphQLString,
    },
    location: {
      description: "The given location of the user as structured data",
      type: EditableLocationFields,
    },
    collectorLevel: {
      description: "The collector level for the user",
      type: GraphQLInt,
    },
    priceRangeMin: {
      description: "The minimum price collector has selected",
      type: GraphQLInt,
    },
    priceRangeMax: {
      description: "The maximum price collector has selected",
      type: GraphQLFloat,
    },
    receivePurchaseNotification: {
      description: "This user should receive purchase notifications",
      type: GraphQLBoolean,
    },
    receiveOutbidNotification: {
      description: "This user should receive outbid notifications",
      type: GraphQLBoolean,
    },
    receiveLotOpeningSoonNotification: {
      description: "This user should receive lot opening notifications",
      type: GraphQLBoolean,
    },
    receiveSaleOpeningClosingNotification: {
      description:
        "This user should receive sale opening/closing notifications",
      type: GraphQLBoolean,
    },
    receiveNewWorksNotification: {
      description: "This user should receive new works notifications",
      type: GraphQLBoolean,
    },
    receiveNewSalesNotification: {
      description: "This user should receive new sales notifications",
      type: GraphQLBoolean,
    },
    receivePromotionNotification: {
      description: "This user should receive promotional notifications",
      type: GraphQLBoolean,
    },
  } /*
  FIXME: Generated by the snake_case to camelCase codemod.
         Either use this to fix inputs and/or remove this comment.
  {
    const {
      collectorLevel,
      priceRangeMin,
      priceRangeMax,
      ..._newFields
    } = newFields;
    const oldFields = {
      collectorLevel: collector_level,
      priceRangeMin: price_range_min,
      priceRangeMax: price_range_max,
      ..._newFields
    };
  }
  */,
  outputFields: {
    user: {
      type: UserType,
      resolve: (user) => user,
    },
    userOrError: {
      type: UpdateMyProfileMutationType,
      resolve: (result) => result,
    },
    me: Me,
  },
  mutateAndGetPayload: (
    {
      collectorLevel,
      priceRangeMin,
      priceRangeMax,
      receivePurchaseNotification,
      receiveOutbidNotification,
      receiveLotOpeningSoonNotification,
      receiveSaleOpeningClosingNotification,
      receiveNewWorksNotification,
      receiveNewSalesNotification,
      receivePromotionNotification,
      ..._user
    },
    { updateMeLoader }
  ) => {
    const user: any = {
      collector_level: collectorLevel,
      price_range_min: priceRangeMin,
      price_range_max: priceRangeMax,
      receive_purchase_notification: receivePurchaseNotification,
      receive_outbid_notification: receiveOutbidNotification,
      receive_lot_opening_soon_notification: receiveLotOpeningSoonNotification,
      receive_sale_opening_closing_notification: receiveSaleOpeningClosingNotification,
      receive_new_works_notification: receiveNewWorksNotification,
      receive_new_sales_notification: receiveNewSalesNotification,
      receive_promotion_notification: receivePromotionNotification,
      ..._user,
    }
    if (!updateMeLoader) {
      throw new Error("No updateMeLoader loader found in root values")
    }
    return updateMeLoader(user)
      .then((result) => result)
      .catch((error) => {
        const formattedErr = formatGravityError(error)

        if (formattedErr) {
          return { ...formattedErr, _type: "GravityMutationError" }
        } else {
          throw new Error(error)
        }
      })
  },
})

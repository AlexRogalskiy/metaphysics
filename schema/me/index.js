import date from '../fields/date';
import gravity from '../../lib/loaders/gravity';
import Bidders from './bidders';
import BidderStatus from './bidder_status';
import BidderPositions from './bidder_positions';
import SaleRegistrations from './sale_registrations';
import {
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

const Me = new GraphQLObjectType({
  name: 'Me',
  fields: {
    id: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    created_at: date,
    email: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    paddle_number: {
      type: GraphQLString,
    },
    bidders: Bidders,
    bidder_status: BidderStatus,
    bidder_positions: BidderPositions,
    sale_registrations: SaleRegistrations,
  },
});

export default {
  type: Me,
  resolve: (root, options, { rootValue: { accessToken } }) => {
    if (!accessToken) return null;
    return gravity.with(accessToken)('me')
      .catch(() => null);
  },
};

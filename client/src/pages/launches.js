import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { LaunchTile, Header, Button, Loading } from "../components";

export default function Launches() {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map(launch => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches && data.launches.hasMore && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                after: data.launches.cursor
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches: {
                    ...fetchMoreResult.launches,
                    launches: [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches
                    ]
                  }
                };
              }
            })
          }
        >
          Load More
        </Button>
      )}
    </Fragment>
  );
}

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

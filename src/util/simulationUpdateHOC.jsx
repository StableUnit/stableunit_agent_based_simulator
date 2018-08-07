// @flow
import React, {PureComponent} from 'react'
import Player from '../models/player'
import type { ComponentType } from 'react';
import type {PlayerOptions, MapPlayerToProps} from "../models/player"

let player: ?Player = null;

export const configurePlayer = (options?: PlayerOptions) => {
  player = new Player(options);

  return player;
}

export type MapPlayerMethodsToProps = Player => {}

type WrapperState = {
  data: ?{}
};

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default (mapPlayerToProps: ?MapPlayerToProps<Player>, mapPlayerMethodsToProps?: MapPlayerMethodsToProps) =>
  (WrappedComponent: ComponentType<any>) =>
    class Wrapper extends PureComponent<any, WrapperState> {
      state = {
        data: null
      }

      componentDidMount() {
        if (player && mapPlayerToProps) {
          player.subscribe(mapPlayerToProps, data => this.setState({data}));
        }
      }

      static displayName = `withSimulation(${getDisplayName(WrappedComponent)})`

      render() {
        const { data } = this.state;

        if (!player) {
          return null;
        }

        if (mapPlayerToProps && !data) {
          return null;
        }

        let methods = {};

        if (mapPlayerMethodsToProps) {
          methods = mapPlayerMethodsToProps(player);
        }

        return <WrappedComponent {...data} {...methods} {...this.props} />;
      }
    }

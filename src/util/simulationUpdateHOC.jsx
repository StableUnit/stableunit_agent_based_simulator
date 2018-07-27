// @flow
import React, {PureComponent} from 'react'
import Player from '../models/player'
import type { ComponentType } from 'react';
import type {PlayerOptions} from "../models/player"

let player: ?Player = null;

export const configurePlayer = (options?: PlayerOptions) => {
  player = new Player(options);

  return player;
}

export type MapPlayerToProps = Player => {}
export type mapPlayerMethodsToProps = Player => {}

type WrapperState = {
  player: ?Player
};

const withSimulation = (mapPlayerToProps: ?MapPlayerToProps, mapPlayerMethodsToProps: ?mapPlayerMethodsToProps) =>
  (WrappedComponent: ComponentType<any>) =>
    class Wrapper extends PureComponent<any, WrapperState> {
      state = {
        player: null
      }

      componentDidMount() {
        if (mapPlayerToProps && player) {
          player.subscribe(player => {
            this.setState({player});
          });
        }
      }

      render() {
        const { player: currentPlayer } = this.state;

        if (!player || !currentPlayer) {
          return null;
        }

        let props = {};
        let methods = {};

        if (mapPlayerToProps) {
          props = mapPlayerToProps(currentPlayer);
        }

        if (mapPlayerMethodsToProps) {
          methods = mapPlayerMethodsToProps(player);
        }

        return <WrappedComponent {...props} {...methods} {...this.props} />;
      }
    }

export default withSimulation;

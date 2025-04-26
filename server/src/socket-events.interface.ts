export interface Player {
  name: string;
  id: string;
}

export interface PlayerWithPosition {
  player: Player;
  position: [number, number, number];
}

export interface ServerToClientEvents {
  playerMove: (data: PlayerWithPosition) => void;
  createUser: (data: {
    player: Player,
    otherPlayers: PlayerWithPosition[]
  }) => void;
  playerJoined: (data: PlayerWithPosition) => void;
  playerDisconnected: (data: Player) => void;
}

export interface ClientToServerEvents {
  playerMove: (data: PlayerWithPosition) => void;
}

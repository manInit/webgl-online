export interface Player {
  name: string;
  id: string;
}

export interface PlayerMessage {
  player: Player;
  message: string;
  position: [number, number, number];
}

export interface PlayerWithPosition {
  player: Player;
  position: [number, number, number];
}

export interface ServerToClientEvents {
  playerMove: (data: PlayerWithPosition) => void;
  createUser: (data: {
    player: Player;
    otherPlayers: PlayerWithPosition[];
    messages: PlayerMessage[];
  }) => void;
  playerJoined: (data: PlayerWithPosition) => void;
  playerDisconnected: (data: Player) => void;
  newMessage: (data: PlayerMessage) => void;
}

export interface ClientToServerEvents {
  playerMove: (data: PlayerWithPosition) => void;
  sendMessage: (data: PlayerMessage) => void;
}

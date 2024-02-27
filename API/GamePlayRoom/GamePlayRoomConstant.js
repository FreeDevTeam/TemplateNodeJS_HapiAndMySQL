/* Copyright (c) 2022-2023 Reminano */

/**
 * Created by A on 7/18/17.
 */
'use strict';

module.exports = {
  GAMEROOM_TYPE: {
    HETHONG: 1,
    LEADER: 2,
    DOIKHANGDON: 3,
    DOIKHANGNHOM: 4,
  },
  GAMEROOM_STATUS: {
    ACTIVE: 1,
    WAITING: 2,
    DELETED: 3,
  },
  GAME_GROUP: {
    NHOMA: 0,
    NHOMB: 1,
  },
  GAME_PLAYERTYPE: {
    LEADER: 0,
    PLAYER: 1,
  },
  USER_INROM: {
    PLAYING: 1,
    EXITED: 0,
  },
  GAMEAMOUNT_KEYCACHE: {
    LEADER: {
      TOTAL_AMOUNTIN: 'LEADER_TOTAL_AMOUNTIN',
      TOTAL_AMOUNTWIN: 'LEADER_TOTAL_AMOUNTWIN',
    },
    DOIKHANGDON: {
      TOTAL_AMOUNTIN: 'DOIKHANGDON_TOTAL_AMOUNTIN',
      TOTAL_AMOUNTWIN: 'DOIKHANGDON_TOTAL_AMOUNTWIN',
      TOTAL_AMOUNTIN_A: 'DOIKHANGDON_LEADERA_TOTAL_AMOUNTIN',
      TOTAL_AMOUNTIN_B: 'DOIKHANGDON_LEADERB_TOTAL_AMOUNTIN',
    },
    DOIKHANGNHOM: {
      TOTAL_AMOUNTIN: 'DOIKHANGNHOM_TOTAL_AMOUNTIN',
      TOTAL_AMOUNTWIN: 'DOIKHANGNHOM_TOTAL_AMOUNTWIN',
      TOTAL_AMOUNTIN_A: 'DOIKHANGNHOM_GROUPA_TOTAL_AMOUNTIN',
      TOTAL_AMOUNTIN_B: 'DOIKHANGNHOM_GROUPB_TOTAL_AMOUNTIN',
    },
  },
};

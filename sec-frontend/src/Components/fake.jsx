export const rules = [
    "There are 6 subordinate levels in inviting friends, if A invites B, then B is a level 1 subordinate of A. If B invites C, then C is a level 1 subordinate of B and also a level 2 subordinate of A. If C invites D, then D is a level 1 subordinate of C, at the same time a level 2 subordinate of B and also a level 3 subordinate of A.",
    "Each user can only have one invitee at each level.",
    "If a level 1 invitee invites another user, they become a level 2 invitee for the original inviter.",
    "The maximum number of levels of invitees that can be tracked is 6.",
    "Rewards are distributed based on the level of the invitee in relation to the original inviter."
  ];

  export const rulesdata = [
    { level: 'L0', teamNumber: 0, teamBetting: '0', teamDeposit: '0' },
    { level: 'L1', teamNumber: 5, teamBetting: '500K', teamDeposit: '100K' },
    { level: 'L2', teamNumber: 10, teamBetting: '1,000K', teamDeposit: '200K' },
    { level: 'L3', teamNumber: 15, teamBetting: '2.50M', teamDeposit: '500K' },
    { level: 'L4', teamNumber: 20, teamBetting: '3.50M', teamDeposit: '700K' },
    { level: 'L5', teamNumber: 25, teamBetting: '5M', teamDeposit: '1,000K' },
    { level: 'L6', teamNumber: 30, teamBetting: '10M', teamDeposit: '2M' },
    { level: 'L7', teamNumber: 100, teamBetting: '100M', teamDeposit: '20M' },
    { level: 'L8', teamNumber: 500, teamBetting: '500M', teamDeposit: '100M' },
    { level: 'L9', teamNumber: 1000, teamBetting: '1,000M', teamDeposit: '200M' },
    { level: 'L10', teamNumber: 5000, teamBetting: '1,500M', teamDeposit: '300M' },
  ];

 export const depositData = [
    { id: 1, amount: 400, bonus: 48, progress: 0 },
    { id: 2, amount: 1000, bonus: 108, progress: 0 },
    { id: 3, amount: 2000, bonus: 188, progress: 0 },
    { id: 4, amount: 10000, bonus: 488, progress: 0 },
    { id: 4, amount: 10000, bonus: 488, progress: 0 },
    { id: 4, amount: 10000, bonus: 488, progress: 0 }
  ]
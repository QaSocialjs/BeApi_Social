export const enum StatusFriend {
  notFr = 1,
  isFr,
  isRequested,
  requestFr,
}

export const valueStatusFriend = {
  [StatusFriend.notFr]: "isNotFriend",
  [StatusFriend.isFr]: "isFriend",
  [StatusFriend.isRequested]: "isRequested",
  [StatusFriend.requestFr]: "requesting",
};

export interface StatusDto {
  status: string;
}

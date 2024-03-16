enum EntityType {
  FRIEND_SEND_REQ = "FRIEND_SEND_REQ",
  FRIEND_ACCEPT_REQ = "FRIEND_ACCEPT_REQ",
  FRIEND_REJECT_REQ = "FRIEND_REJECT_REQ",
}
enum StatusReceiver {
  seen = 1,
  notSeen = 0,
}
export { EntityType, StatusReceiver };

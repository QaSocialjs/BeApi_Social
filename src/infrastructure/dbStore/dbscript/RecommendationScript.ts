import { DbClient } from "../../../../scripts/db/dbclient/dbclient";

async function getAllUser() {
  return await DbClient.instance.collections.users.find().toArray();
}
export async function predictWithIntialUserCreateAccount() {
  const users = await getAllUser();

  const user = users[0];
}

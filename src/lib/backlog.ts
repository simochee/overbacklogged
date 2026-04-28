import { Backlog, type Entity } from "backlog-js";

export type SpaceProfile = Entity.Space.Space;
export type UserProfile = Entity.User.User;

export type BacklogCredentials = {
  domain: string;
  apiKey: string;
};

export function createClient({ domain, apiKey }: BacklogCredentials): Backlog {
  return new Backlog({ host: domain, apiKey });
}

export async function fetchSpaceProfile(credentials: BacklogCredentials): Promise<{
  spaceProfile: SpaceProfile;
  user: UserProfile;
}> {
  const client = createClient(credentials);
  const [spaceProfile, user] = await Promise.all([
    client.getSpace(),
    client.getMyself(),
  ]);
  return { spaceProfile, user };
}

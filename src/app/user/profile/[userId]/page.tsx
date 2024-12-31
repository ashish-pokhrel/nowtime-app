import ProfilePage from "../[userId]/profile";

type Params = Promise<{ userId: string  }>

export default function Profile({ params }:  { params: Params}) {
  return <ProfilePage params={params} />;
}

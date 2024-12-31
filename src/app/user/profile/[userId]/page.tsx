import ProfilePage from "../[userId]/profile";

export default function Profile({ params }:  { params: { userId: string } }) {
  return <ProfilePage params={params} />;
}

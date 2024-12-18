import CommentsPage from "../[postId]/comment";

export default function Comment({ params }:  { params: { groupId: string; postId: string } }) {
  return <CommentsPage params={params} />;
}

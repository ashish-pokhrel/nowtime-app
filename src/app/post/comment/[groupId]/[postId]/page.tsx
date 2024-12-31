import CommentsPage from "../[postId]/comment";

type Params = Promise<{ groupId: string; postId: string  }>

export default function Comment({ params }:  { params: Params }) {
  return <CommentsPage params={params} />;
}

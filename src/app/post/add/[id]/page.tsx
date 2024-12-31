import AddPostPage from "../../add/[id]/add";

export default function AddPost({ params }:  { params: { id: string } }) {
  return <AddPostPage params={params} />;
}

import AddPostPage from "../../add/[id]/add";

type Params = Promise<{ id: string }>

export default function AddPost({ params }:  { params: Params }) {
  return <AddPostPage params={params} />;
}

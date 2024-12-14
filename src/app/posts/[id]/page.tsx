import AddPostPage from "../../posts/add";

export default function AddPost({ params }: { params: { id: string } }) {
  return <AddPostPage params={params} />;
}

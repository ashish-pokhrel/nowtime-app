import ChatPage from "../[userName]/chat";

type Params = Promise<{ userName: string; }>

export default function Chat({ params }:  { params: Params }) {
  return <ChatPage params={params} />;
}

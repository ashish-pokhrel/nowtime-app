import ChatPage from "../[userName]/chat";

export default function Chat({ params }:  { params: { userName: string } }) {
  return <ChatPage params={params} />;
}

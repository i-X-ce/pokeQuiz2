import Link from "next/link";
import LoginBtn from "./components/common/loginBtn/page";
import { NickNameInput } from "./components/common/NickNameInput/page";

export default function Home() {
  fetch;
  return (
    <>
      <Link href="/pages/quiz-page">クイズを解く</Link>
      <Link href="/pages/quiz-create-page">クイズを作る</Link>
      <LoginBtn />
      <NickNameInput />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session,
//     }
//   }
// }

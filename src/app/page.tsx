import Link from "next/link";
import LoginBtn from "./components/loginBtn/page";

export default function Home(){
  fetch;
  return (
    <>
      <Link href="/pages/quiz-page">クイズを解く</Link>
      <LoginBtn />
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

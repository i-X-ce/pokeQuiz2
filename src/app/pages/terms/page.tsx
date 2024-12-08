import { Title } from "@/app/components/common/Title";
import styles from "./style.module.css";
import Link from "next/link";

export default function Home() {
  let cnt = 1;

  return (
    <>
      <link rel="stylesheet" href="/public/ulReset.css" />
      <Title title={"利用規約"} color="green" />
      <div className={styles.body}>
        <h2 className={styles.h2}>第{cnt++}条 適用</h2>
        <p>
          本利用規約（以下「本規約」といいます）は、BugPokeQuiz（以下「本サービス」といいます）をご利用いただくすべてのユーザー（以下「ユーザー」といいます）に適用されるものとします。本サービスを利用することで、本規約に同意したものとみなされます。
        </p>
        <h2 className={styles.h2}>第{cnt++}条 取得する情報とその利用目的</h2>
        <ol className={styles.ul}>
          <li>
            <p>
              ユーザーが本サービスにログインする際、以下の情報を取得します：
            </p>
            <ul className={styles.ul}>
              <li>Googleのアイコン画像</li>
              <li>名前</li>
              <li>メールアドレス</li>
            </ul>
          </li>
          <li>
            取得したメールアドレスは、ユーザーアカウントの識別とサービス運営上必要な連絡のためにのみ使用されます。他の目的には一切使用しません。
          </li>
          <li>
            <Link href={"/pages/privacypolicy"}>プライバシーポリシー</Link>
            に従い、取得した情報を適切に管理します。
          </li>
        </ol>
        <h2 className={styles.h2}>第{cnt++}条 クイズ作成機能の利用</h2>
        <ol className={styles.ul}>
          <li>
            本サービスでは、ユーザーがクイズを作成する際に画像をアップロードする機能を提供します。
          </li>
          <li>
            以下に該当する内容の画像や文章の投稿を禁止します：
            <ul className={styles.ul}>
              <li>公序良俗に反するもの</li>
              <li>差別的または侮辱的な内容を含むもの</li>
              <li>その他、運営が不適切と判断したもの</li>
            </ul>
          </li>
          <li>
            不適切な内容が投稿された場合、運営は該当するコンテンツを削除し、必要に応じてアカウントの利用を制限する場合があります。
          </li>
        </ol>
        <h2 className={styles.h2}>第{cnt++}条 免責事項</h2>
        <ol className={styles.ul}>
          <li>
            本サービスの利用に関連して発生したトラブルや損害について、運営は一切の責任を負いません。
          </li>
          <li>
            ユーザー間または第三者との間で生じた紛争についても、運営は関与しないものとします。
          </li>
        </ol>
        <h2 className={styles.h2}>第{cnt++}条 規約の変更</h2>
        <p>
          運営は、必要に応じて本規約を変更できるものとします。規約変更後、ユーザーが引き続き本サービスを利用する場合、変更後の規約に同意したものとみなされます。
        </p>
        <h2 className={styles.h2}>第{cnt++}条 お問い合わせ</h2>
        <p>
          本サービスに関するご質問やご意見は、以下の連絡先までお問い合わせください。
        </p>
        <a href="mailto:iceci2804@gmail.com?subject=BugPokeQuiz_利用規約">
          iceci2804@gmail.com
        </a>
      </div>
    </>
  );
}

import { Title } from "@/app/components/common/Title/page";
import styles from "./style.module.css";

export default function Home() {
  return (
    <>
      <Title title={"プライバシーポリシー"} color="green"></Title>
      <div className={styles.body}>
        <h2 className={styles.h2}>取得する情報</h2>
        <ol className={styles.ul}>
          <li>
            Googleアカウント情報
            <ul className={styles.ul}>
              <li>アイコン画像</li>
              <li>名前</li>
              <li>メールアドレス</li>
            </ul>
          </li>
          <li>
            ユーザーが提供する情報
            <ul className={styles.ul}>
              <li>クイズ作成時にアップロードされた画像や文章</li>
            </ul>
          </li>
        </ol>
        <h2 className={styles.h2}>情報の利用目的</h2>
        <p>取得した情報は以下の目的で使用されます：</p>
        <ol className={styles.ul}>
          <li>
            メールアドレス
            <ul className={styles.ul}>
              <li>ユーザーアカウントの識別</li>
              <li>サービス運営上必要な連絡</li>
            </ul>
          </li>

          <li>
            名前・アイコン画像
            <ul className={styles.ul}>
              <li>アカウントプロフィールの表示</li>
            </ul>
          </li>
          <li>
            ユーザーが作成したコンテンツ
            <ul className={styles.ul}>
              <li>他のユーザーに共有されるクイズ内容として利用</li>
            </ul>
          </li>
          <p>※ これらの情報は、明示された目的以外には使用しません。</p>
        </ol>
        <h2 className={styles.h2}>プライバシーポリシーの変更</h2>
        <p>
          本ポリシーは、必要に応じて変更されることがあります。変更後の内容は、本アプリ内に掲示され、掲示後ユーザーが本アプリを利用した場合、変更内容に同意したものとみなされます。
        </p>
        <h2 className={styles.h2}>お問い合わせ</h2>
        <p>
          プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします：iceci2804@gmail.com
        </p>
      </div>
    </>
  );
}

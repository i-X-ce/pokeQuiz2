import { Title } from "@/app/components/common/Title";
import styles from "./style.module.css";

export default function Home() {
  return (
    <>
      <Title title={"このサイトについて"} color="green"></Title>
      <div className={styles.body}>
        <h2 className={styles.h2}>やあ！</h2>
        <p>
          BugPokeQuizへようこそ！このサイトは初代ポケモンのバグ・任意コード実行について
          のクイズをユーザーの皆さんに自由に共有してもらうサービスです。誰でも簡単に初代ポケモンの知識を取り入れることのできるクイズサイトを目指しています。
        </p>
        <p>博識バグプレイヤーの皆さんからの超難問をお待ちしております！</p>
        <h2 className={styles.h2}>目的</h2>
        <p>このサイトを制作した目的は主にこの3つです。</p>
        <ol className={styles.ul}>
          <li>
            <p className={styles.bold}>交流の場を作りたい</p>
            <p>
              当然といえば当然ですが、初代ポケモンバグ専用のプラットフォームというのはあまりないです。迷えるバグプレイヤーをこのサイトにかき集めてバグ蟲毒を作りたいんです。
            </p>
            <p></p>
          </li>
          <li>
            <p className={styles.bold}>知識を付けたい</p>
            <p>
              単純にバグの知識、サイト作成・制作において作成者自身が知識を付けたかったというのもあります。
            </p>
            <p>
              バグの知識においては先人達の知恵がこのインターネット上に数多く存在していますが、未だに発信していない未知のバグをご存じではないですか？もしそのようなバグがあれば私も知りたいのでお気軽にこのサイトに投稿していただきたいです。知識は水ですヨ。
            </p>
            <p>
              あとNext.jsでの開発経験は今後必ず役に立つときがくるだろうと思ったので作りました。楽しかったです。
            </p>
          </li>
          <li>
            <p className={styles.bold}>他サイトの影響</p>
            <p>
              <a href="https://mondai.page/">とあるクイズサイトに</a>
              大いに感銘を受けてこのサイトを作りました。高校生が運営・開発・デザインを個人で行っているようで、これは負けていられないと思いました。特にそのデザインに惹かれ、このサイトでもそちらから影響を受けた部分が多くあります。
            </p>
            <p>素晴らしいサイトをありがとうございます。</p>
          </li>
        </ol>
        <h2 className={styles.h2}>さいごに</h2>
        <p>
          当サイトは個人が運営・開発・デザインを行っています。クオリティを高めるために努力をしていますが、至らない点もあるかと思います。何か要望やご意見等ありましたら
          <a href="https://x.com/i_c_e_i_c_e_">X(@i_c_e_i_c_e_)</a>
          のダイレクトメッセージ や、
          <a href="mailto:iceci2804@gmail.com?subject=BugPokeQuiz">
            メール(iceci2804@gmail.com)
          </a>
          までご連絡ください。うれしいご感想を
          <a
            className={styles.blue}
            href="https://twitter.com/hashtag/BugPokeQuiz"
          >
            #BugPokeQuiz
          </a>
          でXにてつぶやいていただけると泣いて喜びます。
        </p>
        <p>
          また、当サイトは予告なくサービスを終了する場合がございます。その時が来るまで存分に当サービスをお楽しみください！
        </p>
      </div>
    </>
  );
}

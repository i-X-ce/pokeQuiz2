const shareOnTwitter = (text: string, url: string) => {
  const tweetUrl = encodeURIComponent(url);
  const twitterAppUrl = `twitter://post?message=${encodeURIComponent(
    text
  )}&url=${tweetUrl}`;
  const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${text}\n#BugPokeQuiz\n`
  )}&url=${tweetUrl}`;

  // ユーザーエージェントをチェックしてモバイルデバイスの場合のみアプリを開く
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Twitterアプリがインストールされている場合はアプリを開く
    window.open(twitterAppUrl, "_blank");

    // Twitterアプリがインストールされていない場合はWebページを開く
    setTimeout(() => {
      window.open(twitterWebUrl, "_blank");
    }, 500);
  } else {
    // PCの場合は直接Webページを開く
    window.open(twitterWebUrl, "_blank");
  }
};

export default shareOnTwitter;

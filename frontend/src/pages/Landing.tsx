import { Link } from "react-router-dom";
import logo from "../assets/digbeats-logo.png";
// ★★★ TODO：　モックアップ画像を先変える ★★★
import mockup from "../assets/digbeats-mockup-2.png";

// ★★★ TODO：　各ステップで使うスクリーンショット画像に差し替える ★★★
import step1Image from "../assets/digbeats-mockup-2.png";
import step2Image from "../assets/digbeats-mockup-2.png";
import step3Image from "../assets/digbeats-mockup-2.png";
import step4Image from "../assets/digbeats-mockup-2.png";
import step5Image from "../assets/digbeats-mockup-2.png";

export const Landing = () => {
  return (
    <div className="bg-neutral-900 text-white">
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="container mx-auto px-6 py-4">
          {/* ロゴ */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="DigBeats Logo"
              className="w-15 h-15 object-contain"
            />
            <p className="block text-xl font-bold text-white">DIGBEATS</p>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-16">
          {/* テキストエリア */}
          <div className="md:w-3/7 text-center md:text-left">
            {/* メインテキスト */}
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 text-white">
              Hear what they like.
              <br />
              Find what you'll love.
            </h1>
            {/* サブテキスト */}
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto md:mx-0">
              DigBeatsは、憧れのアーティストの『お気に入り』を覗いて、あなたの新しい『好き』が見つかる音楽発見アプリです。
            </p>
            {/* ログインボタン */}
            <Link
              to="/login"
              className="inline-block bg-orange-400 text-black font-semibold py-3 px-8 rounded-full text-lg hover:bg-orange-500 transition shadow-lg"
            >
              Sing up / Login
            </Link>
          </div>

          {/* モックアップ画像エリア */}
          <div className="md:w-4/7 mt-8 md:mt-0">
            <img
              src={mockup}
              alt="PCとスマホでDigBeatsを表示している様子"
              className="w-full h-auto"
            />
          </div>
        </div>
        {/* スクロール指示 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1 text-gray-400 animate-bounce">
            <p className="text-lg font-bold tracking-widest">HOW TO USE</p>
            <span className="material-icons-outlined text-4xl">⬇</span>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section
        id="how-to-use"
        className="py-20 px-4 bg-neutral-800 border-t border-gray-800"
      >
        <div className="container mx-auto">
          {/* タイトル */}
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-orange-400 mb-4">
              使い方は簡単 5ステップ
            </h2>
            <p className="text-gray-400">
              SoundCloudアカウントがあればすぐに始められます。
            </p>
          </div>

          {/* 各ステップを縦に並べるためのコンテナ */}
          <div className="flex flex-col gap-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* テキストエリア */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-4xl font-bold text-orange-400 mb-6">
                  Step 1
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  アカウント登録 / ログイン
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  お使いのSoundCloudアカウントでログイン。本アプリ経由でSoundCloud「アーティストの検索」「アーティストのフォロー」「楽曲のいいね」が可能になります。
                </p>
              </div>
              {/* 画像エリア */}
              <div className="md:w-1/2">
                <img
                  src={step1Image}
                  alt="Step 1のスクリーンショット"
                  className="rounded-lg shadow-xl border border-gray-700"
                />
              </div>
            </div>

            {/* Step 2 */}
            {/* md:even:flex-row-reverse で左右を入れ替え */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              {/* テキストエリア */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-4xl font-bold text-orange-400 mb-6">
                  Step 2
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  アーティストをフォロー
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  「アーティストの検索」でお気に入りのアーティストをフォローして、あなたの音楽の好みを登録します。
                </p>
              </div>
              {/* 画像エリア */}
              <div className="md:w-1/2">
                <img
                  src={step2Image}
                  alt="Step 2のスクリーンショット"
                  className="rounded-lg shadow-xl border border-gray-700"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* テキストエリア */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-4xl font-bold text-orange-400 mb-6">
                  Step 3
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  「レコメンド生成ボタン」をクリック
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  フォロー中のアーティストが普段聴いている楽曲の中からあなたへのおすすめを提案します。
                </p>
              </div>
              {/* 画像エリア */}
              <div className="md:w-1/2">
                <img
                  src={step3Image}
                  alt="Step 3のスクリーンショット"
                  className="rounded-lg shadow-xl border border-gray-700"
                />
              </div>
            </div>

            {/* Step 4 */}
            {/* md:even:flex-row-reverse で左右を入れ替え */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              {/* テキストエリア */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-4xl font-bold text-orange-400 mb-6">
                  Step 4
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  気になる楽曲を聴いてみる
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  レコメンド楽曲の中から気になるものを聞いてみましょう。お気に入りの楽曲がきっと見つかります。
                </p>
              </div>
              {/* 画像エリア */}
              <div className="md:w-1/2">
                <img
                  src={step4Image}
                  alt="Step 4のスクリーンショット"
                  className="rounded-lg shadow-xl border border-gray-700"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* テキストエリア */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-4xl font-bold text-orange-400 mb-6">
                  Step 5
                </p>
                <h3 className="text-2xl font-bold mb-4">
                  「ハートボタン」で楽曲をお気に入り登録
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  気に入った楽曲を登録します。登録した楽曲はSoundCloudのいいねに即時反映されます。
                </p>
              </div>
              {/* 画像エリア */}
              <div className="md:w-1/2">
                <img
                  src={step5Image}
                  alt="Step 5のスクリーンショット"
                  className="rounded-lg shadow-xl border border-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export class FetchMyFollowingsUseCase {
  constructor() {}
  async run(sessionId: string | null) {
    // sessionIdがなければ再ログインさせる(sessionがなければ識別できないから)
    if (!sessionId) {
    }
    // sessionIdからセッションを取得
    const session = 
    // セッションが生きているか調べる(TTLしているかどうか)、期限切れだったら再ログインさせる
    // アクセストークンが生きているか調べる
    // 生きていなかったら、リフレッシュトークンでアクセストークンを更新する
    // // アクセストークン再取得
    // // アクセストークンを更新
    //　生きていたら、SoundCloudAPIでフォロー中のアーティストを取得
  }
}

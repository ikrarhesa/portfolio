import type { Home } from "../en/home";

export const home: Home = {
  hero: {
    label: "Ikrar Hesa Prasetya · ジャカルタ",
    // Reversed against the English so this wraps to two lines, which keeps the work section above the
    // fold on a short screen. Japanese breaks at phrase boundaries (word-break: auto-phrase), so
    // "クリエイティブシステム" can never be split: leading with it puts that long phrase on its own
    // line and the rest on the second. Changing the order of the two halves here will cost a line.
    headline: { before: "", emphasis: "クリエイティブシステム", after: "とデジタル製品のデザイナー。" },
    intro:
      "人がコミュニケーションし、つくり、販売するための体験とツールをデザインしています。現在はShopeeで、東南アジア全域で数百万人が利用するクリエイティブツールに取り組んでいます。",
    ctaWork: "主な実績を見る",
    ctaContact: "お問い合わせ",
  },
  proof: [
    {
      eyebrow: "テンプレート利用の伸び · マレーシア",
      label: "毎週テンプレートで投稿される動画の増加率。3か月で200本から34,000本へ",
    },
    {
      // 見出しの「展開した市場」を繰り返さず、市場名そのものを挙げる
      eyebrow: "展開した市場",
      label:
        "インドネシア、マレーシア、タイ、ベトナム、フィリピン、台湾。各言語にローカライズし、担当はマレーシア。",
    },
  ],
  work: { label: "主な実績", heading: "代表的なケーススタディ", viewCase: "ケーススタディを見る" },
  about: {
    label: "プロフィール",
    heading: "私について",
    photoAlt: "スミソニアン国立航空宇宙博物館の外で、アポロ11号のポスターの横に立つIkrar Hesa Prasetya",
    p1: {
      before:
        "ジャカルタを拠点に、プロダクト、ブランド、モーションの領域にまたがる6年以上の経験を持つデザイナーです。現在は",
      link: "Shopee",
      after:
        "で、東南アジアを代表するEコマースプラットフォームのクリエイティブツールや体験（ARを含む）をデザインしています。数百万人が利用しています。",
    },
    p2: "好奇心と、ユーザー体験とビジネスインパクトのバランスがとれた、ユーザーに寄り添ったプロダクトをつくるという使命感が原動力です。",
    p3: {
      before: "Shopeeの前は、",
      link: "Danacita",
      after:
        "でCreative Marketing Associateとして働き、Danacitaのプロダクトとサービスを通じて、学校、大学、ブートキャンプ、学生がより手頃に教育を受けられるよう支援しました。また、それらのプロダクトの市場投入と、Danacitaのデザインチームの拡大にも携わりました。",
    },
    p4: "休日は、愛用のカメラを片手に新しい場所を訪ね歩くのが好きです。",
  },
  contact: {
    label: "お問い合わせ",
    heading: "一緒に仕事をしましょう",
    body: "プロダクトデザインのポジションやコラボレーションのご相談をお待ちしています。通常は数日以内にお返事します。お急ぎの場合は、件名にその旨をお書きください。",
    linkedin: "LinkedIn",
    cv: "履歴書をダウンロード（英語）",
  },
  demo: {
    group: "インタラクティブなARテンプレートのデモ",
    filterGroup: "ARフィルター",
    filters: { gum: "バブルガム", laser: "レーザーアイ" },
    canvas: "選択したARテンプレートを適用したライブカメラ映像",
    loading: "カメラを起動し、顔トラッキングを読み込んでいます…",
    cancel: "キャンセル",
    stop: "カメラを停止",
    start: "AR体験を試す",
    hintOff: "端末内で動作します。アップロードはされません。",
    hintOn: "端末内で動作します。映像がこのブラウザの外に出ることはありません。",
    errors: {
      blocked: "カメラへのアクセスがブロックされました。試すには、ブラウザのサイト設定で許可してください。",
      none: "この端末ではカメラが見つかりませんでした。",
      other: "この端末では顔トラッキングを開始できませんでした。アニメーションのデモは引き続きご覧いただけます。",
    },
    laser: "発射数: {shots}",
    laserCharge: " · チャージ {power}%",
    gumPop: "パン！ ",
    gumSaved: "セーフ！ ",
    gumSize: "顔の{size}倍",
    gumBest: " · 最高 {best}倍",
    shipAria: "宇宙人を撃て！ スペースインベーダーで遊ぶ",
    shipLabel: "宇宙人を撃て！",
    hud: {
      looking: "顔を探しています…",
      live: "ライブ · 端末内で処理",
      gumPop: "パン！ 顔の{size}倍",
      gumBank: "セーフ！ 顔の{size}倍",
      gumCareful: "もうすぐ割れそう、気をつけて",
      gumKeep: "吹き続けて…",
      gumStart: "頬をふくらませてバブルを作ろう",
      laserFire: "発射！",
      laserCool: "充電中…",
      laserBlink: "まばたきで発射！",
      laserCharging: "チャージ中… そのまま",
      laserStart: "眉を上げてチャージ",
    },
  },
};

import type { ARFilterText } from "../../constants/arFilters";

/** 日本語版のARエフェクト解説。「Promo Spesial」などインドネシア語の文言は、実際のエフェクトのまま残しています */
export const jaArFilters: Record<string, ARFilterText> = {
  "editable-text": {
    title: "文字を編集できるステッカー",
    blurb:
      "頭の上に表示されるコマース向けのステッカー。エフェクトライブラリからテキストステッカーを選び、自分のメッセージを入力すると、リアルタイムで更新されます。「Promo Spesial」でも「Limited Offer!」でも、好きな文字にできます。1つのエフェクトで、どんなオファーにも対応します。実際のShopeeアプリで録画しています。",
    tags: ["コマース向け", "編集できる文字", "頭に固定"],
    purpose: "コマース向け: セラーが自分のオファーを書き込める",
    trigger: "入力した文字（リアルタイム）",
  },
  "ngantuk-ya": {
    title: "Ngantuk ya?",
    blurb:
      "ちょっとしたチャレンジ。ほかの人があくびをするのを見て、あくびをせずにいられるか？ エフェクトにはあくびをする顔が表示され、口を開けると失敗です。「Ngantuk ya?」はインドネシア語で「眠いの？」という意味です。",
    tags: ["口を開けるとトリガー", "チャレンジ", "現地語のコピー"],
    purpose: "現地語のコピーと、シンプルなチャレンジ",
    trigger: "口を開ける",
  },
  "nod-to-switch": {
    title: "うなずいて切り替え",
    blurb:
      "真っさらな顔のキャンバスに、悲しい、にやり、いたずらっぽい、と手描きの表情が並びます。うなずくと、表情が切り替わります（「Angguk kepala untuk mengganti」）。うなずくたびに、顔が変わります。",
    tags: ["うなずき検出", "フェイスメッシュ", "手描き"],
    purpose: "現地語のコピーで、シンプルに",
    trigger: "うなずき検出",
  },
};

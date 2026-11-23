import type { Project } from "../en/project";

export const project: Project = {
  caseStudy: "ケーススタディ · {status}",
  screenshotAlt: "{title}のスクリーンショット {n}",
  meta: { role: "役割", focus: "フォーカス", surface: "対象", status: "ステータス", year: "年" },
  moves: { label: "やったこと", heading: "{n}つの取り組み", move: "取り組み {n}" },
  filters: {
    label: "制作物",
    heading: "デザインしたエフェクト",
    intro:
      "ライブラリから3つのエフェクトを紹介します。1つは販売向け、2つは現地のユーザー向けにつくりました。画面収録で、画面に表示されている間ループ再生されます。タップで一時停止・再生できます。",
    filter: "フィルター {n}",
    why: "目的",
    trigger: "トリガー",
  },
  results: "成果",
  learned: "学んだこと",
  talkBody: "判断やトレードオフ、数字について、さらに詳しくお話しします。",
  thumb: {
    previews: "{title}: ARフィルターのループプレビュー",
    screenshot: "{title}のスクリーンショット",
    soon: "{title}のプレビューは準備中です",
  },
  video: { pause: "プレビューを一時停止: {title}", play: "プレビューを再生: {title}" },
};

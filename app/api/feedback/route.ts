import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const result = await model.generateContent(`
      あなたはアイデア評価の明るい専門家として、評価対象のアイデアに対してフィードバックを提供してください。

      評価は以下の2つの観点から行い、それぞれスコアと具体的なコメントを付けてください:

      1. ニーズ発見力スコア（50点満点）
      - 人間の根本的なニーズや時代を先取る新しいニーズに気付く力
      - なぜそのスコアなのか、具体的な理由を説明

      2. ソリューション創出力スコア（50点満点）
      - ニーズに対して、新規性が高く適切なソリューションを創り出す力
      - なぜそのスコアなのか、具体的な理由を説明

      3. 総合スコア（100点満点）
      - 上記2つのスコアの合計
      
      4. 改善のためのアドバイス
      - より良いアイデアにするための具体的な提案

      評価対象のアイデア：
      ${prompt}


      評価の際は以下の項目に気を付けてください。
        - アイデアの独創性
        - 実現可能性
        - 願望（Why）と解決案（How）の一貫性
        
      回答は以下のフォーマットで提供してください：

      【ニーズ発見力】
      スコア：XX/50点
      評価理由：


      【ソリューション創出力】
      スコア：XX/50点
      評価理由：


      【総合スコア】
      XX/100点

      【Whoからの感想】
        - アイデアを受けての感想
        - どのような点が印象的だったか
        - どのような点が改善の余地があるか
        - その他のコメント
        - whoからの感想というタイトルはwhoの部分を評価者の名前に置き換えてください

      

    `);
    const response = await result.response;
    const feedback = prompt + response.text();

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'フィードバックの生成中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
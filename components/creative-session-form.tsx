'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Category = 'who' | 'where' | 'when'

const allOptions: Record<Category, string[]> = {
  who: [
    // 社会的弱者や特定のニーズを持つ人々
    '高齢者', '障害を持つ人', '外国人観光客', '子育て中の親', '単身赴任者',
    // ユーモアのある選択肢
    'SNS中毒の大学生', '推し活に忙しいOL', 'ゲーム実況者', '筋トレマニア', '占い好きな会社員',
    // 猫関連の選択肢
    '気まぐれな猫', '野良猫', '猫カフェの店長', '猫アレルギーの人', '猫の飼い主',
    // バランス型の選択肢
    '眠い会社員', '片付けられない人', '料理初心者', '運動音痴', 'おしゃべり好き',
    '早起き苦手な人', 'お笑い芸人', '謎解き好き', '自撮り中毒の人', 'コスプレイヤー'
  ],
  where: [
    // 課題が生じやすい場所や状況
    '混雑した駅', '過疎地域', '災害避難所', '待機児童の多い地域', '医療過疎地域',
    '観光地', '商店街', '高齢化団地', '工事現場', '繁華街',
    '学校', '病院', '介護施設', '公共施設', '路上',
    '地下鉄', 'バス', '市役所', '図書館', '公園',
    '古いマンション', '狭い賃貸', '田舎の一軒家', '都会のオフィス', '路地裏',
    // ユーモアのある選択肢
    'カラオケボックス', 'ゲームセンター', '宇宙船の中', '謎の洞窟', '占い館',
    // 猫関連の選択肢
    '猫カフェ', '路地裏の空き地', '屋根の上', '魚屋の前', '段ボール箱の中',
    // バランス型の選択肢
    'SNS映えするカフェ', '深夜のコンビニ', '休憩室', 'エレベーター内', '会議室',
    'お笑いライブ会場', '動画撮影スポット', '人気インスタスポット', '秘密基地', 'ペットショップ'
  ],
  when: [
    // 日常的な動作
    '通勤している時', '買い物をしている時', '食事をしている時', '仕事をしている時', '勉強している時',
    '掃除をしている時', '料理をしている時', '運動している時', '休憩している時', '散歩している時',
    
    // 特定状況での動作
    '会議に参加している時', '電車に乗っている時', '待ち合わせをしている時', '並んで待っている時', '荷物を運んでいる時',
    
    // ユーモアのある状況
    'SNSを見ている時', 'ゲームをしている時', '動画を撮影している時', '自撮りをしている時', '配信を見ている時',
    
    // 猫に関連する状況
    '猫の世話をしている時', '猫と遊んでいる時', '猫に起こされた時', '猫の写真を撮っている時', '猫を探している時',
    // 日常的な活動時
    '朝食を準備している時',  '昼休みの時', '帰宅している時', '夕食を作っている時',
    '掃除をしている時', '洗濯をしている時', '買い物をしている時', '料理をしている時', '片付けをしている時',
    
    // 仕事・学習時
    '会議中の時', '締切に追われている時', '資料を作成している時', '勉強している時', 'テスト勉強をしている時',
    '企画を考えている時', 'プレゼンの準備をしている時', '研究している時', '実験している時', '練習している時',
    
    // 移動・待機時
    '電車に乗っている時', 'バスを待っている時', '信号待ちの時', '行列に並んでいる時', 'エレベーターに乗っている時',
    '待ち合わせをしている時', '散歩している時', '通学している時', '徒歩で移動している時', '渋滞に巻き込まれている時',
    
    // 休憩・リラックス時
    '休憩している時', '昼寝をしている時', 'カフェでくつろいでいる時', '公園でリラックスしている時', '温泉に入っている時',
    '音楽を聴いている時', '読書をしている時', 'テレビを見ている時', 'ゲームをしている時', 'SNSを見ている時',
    
    // 特別な状況
    'デートしている時', 'パーティーに参加している時', '旅行している時', '運動している時', 'ショッピングを楽しんでいる時',
    '趣味に没頭している時', 'イベントに参加している時', '撮影している時', '配信している時', 'ライブを見ている時',

  ]
}

const allCategoryModifiers: Record<Category, string[]> = {
  who: [
    '不安を抱える', '忙しい', '経験の浅い', '孤立した', '疲れている',
    '困っている', '焦っている', '悩んでいる', '体力の衰えた', '意欲的な',
    '不慣れな', '経済的に苦しい', 'ストレスを抱えた', '時間に追われる', 
  ],
  where: [
    '設備の古い', '人手不足の', 'アクセスの悪い', '狭い', '混雑する',
    '情報が少ない', '危険がある', '不便な', 'バリアの多い', '孤立した',
    '設備が不十分な', '予算の限られた', '環境の厳しい', '変化の激しい', 'リソースの限られた'
  ],
  when: [
    // 緊急性・切迫感
    '慌てて', '急いで', 'とっさに', 'やむをえず', '必死に',
    
    // ポジティブな感情
    'うきうきと', 'わくわくと', '楽しそうに', '嬉しそうに', '期待に胸を膨らませて',
    
    // ネガティブな感情
    'イライラと', 'げんなりと', '不安そうに', '心配そうに', '緊張して',
    
    // 行動の様子
    'のんびりと', 'せっせと', 'てきぱきと', 'だらだらと', '黙々と',
    
    // 集中度
    '真剣に', '夢中で', '必死に', '一生懸命', '熱心に',
    
    // 静かな様子
    'こっそりと', 'そーっと', '静かに', '慎重に', 'ひっそりと',
    
    // ユーモア
    'にゃーんと', 'ふわふわと', 'のそのそと', 'うろうろと', 'わちゃわちゃと'
  ]
}

const allWhatOptions = {
  left: [
    '運動を', '観察を', '会話を', '衣服を', '音楽を',
    '食事を', '睡眠を', '学習を', '仕事を', '趣味を',
    '旅行を', '読書を', '写真を', '料理を', '芸術を',
    'ゲームを', 'ショッピングを',  'ダンスを', 'ヨガを',
    'スポーツを', '映画鑑賞を', '園芸を', 'ペットの世話を', 'ボランティアを',
    'クローンを','トラブルを','異常を','値段を','環境を',
  ],
  right: [
    '分かりやすくする技術またはデータ', '効率化する技術またはデータ', '共有する技術またはデータ',
    '快適化する技術またはデータ', '簡単にする技術またはデータ', '楽しくする技術またはデータ',
    '安全にする技術またはデータ', '健康的にする技術またはデータ', '環境に優しくする技術またはデータ',
    '創造的にする技術またはデータ', '個人化する技術またはデータ', '自動化する技術またはデータ',
    '最適化する技術またはデータ', '分析する技術またはデータ', '予測する技術またはデータ',
    '管理する技術またはデータ', '可視化する技術またはデータ', '連携する技術またはデータ',
    '温かくする技術またはデータ', '冷やす技術またはデータ', '乾燥させる技術またはデータ',
    '強化する技術またはデータ','計測する技術またはデータ','結合する技術またはデータ',
    '自動化する技術またはデータ','DX化する技術またはデータ','調和させる技術またはデータ',
  ]
}

export function CreativeSessionForm() {
  const [problemNumber, setProblemNumber] = useState(1)
  const [selections, setSelections] = useState<Record<Category, string | null>>({
    who: null,
    where: null,
    when: null
  })
  const [tempSelections, setTempSelections] = useState<Record<Category, string | null>>({
    who: null,
    where: null,
    when: null
  })
  const [options, setOptions] = useState<Record<Category, string[]>>({
    who: [],
    where: [],
    when: []
  })
  const [modifiers, setModifiers] = useState<Record<Category, string>>({
    who: '',
    where: '',
    when: ''
  })
  const [why, setWhy] = useState('')
  const [what, setWhat] = useState<{left: string | null, right: string | null}>({left: null, right: null})
  const [whatOptions, setWhatOptions] = useState<{left: string[], right: string[]}>({left: [], right: []})
  const [how, setHow] = useState('')
  const [open, setOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState<Category>('who')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const randomOptions: Record<Category, string[]> = {
      who: getRandomOptions(allOptions.who, 5),
      where: getRandomOptions(allOptions.where, 5),
      when: getRandomOptions(allOptions.when, 5)
    }
    setOptions(randomOptions)

    const randomModifiers: Record<Category, string> = {
      who: getRandomOptions(allCategoryModifiers.who, 1)[0],
      where: getRandomOptions(allCategoryModifiers.where, 1)[0],
      when: getRandomOptions(allCategoryModifiers.when, 1)[0]
    }
    setModifiers(randomModifiers)

    const randomWhatOptions = {
      left: getRandomOptions(allWhatOptions.left, 5),
      right: getRandomOptions(allWhatOptions.right, 5)
    }
    setWhatOptions(randomWhatOptions)
  }, [])

  const getRandomOptions = (arr: string[], num: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, num)
  }

  const handleSelection = (category: Category, value: string) => {
    setTempSelections(prev => ({ ...prev, [category]: value }))
  }

  const handleWhatSelection = (column: 'left' | 'right', value: string) => {
    setWhat(prev => ({ ...prev, [column]: value }))
  }

  const handleApply = () => {
    setSelections(tempSelections)
    setOpen(false)
  }

  const handleCancel = () => {
    setTempSelections(selections)
    setOpen(false)
  }

  const handleRefreshWhatOptions = () => {
    const randomWhatOptions = {
      left: getRandomOptions(allWhatOptions.left, 5),
      right: getRandomOptions(allWhatOptions.right, 5)
    }
    setWhatOptions(randomWhatOptions)
    // 選択をリセット
    setWhat({left: null, right: null})
  }

  // リセット関数を追加
  const handleNextProblem = () => {
    // 各stateをリセット
    setProblemNumber(prev => prev + 1)
    setSelections({ who: null, where: null, when: null })
    setTempSelections({ who: null, where: null, when: null })
    setWhy('')
    setWhat({ left: null, right: null })
    setHow('')
    setFeedback(null)
    
    // modifiersをランダムに再設定
    setModifiers({
      who: getRandomOptions(allCategoryModifiers.who, 1)[0],
      where: getRandomOptions(allCategoryModifiers.where, 1)[0],
      when: getRandomOptions(allCategoryModifiers.when, 1)[0]
    })
  }

  // バリデーション用の関数を追加
  const isSubmittable = () => {
    // 全ての必須項目が入力/選択されているかチェック
    return (
      // シチュエーションの選択チェック
      selections.who && 
      selections.where && 
      selections.when &&
      // Whyのテキスト入力チェック（20文字以上120文字以下）
      why.length >= 20 && 
      why.length <= 120 &&
      // Whatの選択チェック（左右どちらも選択必要）
      what.left && 
      what.right &&
      // Howのテキスト入力チェック（20文字以上120文字以下）
      how.length >= 20 && 
      how.length <= 120
    )
  }
  
  const handleSubmit = async () => {
    setIsLoading(true)
    setFeedback(null)

    const prompt = `
      シチュエーション：
      Who: ${modifiers.who}${selections.who}
      Where: ${modifiers.where}${selections.where}
      When: ${modifiers.when}${selections.when}

      Why（願望）: ${why}

      What（解決手段）: ${what.left} ${what.right}

      How（具体的な解決案）: ${how}
    `

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API response was not ok: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Error getting feedback:', error);
      setFeedback(`フィードバックの取得中にエラーが発生しました。エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-[#f0f9f8] to-white">
      <Card className="w-full max-w-3xl mx-auto my-8">
        <CardHeader className="flex flex-row items-center space-x-2 bg-[#f0f9f8] text-[#2d4f4f] p-4">
          <CardTitle className="text-2xl font-bold">
            No.<span className="text-5xl">{problemNumber.toString().padStart(2, '0')}</span>
          </CardTitle>
          <div className="flex items-center bg-white rounded-full p-1">
            <Info className="w-4 h-4 text-[#45b19e]" />
          </div>
          <p className="text-sm">創造セッション</p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div>
            <p className="mb-4">1. Who、Where、Whenから1つずつワードを選択し、シチュエーションを作成してください。</p>
            <div className="flex space-x-4 text-[#45b19e] font-medium mb-2">
              <span>Who 誰が</span>
              <span>/</span>
              <span>Where どこで</span>
              <span>/</span>
              <span>When いつ</span>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">選択する</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>シチュエーションを選択</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6">
                  {/* Who セクション */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#45b19e] flex items-center">
                      Who
                      <span className="ml-2 text-sm text-gray-500">誰が</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">「{modifiers.who}」</p>
                    <div className="grid grid-cols-2 gap-2">
                      {options.who.map((option) => (
                        <Button
                          key={option}
                          variant={tempSelections.who === option ? "default" : "outline"}
                          onClick={() => handleSelection('who', option)}
                          className="w-full justify-start h-auto py-2 px-4 text-sm"
                        >
                          <span className="text-[#45b19e]"></span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                    
                  {/* Where セクション */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#45b19e] flex items-center">
                      Where
                      <span className="ml-2 text-sm text-gray-500">どこで</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">「{modifiers.where}」</p>
                    <div className="grid grid-cols-2 gap-2">
                      {options.where.map((option) => (
                        <Button
                          key={option}
                          variant={tempSelections.where === option ? "default" : "outline"}
                          onClick={() => handleSelection('where', option)}
                          className="w-full justify-start h-auto py-2 px-4 text-sm"
                        >
                          <span className="text-[#45b19e]"></span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                    
                  {/* When セクション */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#45b19e] flex items-center">
                      When
                      <span className="ml-2 text-sm text-gray-500">いつ</span>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">「{modifiers.when}」</p>
                    <div className="grid grid-cols-2 gap-2">
                      {options.when.map((option) => (
                        <Button
                          key={option}
                          variant={tempSelections.when === option ? "default" : "outline"}
                          onClick={() => handleSelection('when', option)}
                          className="w-full justify-start h-auto py-2 px-4 text-sm"
                        >
                          <span className="text-[#45b19e]"></span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                    
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={handleCancel}>キャンセル</Button>
                  <Button 
                    onClick={handleApply}
                    disabled={!tempSelections.who || !tempSelections.where || !tempSelections.when}
                  >
                    適用する
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-medium">選択されたシチュエーション：</p>
              <p>Who: {selections.who ? `${modifiers.who}${selections.who}` : '未選択'}</p>
              <p>Where: {selections.where ? `${modifiers.where}${selections.where}` : '未選択'}</p>
              <p>When: {selections.when ? `${modifiers.when}${selections.when}` : '未選択'}</p>
            </div>
          </div>
  
          <div>
            <p className="mb-4">2. 上記のシチュエーションから創造されるWhoの叶えたい願望(Why)を「〜したい」という表現で記入してください。</p>
            <p className="text-[#45b19e] font-medium mb-2">Why Whoの叶えたい願望</p>
            <p className="text-sm text-gray-500 mb-2">※現状、他の方法での解決が難しく、Whoの立場になった時に共感できる願望</p>
            <Textarea 
              placeholder="20文字以上120文字以下で記入してください。" 
              className="min-h-[100px]"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
            />
            <p className="text-right text-sm text-gray-500 mt-1">{why.length}/120</p>
          </div>
  
          <div>
            <p className="mb-4">3. 上記「Why」を解決するためのモノ（What）を選択してください。</p>
            <p className="text-[#45b19e] font-medium mb-2">What 何を</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">選択する</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Whatを選択</span>
                  <Button 
                    variant="outline" 
                    onClick={handleRefreshWhatOptions}
                    className="text-sm"
                  >
                    別のWhatを表示
                    <span className="ml-2">
                      ↺
                    </span>
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-[1fr,2fr] gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">行動</p>
                  <div className="space-y-2">
                    {whatOptions.left.map((option) => (
                      <Button
                        key={option}
                        variant={what.left === option ? "default" : "outline"}
                        onClick={() => handleWhatSelection('left', option)}
                        className="w-full text-center justify-center h-auto py-2 px-4 text-sm"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">技術・データ</p>
                  <div className="space-y-2">
                    {whatOptions.right.map((option) => (
                      <Button
                        key={option}
                        variant={what.right === option ? "default" : "outline"}
                        onClick={() => handleWhatSelection('right', option)}
                        className="w-full text-center justify-center h-auto py-2 px-4 text-sm whitespace-normal"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  onClick={() => setWhat({left: null, right: null})}
                  variant="outline"
                >
                  リセット
                </Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
            {(what.left || what.right) && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p className="font-medium">選択されたWhat：</p>
                {what.left && <p>{what.left}</p>}
                {what.right && <p>{what.right}</p>}
              </div>
            )}
          </div>
  
          <div>
            <p className="mb-4">4. Whatをどのように使ってWhyを実現するか、具体的な解決案(How)を記入してください。</p>
            <p className="text-[#45b19e] font-medium mb-2">How 願望を解決するアイデア</p>
            <p className="text-sm text-gray-500 mb-2">※新規性があり（既存の技術では容易に代用が利かない）、実現可能性が高いと思えるアイデア</p>
            <Textarea 
              placeholder="20文字以上120文字以下で記入してください。" 
              className="min-h-[100px]"
              value={how}
              onChange={(e) => setHow(e.target.value)}
            />
            <p className="text-right text-sm text-gray-500 mt-1">{how.length}/120</p>
          </div>
          <Button 
            className="w-full bg-[#45b19e] hover:bg-[#389b89]" 
            onClick={handleSubmit}
            disabled={isLoading || !isSubmittable()}
          >
            {isLoading ? '処理中...' : '提出する'}
          </Button>

          {!isSubmittable() && (
            <div className="text-sm text-red-500 mt-2">
              <p>以下の項目を入力/選択してください：</p>
              <ul className="list-disc list-inside">
                {!selections.who && <li>Who（誰が）</li>}
                {!selections.where && <li>Where（どこで）</li>}
                {!selections.when && <li>When（いつ）</li>}
                {(why.length < 20 || why.length > 120) && <li>Why（20文字以上120文字以下）</li>}
                {(!what.left || !what.right) && <li>What（行動と技術・データの両方）</li>}
                {(how.length < 20 || how.length > 120) && <li>How（20文字以上120文字以下）</li>}
              </ul>
            </div>
          )}
                  
          {feedback && (
            <>
              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h3 className="text-lg font-semibold mb-2">フィードバック：</h3>
                <div className="whitespace-pre-wrap">{feedback}</div>
              </div>
              <Button 
                className="w-full bg-[#45b19e] hover:bg-[#389b89] mt-4" 
                onClick={handleNextProblem}
              >
                次の問題へ
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
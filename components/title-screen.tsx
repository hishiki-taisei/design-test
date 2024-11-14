'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TitleScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f9f8] to-white">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center bg-[#f0f9f8] text-[#2d4f4f] p-8">
          <CardTitle className="text-4xl font-bold mb-4">デザイン思考テスト</CardTitle>
          <p className="text-xl text-[#45b19e]">Design Thinking Test</p>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
            本質的な課題を発見し解決策を考え出す力である<br />「デザイン思考力」を測定します。
            </p>
            <p className="text-sm text-gray-500">
              ※ セッション時間の目安：15-20分
            </p>
          </div>
          <Button 
            className="w-full bg-[#45b19e] hover:bg-[#389b89] text-lg py-6"
            onClick={() => router.push('/creative-session')}
          >
            セッションを開始する
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
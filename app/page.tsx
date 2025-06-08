import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Star, Zap, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            プレミアム体験へ
            <br />
            アップグレードしませんか？
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            より高度な機能と特別なサービスで、あなたのビジネスを次のレベルに押し上げます
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              無料で始める
            </Button>
          </Link>
          <Link href="/pro">
            <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              <Crown className="w-4 h-4 mr-2" />
              Proプランを見る
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <CardTitle className="text-purple-200">高速処理</CardTitle>
            <CardDescription>
              業界最高水準の処理速度で、効率的な作業を実現
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/20">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <CardTitle className="text-blue-200">セキュリティ</CardTitle>
            <CardDescription>
              エンタープライズグレードのセキュリティで大切なデータを保護
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/20">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <CardTitle className="text-emerald-200">成長支援</CardTitle>
            <CardDescription>
              データ分析とインサイトで継続的な成長をサポート
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Pro Plan CTA */}
      <section className="text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl text-yellow-200">Proプランで更なる可能性を</CardTitle>
            <CardDescription className="text-lg">
              限定機能とプレミアムサポートで、プロフェッショナルな体験を
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-yellow-200 ml-2">ユーザー満足度 98%</span>
            </div>
            <Link href="/pro">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                今すぐProになる
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
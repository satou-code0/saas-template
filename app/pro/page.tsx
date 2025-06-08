'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, Zap, Shield, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function ProPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('アップグレードにはログインが必要です');
      return;
    }

    if (profile?.isPro) {
      toast.info('既にPro会員です');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      });

      // レスポンスが正常でない場合のエラーハンドリング
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API エラー:', errorText);
        throw new Error(`サーバーエラー: ${response.status}`);
      }

      const data = await response.json();
      
      // APIからのエラーレスポンスをチェック
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('決済URLの生成に失敗しました');
      }
    } catch (error) {
      console.error('決済エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '決済の開始に失敗しました';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Proプラン
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          プレミアム機能で、あなたのビジネスを次のレベルへ
        </p>
      </div>

      {/* Pricing Card */}
      <Card className="max-w-md mx-auto bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-2xl text-yellow-200">Pro会員</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">
              ¥2,980
              <span className="text-lg font-normal text-muted-foreground">/月</span>
            </div>
            <CardDescription className="text-yellow-200/80">
              すべての機能を無制限でご利用いただけます
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleUpgrade}
            disabled={loading || profile?.isPro}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 text-lg"
          >
            {loading ? (
              '処理中...'
            ) : profile?.isPro ? (
              '既にPro会員です'
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                今すぐProになる
              </>
            )}
          </Button>
          
          {profile?.isPro && (
            <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <p className="text-green-200 font-medium">
                ✨ Pro会員として登録済みです
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <Zap className="w-5 h-5" />
              高速処理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">処理速度10倍向上</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">優先処理キュー</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">並列処理対応</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <Shield className="w-5 h-5" />
              高度なセキュリティ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">エンタープライズ暗号化</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">アクセス制御</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">監査ログ</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <TrendingUp className="w-5 h-5" />
              高度な分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">カスタムレポート</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">リアルタイム分析</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">データエクスポート</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <Star className="w-5 h-5" />
              プレミアムサポート
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">24時間サポート</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">専属コンサルタント</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm">優先対応</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          お客様の声
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                「Proプランにアップグレードしてから、作業効率が劇的に向上しました。特に高速処理機能は手放せません。」
              </p>
              <div className="text-sm font-medium">田中様 - IT企業CEO</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                「24時間サポートと詳細な分析機能で、ビジネスの成長を実感できています。投資する価値があります。」
              </p>
              <div className="text-sm font-medium">佐藤様 - マーケティング担当</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Crown,
  BarChart3,
  Users,
  TrendingUp,
  Star,
  Zap,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, profile, loading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 初期化が完了してからリダイレクトチェックを行う
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [user, isInitialized, router]);

  // 初期化中はローディング表示
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-muted-foreground">
            アプリケーションを読み込み中...
          </p>
        </div>
      </div>
    );
  }

  // 認証処理中のローディング
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-500" />
          <p className="text-muted-foreground">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合は表示しない（useEffectでリダイレクト）
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          ダッシュボード
        </h1>
        <div className="flex items-center justify-center gap-2">
          <p className="text-xl text-muted-foreground">
            こんにちは、{user.email}さん
          </p>
          {profile?.isPro && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
              <Crown className="w-4 h-4" />
              Pro会員
            </div>
          )}
        </div>
      </div>

      {/* Pro Upgrade Banner */}
      {!profile?.isPro && (
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-purple-200">
                  Proプランにアップグレード
                </h3>
                <p className="text-muted-foreground">
                  より多くの機能と特典をお楽しみください
                </p>
              </div>
              <Link href="/pro">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Crown className="w-4 h-4 mr-2" />
                  アップグレード
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総利用時間</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5時間</div>
            <p className="text-xs text-muted-foreground">前月比 +12%</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              プロジェクト数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.isPro ? "15" : "3"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.isPro ? "無制限利用可能" : "制限あり"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成長率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              今月のパフォーマンス
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Features */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-400" />
              基本機能
            </CardTitle>
            <CardDescription>すべてのユーザーが利用できる機能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">プロジェクト管理</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">基本レポート</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">メールサポート</span>
            </div>
          </CardContent>
        </Card>

        {/* Pro Features */}
        <Card
          className={`${
            profile?.isPro
              ? "bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/30"
              : "bg-slate-900/30 border-slate-700/30 opacity-60"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Pro機能
              {!profile?.isPro && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                  要アップグレード
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {profile?.isPro
                ? "Pro会員限定の高度な機能をご利用いただけます"
                : "Proプランでロック解除される機能"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  profile?.isPro ? "bg-yellow-500" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                高速処理機能
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  profile?.isPro ? "bg-yellow-500" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                高度な分析レポート
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  profile?.isPro ? "bg-yellow-500" : "bg-gray-500"
                }`}
              ></div>
              <span className="text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" />
                優先サポート
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Content */}
      {profile?.isPro && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <Crown className="w-5 h-5" />
              Pro会員限定コンテンツ
            </CardTitle>
            <CardDescription>
              特別なツールとリソースをご利用ください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-200 mb-2">
                🎯 高度な分析ツール
              </h4>
              <p className="text-sm text-muted-foreground">
                詳細なメトリクスとカスタムレポートでビジネスの成長を追跡
              </p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-200 mb-2">
                ⚡ プレミアム機能
              </h4>
              <p className="text-sm text-muted-foreground">
                自動化ワークフローと高速処理でより効率的な作業を実現
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

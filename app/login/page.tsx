"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signIn, signUp, user, loading, isInitialized } = useAuth();
  const router = useRouter();

  // URLパラメータから状態を取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    const verified = urlParams.get("verified");

    if (error === "auth_failed") {
      toast.error("認証に失敗しました。再度お試しください。");
    }

    if (verified === "true") {
      toast.success("メールアドレスが確認されました！");
    }

    // URLパラメータをクリア
    if (error || verified) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // 初期化が完了してからリダイレクトチェックを行う
  useEffect(() => {
    if (isInitialized && user) {
      router.push("/dashboard");
    }
  }, [user, isInitialized, router]);

  // 初期化中はローディング表示
  if (!isInitialized) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  // すでにログインしている場合は表示しない（useEffectでリダイレクトする）
  if (user) {
    return null;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("メールアドレスを入力してください");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("有効なメールアドレスを入力してください");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (
    password: string,
    isSignUp: boolean = false
  ): boolean => {
    if (!password) {
      setPasswordError("パスワードを入力してください");
      return false;
    }
    if (isSignUp && password.length < 6) {
      setPasswordError("パスワードは6文字以上で入力してください");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const result = await signIn(email, password);

    if (result.success) {
      toast.success("ログインしました");
      router.push("/dashboard");
    } else {
      toast.error(result.error || "ログインに失敗しました");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, true);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const result = await signUp(email, password);

    if (result.success) {
      if (result.error) {
        // メール確認が必要な場合
        toast.success(
          "確認メールを送信しました。メールボックスをご確認ください。"
        );
      } else {
        toast.success("アカウントを作成しました");
        router.push("/dashboard");
      }
    } else {
      toast.error(result.error || "新規登録に失敗しました");
    }
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-700/50 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            ProServiceへようこそ
          </CardTitle>
          <CardDescription>
            アカウントでログインまたは新規登録してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            className="space-y-4"
            onValueChange={clearErrors}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">新規登録</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {emailError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {emailError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validatePassword(password)}
                      className={`pl-10 pr-10 ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {passwordError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ログイン中...
                    </div>
                  ) : (
                    "ログイン"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">メールアドレス</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => validateEmail(email)}
                      className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {emailError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {emailError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">パスワード</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワード（6文字以上）"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validatePassword(password, true)}
                      className={`pl-10 pr-10 ${
                        passwordError ? "border-red-500" : ""
                      }`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {passwordError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      登録中...
                    </div>
                  ) : (
                    "新規登録"
                  )}
                </Button>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    新規登録後、確認メールが送信されます。メールボックスをご確認ください。
                  </AlertDescription>
                </Alert>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

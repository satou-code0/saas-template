"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase, Profile } from "@/lib/supabase";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 現在のセッションを取得
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("セッション取得エラー:", error);
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("セッション初期化エラー:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    getSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("認証状態変更:", event);

      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [isInitialized]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // プロフィールが存在しない場合は作成
          console.log("プロフィールが存在しないため作成します");
          await createProfile(userId);
        } else {
          console.error("プロフィール取得エラー:", error);
        }
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("プロフィール取得エラー:", error);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user?.email) return;

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: user.data.user.email,
          isPro: false,
        })
        .select()
        .single();

      if (error) {
        console.error("プロフィール作成エラー:", error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("プロフィール作成エラー:", error);
    }
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: getErrorMessage(error.message) };
      }

      if (data.user && !data.session) {
        // メール確認が必要な場合
        toast.success(
          "確認メールを送信しました。メールボックスをご確認ください。"
        );
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("新規登録エラー:", error);
      return { success: false, error: "新規登録に失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: getErrorMessage(error.message) };
      }

      return { success: true };
    } catch (error) {
      console.error("ログインエラー:", error);
      return { success: false, error: "ログインに失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("ログアウトエラー:", error);
        toast.error("ログアウトに失敗しました");
      } else {
        toast.success("ログアウトしました");
      }
    } catch (error) {
      console.error("ログアウトエラー:", error);
      toast.error("ログアウトに失敗しました");
    }
    finally {
      setLoading(false); // ←必ずOFFに
    }
  };

  // エラーメッセージを日本語に変換
  const getErrorMessage = (errorMessage: string): string => {
    const errorMap: { [key: string]: string } = {
      "Invalid login credentials":
        "メールアドレスまたはパスワードが正しくありません",
      "Email not confirmed": "メールアドレスが確認されていません",
      "User already registered": "このメールアドレスは既に登録されています",
      "Password should be at least 6 characters":
        "パスワードは6文字以上で入力してください",
      "Signup is disabled": "新規登録は現在無効になっています",
      "Email rate limit exceeded":
        "メール送信の制限に達しました。しばらく待ってから再試行してください",
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }

    return errorMessage;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signUp,
        signIn,
        signOut,
        loading,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, LogOut, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, profile, signOut, loading, isInitialized } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string | undefined): string => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          ProService
        </Link>

        <div className="flex items-center gap-4">
          {!isInitialized ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : user ? (
            <>
              {profile?.isPro && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  Pro
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.isPro ? "Pro ユーザー" : "フリー ユーザー"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      ダッシュボード
                    </Link>
                  </DropdownMenuItem>
                  {!profile?.isPro && (
                    <DropdownMenuItem asChild>
                      <Link href="/pro" className="cursor-pointer">
                        <Crown className="w-4 h-4 mr-2" />
                        Proにアップグレード
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={loading}
                    className="cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                ログイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

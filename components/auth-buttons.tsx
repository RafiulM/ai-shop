"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthButtons() {
  const { data: session, isPending } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  if (session?.user) {
    const user = session.user;
    const initials = user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.email?.[0]?.toUpperCase() || "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && (
                <p className="font-medium">{user.name}</p>
              )}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Link>
      </Button>
    </div>
  );
}

// Simplified version for hero section
export function HeroAuthButtons() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="text-base px-8 py-3">
          <Link href="/dashboard">
            <User className="mr-2 h-5 w-5" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button asChild size="lg" className="text-base px-8 py-3">
        <Link href="/sign-up">
          <UserPlus className="mr-2 h-5 w-5" />
          Get Started
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="text-base px-8 py-3">
        <Link href="/sign-in">
          <LogIn className="mr-2 h-5 w-5" />
          Sign In
        </Link>
      </Button>
    </div>
  );
}
"use client";

import {
  HomeIcon,
  LogIn,
  Menu,
  UserPlus,
  Languages,
  User,
  LogOut,
} from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Separator } from "../ui/separator";
import { useAuth } from "../../context/userContext";
import Link from "next/link";

// --- Assuming your supported locales are defined somewhere ---
const SUPPORTED_LOCALES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
];
// -----------------------------------------------------------

// NOTE: I'm adding a Logout link here for a complete authenticated experience
const navLinks = [
  { title: "home", icon: HomeIcon, href: "/" },
  // These links should ONLY show when the user is NOT logged in.
  { title: "login", icon: LogIn, href: "/login", hideOnAuth: true },
  { title: "signup", icon: UserPlus, href: "/signup", hideOnAuth: true },
  // Add a link for authenticated users (e.g., Profile or Logout)
  // { title: "profile", icon: UserCircle, href: "/profile", showOnAuth: true },
];

const Navbar = () => {
  const t = useTranslations("navbar");
const { user, logout } = useAuth(); // Assume 'user' is the authentication state
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  /**
   * FIX: Determines if a navigation link should be hidden.
   * If `nav.hideOnAuth` is true, hide the link if the user is logged in.
   * @param {boolean} hideOnAuth - Indicates if the link should be hidden when authenticated.
   * @returns {boolean} True if the link should be hidden, false otherwise.
   */
  const shouldHide = (hideOnAuth) => {
    // Hide 'Login' and 'Signup' links if the user IS logged in.
    if (hideOnAuth && user) {
      return true;
    }
    // You could add logic here for links that should ONLY show when logged in:
    // if (showOnAuth && !user) {
    //    return true;
    // }
    return false;
  };

  // Function to handle locale change
  const onLocaleChange = (newLocale) => {
    // pathname starts with the locale, e.g., /en/login
    // We replace the first two characters (e.g., '/e') with the new locale
    const newPathname = `/${newLocale}${pathname.substring(3)}`;
    router.replace(newPathname);
  };

  // Language Dropdown Component
  const LanguageSwitcher = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => onLocaleChange(locale.code)}
            // Highlight the currently active locale
            className={
              currentLocale === locale.code ? "font-bold bg-muted" : ""
            }
          >
            {locale.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ProfileDropDown = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
              <span className="sr-only">{t("profile")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{user.email}</DropdownMenuItem>
            <Separator />
            <Link href={"/settings"}>
              <DropdownMenuItem className="cursor-pointer">{t("settings")}</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="font-bold text-xl tracking-tight">
          <Link href="/">
            Logo <span className="text-primary">App</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((nav, i) => {
              // Conditional rendering for desktop
              if (shouldHide(nav.hideOnAuth)) {
                return null;
              }

              return (
                <Button asChild variant="ghost" key={i}>
                  <Link
                    href={nav.href}
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    <nav.icon className="h-4 w-4" />
                    <span>{t(nav.title)}</span>
                  </Link>
                </Button>
              );
            })}
            <ProfileDropDown />
            <LanguageSwitcher />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <ProfileDropDown />

            <LanguageSwitcher />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="left">
                {/* Mobile Menu Links */}
                <div className="flex flex-col space-y-2 p-6">
                  {navLinks.map((nav, i) => {
                    // Conditional rendering for mobile
                    if (shouldHide(nav.hideOnAuth)) {
                      return null;
                    }

                    const Icon = nav.icon;

                    return (
                      <Link
                        href={nav.href}
                        key={i}
                        className="flex items-center space-x-4 p-3 rounded-md transition-colors hover:bg-muted font-semibold text-base"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <span>{t(nav.title)}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

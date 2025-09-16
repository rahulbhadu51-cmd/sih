
"use client";

import Link from "next/link";
import { Globe, User, LogOut, Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" },
  { value: "nag", label: "Nagpuri (Sadri)" },
  { value: "kho", label: "Khortha" },
  { value: "kru", label: "Kurmali (Panchpargania)" },
  { value: "sat", label: "Santali" },
  { value: "unr", label: "Mundari" },
  { value: "hoc", label: "Ho" },
  { value: "krux", label: "Kurukh (Oraon)" },
  { value: "kha", label: "Kharia" },
  { value: "bhu", label: "Bhumij" },
  { value: "biy", label: "Birhor" },
  { value: "mjt", label: "Malto (Paharia)" },
  { value: "bn", label: "Bengali" },
  { value: "or", label: "Odia" },
  { value: "mag", label: "Magahi" },
  { value: "mai", label: "Maithili" },
  { value: "bho", label: "Bhojpuri" },
  { value: "anp", label: "Angika" },
  { value: "pa", label: "Punjabi" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
  { value: "ne", label: "Nepali" },
];

export default function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const { language, setLanguage, isTranslating, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // In a real app, you'd check a token or session
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    window.location.href = "/";
  };
  
  const NavLinks = ({ isMobile = false }) => (
    <>
       <Link
        href="/issues-covered"
        className={cn("text-sm font-medium hover:underline underline-offset-4",
          pathname === '/issues-covered' ? 'text-primary' : (isMobile ? 'text-gray-700' : 'text-white'),
          isMobile && "py-2 text-lg"
        )}
        prefetch={false}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {t('header_issues_covered')}
      </Link>
      <Link
        href="/my-reports"
        className={cn("text-sm font-medium hover:underline underline-offset-4",
          pathname === '/my-reports' ? 'text-primary' : (isMobile ? 'text-gray-700' : 'text-white'),
          isMobile && "py-2 text-lg"
        )}
        prefetch={false}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {t('header_my_reports')}
      </Link>
      <Link
        href="/our-work"
        className={cn("text-sm font-medium hover:underline underline-offset-4",
          pathname === '/our-work' ? 'text-primary' : (isMobile ? 'text-gray-700' : 'text-white'),
          isMobile && "py-2 text-lg"
        )}
        prefetch={false}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {t('home_our_work_button')}
      </Link>
      <div className={cn("flex items-center gap-1", isMobile && "flex-col items-start pt-4")}>
         <div className="flex items-center gap-1">
            {isTranslating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
            <Select value={language} onValueChange={setLanguage} disabled={isTranslating}>
              <SelectTrigger className={cn("w-auto border-0 focus:ring-0 gap-2 text-sm", isMobile ? "bg-transparent text-gray-700" : "bg-black text-white")}>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>
      </div>
    </>
  );


  return (
    <header className="bg-black text-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/RMC_LOGO.jpg"
            alt="RMC Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-lg font-headline font-semibold">MeraShahar</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-gray-800 hover:text-white flex items-center gap-2">
                    <User />
                    <span className="hidden sm:inline">{username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('header_my_account')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header_logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex text-white hover:bg-gray-800 hover:text-white">
                  <Link href="/login">{t('header_login')}</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/signup">{t('header_signup')}</Link>
                </Button>
              </>
            )}
             <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-white text-black">
                  <SheetHeader>
                    <SheetTitle className="text-left font-headline">Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 py-8">
                    <NavLinks isMobile={true}/>
                  </nav>
                  {!isAuthenticated && (
                     <div className="flex flex-col gap-2 mt-auto">
                        <Button asChild onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                     </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

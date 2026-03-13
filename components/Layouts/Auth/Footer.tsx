"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { HelpCircle, HomeIcon, ScrollTextIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const currentURL = usePathname();

  return (
    <footer className="px-2 mt-auto mx-auto md:mx-0 py-4 my-5 md:flex md:justify-between items-center justify-center dark:text-white">
      <p>Copyright&copy; {new Date().getFullYear()} | Gen-A Operator</p>
      <NavigationMenu className="mt-3 flex justify-between">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {<HomeIcon className="mr-2" />} Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {currentURL === "/login" ? (
              <Link href="/forget" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <HelpCircle className="mr-2" /> Forget Pass
                </NavigationMenuLink>
              </Link>
            ) : (
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <ScrollTextIcon className="mr-2" /> Sign In
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </footer>
  );
};

export default Footer;

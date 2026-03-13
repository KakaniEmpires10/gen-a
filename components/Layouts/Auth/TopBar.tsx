"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const TopBar = () => {
  return (
    <nav
      className="px-4 py-2 rounded-xl mt-5 flex justify-between
     items-center shadow shadow-slate-500 backdrop-blur-sm
    "
    >
      <div>
        <Image
          className="p-1"
          src="/Logo_GEN-A.png"
          width={50}
          height={60}
          alt="logo"
        />
      </div>
      <NavigationMenu className="hidden sm:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/about_us" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact_us" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/unggulan" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Unggulan
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Drawer>
        <DrawerTrigger className="sm:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle navigation</span>
        </DrawerTrigger>
        <DrawerContent className="pb-5">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <hr className="w-2/3 mx-auto my-2" />
          <ul className="text-muted-foreground mx-10">
            <li><Link className={buttonVariants({ variant: "ghost", className: 'w-full' })} href="/about_us">About Us</Link></li>
            <li><Link className={buttonVariants({ variant: "ghost", className: 'w-full' })} href="/contact_us">Contact Us</Link></li>
            <li><Link className={buttonVariants({ variant: "ghost", className: 'w-full' })} href="/unggulan">Unggulan</Link></li>
          </ul>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default TopBar;
"use client";

import { cn } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import { Menu, X } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";

const MD_BREAKPOINT = 768;

const NavbarLink: React.FC<
  LinkProps & {
    children: React.ReactNode;
  }
> = (props) => {
  const pathname = usePathname();
  const currentPage = `/${pathname.split("/")[1]}`;

  return (
    <Link
      {...props}
      className={cn(
        "w-fit",
        props.href === currentPage ? "font-semibold text-primary" : ""
      )}
    />
  );
};

const Title = ({ as }: { as: "h1" | "p" }) => {
  const node = React.createElement(
    as,
    { className: "text-2xl hover:text-foreground hover:font-normal" },
    "📉 Ex País"
  );
  return node;
};

const MobileNavbarLinkWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className="p-3">{children}</div>;
};

const NavbarDrawer: React.FC<{
  links: {
    href: string;
    text: string;
  }[];
}> = ({ links }) => {
  const { width } = useWindowSize();
  const searchParams = useSearchParams();
  const isMenuOpen = searchParams.get("menu") === "open";

  const toggleDrawer = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (open) {
      newParams.set("menu", "open");
    } else {
      newParams.delete("menu");
    }

    window.history.pushState({}, "", `?${newParams.toString()}`);
  };

  // Prevent drawer opening with url if is not mobile
  const isDrawerVisible = !!width && width < MD_BREAKPOINT;

  if (!isDrawerVisible) {
    return null;
  }

  return (
    <Drawer direction="right" open={isMenuOpen} onOpenChange={toggleDrawer}>
      <DrawerTrigger className="md:hidden">
        <Menu />
        <DrawerContent className="h-full">
          <DrawerClose className="absolute top-4 right-4">
            <X />
          </DrawerClose>
          <div className="p-6 flex flex-col">
            <Title as="p" />
            {links.map((link) => (
              <MobileNavbarLinkWrapper key={link.href}>
                <NavbarLink href={link.href}>{link.text}</NavbarLink>
              </MobileNavbarLinkWrapper>
            ))}
          </div>
        </DrawerContent>
      </DrawerTrigger>
    </Drawer>
  );
};

const Navbar: React.FC<{
  links: {
    href: string;
    text: string;
  }[];
}> = ({ links }) => {
  return (
    <nav className="bg-muted w-full py-4 border-b border-b-primary">
      <div className="container flex justify-between items-center">
        <Link href="/">
          <Title as="h1" />
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <NavbarLink key={link.href} href={link.href}>
              {link.text}
            </NavbarLink>
          ))}
        </div>

        <NavbarDrawer links={links} />
      </div>
    </nav>
  );
};

export default Navbar;

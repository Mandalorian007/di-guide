import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { CommandIcon, CoffeeIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t w-full h-16">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-4">
        <div className="flex items-center gap-3">
          <CommandIcon className="sm:block hidden w-5 h-5 text-muted-foreground" />
          <p className="text-center">
            Site provided by the{" "}
            <Link
              className="px-1 underline underline-offset-2"
              href="#"
            >
              ThunderClap Gaming Community
            </Link>
          </p>
        </div>

        <div className="gap-4 items-center hidden md:flex">
          <FooterButtons />
        </div>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://www.buymeacoffee.com/thunderclap"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <CoffeeIcon className="h-4 w-4 mr-2 text-amber-600 fill-current" />
        Buy Me a Coffee
      </Link>
    </>
  );
}

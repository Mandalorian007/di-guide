import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon, SwordIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OgImage from "../app/opengraph-image.jpg";

export default function Home() {
  return (
    <div className="relative flex sm:min-h-[85.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center px-2 sm:py-8 py-12">
      {/* Background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
        <Image
          src={OgImage}
          alt=""
          width={1500}
          height={1500}
          className="max-w-none w-auto h-auto opacity-60 brightness-110"
          priority
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]"></div>
      </div>
      <Link
        href="https://github.com/Mandalorian007/di-guide"
        target="_blank"
        className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4 sm:-mt-12"
      >
        Contribute on GitHub{" "}
        <MoveUpRightIcon className="w-4 h-4 font-extrabold" />
      </Link>
      <h1 className="text-[2.2rem] leading-tight sm:leading-tight font-bold mb-6 sm:text-5xl max-w-[800px] text-center">
        The Ultimate Resource for Diablo Immortal Players
      </h1>
      <p className="mb-8 sm:text-lg max-w-[800px] text-muted-foreground text-left sm:text-center">
        Comprehensive guides, build recommendations, dungeon strategies, and in-depth 
        mechanics explanations to help you conquer the world of Sanctuary.
      </p>
      <div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm;gap-5 gap-3 mb-8">
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Class Guides
        </Link>
        <Link
          href="/blog"
          className={buttonVariants({
            variant: "secondary",
            className: "px-6",
            size: "lg",
          })}
        >
          Latest Updates
        </Link>
      </div>
      <span className="sm:flex hidden flex-row items-start sm:gap-2 gap-0.5 text-muted-foreground text-md mt-9 -mb-12 max-[800px]:mb-12 font-code sm:text-base text-sm font-medium border rounded-full p-2.5 px-5 bg-muted/55">
        <SwordIcon className="w-5 h-5 sm:mr-1 mt-0.5" />
        {"Season 27: Rise of the Worldstone is LIVE!"}
      </span>
    </div>
  );
}
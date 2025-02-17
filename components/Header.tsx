import Link from "next/link";
import { ModeToggle } from "./ui/theme";
import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="mb-4">
      <div className="mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl flex sm:text-2xl sm:font-bold antialiased font-semibold">
            <Link
              href="https://sdk.vercel.ai"
              className="flex items-center mr-2 hover:opacity-75"
              target="_blank"
            >
              <Sparkles />
              Serverless
            </Link>
            Meme Generator
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

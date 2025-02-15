import { Header } from "./Header";
import { PromptInput } from "./PromptInput";

export function ImageGround() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <PromptInput />
      </div>
    </div>
  );
}

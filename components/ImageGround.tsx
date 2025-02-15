"use client";
import { useState } from "react";
import { Header } from "./Header";
import { PromptInput } from "./PromptInput";
import { ModelMode } from "@/lib/provider-config";
import { Suggestion } from "@/lib/suggestions";

export function ImageGround({ suggestions }: { suggestions: Suggestion[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showProviders, setShowProviders] = useState(true);
  const [mode, setMode] = useState<ModelMode>("performance");

  const handlePromptSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleView = () => {
    setShowProviders((prev) => !prev);
  };

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setShowProviders(true);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={isLoading}
          showProviders={showProviders}
          onToggleProviders={toggleView}
          mode={mode}
          onModeChange={handleModeChange}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}

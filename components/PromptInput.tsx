"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";

export function PromptInput() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSuggestions(getRandomSuggestions());
  }, []);

  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt here"
            rows={3}
            className="text-base bg-transparent border-none p-0 resize-none placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSuggestions(getRandomSuggestions())}
                className="text-slate-500 dark:text-slate-400 hover:opacity-70"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="px-2 rounded-lg py-1 text-sm text-slate-900 dark:text-slate-100 hover:opacity-70 group transition-opacity duration-200"
                  onClick={() => setInput(suggestion.prompt)}
                >
                  {suggestion.text.toLowerCase()}
                  <ArrowUpRight className="ml-1 h-3 w-3 text-slate-500 dark:text-slate-400 group-hover:opacity-70" />
                </Button>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="h-8 w-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <Spinner className="w-3 h-3" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

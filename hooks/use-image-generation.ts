import { useState } from "react";
import { ImageError, ImageResult, ProviderTiming } from "@/lib/image-types";
import { initializeProviderRecord, ProviderKey } from "@/lib/provider-config";

interface UseImageGenerationReturn {
  images: ImageResult[];
  errors: ImageError[];
  timings: Record<ProviderKey, ProviderTiming>;
  failedProviders: ProviderKey[];
  isLoading: boolean;
  startGeneration: (
    prompt: string,
    providers: ProviderKey[],
    providerToModel: Record<ProviderKey, string>
  ) => Promise<void>;
  resetState: () => void;
  activePrompt: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [errors, setErrors] = useState<ImageError[]>([]);
  const [timings, setTimings] = useState<Record<ProviderKey, ProviderTiming>>(
    initializeProviderRecord<ProviderTiming>()
  );
  const [failedProviders, setFailedProviders] = useState<ProviderKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");

  const resetState = () => {
    setImages([]);
    setErrors([]);
    setTimings(initializeProviderRecord<ProviderTiming>());
    setFailedProviders([]);
    setIsLoading(false);
  };

  const startGeneration = async (
    prompt: string,
    providers: ProviderKey[],
    providerToModel: Record<ProviderKey, string>
  ) => {
    setActivePrompt(prompt);
    try {
      setIsLoading(true);
      setImages(
        providers.map((provider) => ({
          provider,
          image: null,
          modelId: providerToModel[provider],
        }))
      );
      setErrors([]);
      setFailedProviders([]);

      const now = Date.now();
      setTimings(
        Object.fromEntries(
          providers.map((provider) => [provider, { startTime: now }])
        ) as Record<ProviderKey, ProviderTiming>
      );

      const generateImage = async (provider: ProviderKey, modelId: string) => {
        const startTime = now;
        console.log(
          `Generate image request [provider=${provider}, modelId=${modelId}]`
        );
        try {
          // Simulate a base64-encoded image
          const dummyBase64 =
            "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UEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUGjjluI3RByZuPRTd/8KSfdH9r1yyLrr/39+5Obr/7uvGR/cnLT8hur/stQ3R/cMTzovu/92GS6L7t973enR/0cyPRff3Hzo/uj+4fHp0/5b5c6L7r914UXTfBQBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBpceO5l0Qf+fcu26P6UjddF9//nnROi+3M2bIjuT5v0VnT/wZEPRvc/e9xD0f3vz9kR3X/5uOOj+6t/fHp0f/1v74/uPzrtgej+qBkbo/t3vHROdP/YDc9E910AAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAECpwdMe+1j0gd+cNxzdf2rsK9H91cNnRffv/eZd0f1Ljl8e3X964nej+9+d+Y3o/toj74ru37v6F6P7V2z5i+j+pFOeie6PPvE70f1tH90Z3X981ezo/tCvHhPddwEAlBIAgFICAFBKAABKCQBAKQEAKCUAAKUEAKCUAACUEgCAUgIAUEoAAEoJAEApAQAoJQAApQQAoJQAAJQSAIBSAgBQSgAASgkAQCkBACglAAClBACglAAAlBIAgFICAFBKAABKCQBAKQEAKCUAAKX+LwAA///twINczdhsSAAAAABJRU5ErkJggg=="; // Truncated example

          const completionTime = Date.now();
          const elapsed = completionTime - startTime;
          setTimings((prev) => ({
            ...prev,
            [provider]: {
              startTime,
              completionTime,
              elapsed,
            },
          }));

          console.log(
            `Successful image response [provider=${provider}, modelId=${modelId}, elapsed=${elapsed}ms]`
          );

          setImages((prevImages) =>
            prevImages.map((item) =>
              item.provider === provider
                ? { ...item, image: dummyBase64, modelId }
                : item
            )
          );
        } catch (err) {
          console.error(
            `Error [provider=${provider}, modelId=${modelId}]:`,
            err
          );
          setFailedProviders((prev) => [...prev, provider]);
          setErrors((prev) => [
            ...prev,
            {
              provider,
              message:
                err instanceof Error
                  ? err.message
                  : "An unexpected error occurred",
            },
          ]);

          setImages((prevImages) =>
            prevImages.map((item) =>
              item.provider === provider
                ? { ...item, image: null, modelId }
                : item
            )
          );
        }
      };

      const fetchPromises = providers.map((provider) => {
        const modelId = providerToModel[provider];
        return generateImage(provider, modelId);
      });

      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    images,
    errors,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    resetState,
    activePrompt,
  };
}

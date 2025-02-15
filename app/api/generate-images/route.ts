import { NextRequest, NextResponse } from "next/server";
import { ImageModel, experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { ProviderKey } from "@/lib/provider-config";
import { GenerateImageRequest } from "@/lib/api-types";

const TIMEOUT_MILLIS = 55 * 1000;
const DEFAULT_IMAGE_SIZE = "1024x1024";

interface ProviderConfig {
  createImageModel: (modelId: string) => ImageModel;
  dimensionFormat: "size" | "aspectRatio";
}

const providerConfig: Record<ProviderKey, ProviderConfig> = {
  openai: {
    createImageModel: openai.image,
    dimensionFormat: "size",
  },
};

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMillis: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMillis)
    ),
  ]);
};

export async function POST(req: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  const { prompt, provider, modelId } =
    (await req.json()) as GenerateImageRequest;

  try {
    if (!prompt || !provider || !modelId || !providerConfig[provider]) {
      const error = "Invalid request parameters";
      console.error(`${error} [requestId=${requestId}]`);
      return NextResponse.json({ error }, { status: 400 });
    }

    const config = providerConfig[provider];
    const startstamp = performance.now();
    const generatePromise = generateImage({
      model: config.createImageModel(modelId),
      prompt,
      size: DEFAULT_IMAGE_SIZE,
    }).then(({ image, warnings }) => {
      if (warnings?.length > 0) {
        console.warn(
          `Warnings [requestId=${requestId}, provider=${provider}, model=${modelId}]: `,
          warnings
        );
      }
      console.log(
        `Completed image request [requestId=${requestId}, provider=${provider}, model=${modelId}, elapsed=${(
          (performance.now() - startstamp) /
          1000
        ).toFixed(1)}s].`
      );

      return {
        provider,
        image: image.base64,
      };
    });

    const result = await withTimeout(generatePromise, TIMEOUT_MILLIS);
    return NextResponse.json(result, {
      status: "image" in result ? 200 : 500,
    });
  } catch (error) {
    console.error(
      `Error generating image [requestId=${requestId}, provider=${provider}, model=${modelId}]: `,
      error
    );
    return NextResponse.json(
      {
        error: "Failed to generate image. Please try again later.",
      },
      { status: 500 }
    );
  }
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ModeToggle } from "@/components/ui/theme";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="flex justify-between w-full max-w-2xl">
        <h1 className="text-3xl font-bold">ShadCN + Tailwind Demo</h1>
        <ModeToggle />
      </div>

      <Card className="mt-8 w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-lg">
            This is a sample card using the theme variables.
          </p>
        </CardContent>
      </Card>

      <Button className="mt-6">Primary Button</Button>
    </div>
  );
}

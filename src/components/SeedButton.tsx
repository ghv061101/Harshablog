import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedDatabase } from "@/lib/seedData";
import { toast } from "sonner";
import { Database, Loader2 } from "lucide-react";

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isSeeding ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Seed Sample Data
        </>
      )}
    </Button>
  );
}

// react
import { useFormStatus } from "react-dom";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

export default function SearchButton() {
  // Whether or not the form is pending
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? <Loader2 className="size-11 animate-spin" /> : <MagnifyingGlassIcon className="size-11" />}
    </Button>
  );
}

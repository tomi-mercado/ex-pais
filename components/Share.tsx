"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, Share2 as ShareIcon, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "./ui/use-toast";

const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN || "";

export function Share() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast();

  const shareablePath = `${ORIGIN}${pathname}?${searchParams.toString()}`;

  const handleCopy = () => {
    copyToClipboard(shareablePath);
    toast({
      title: "Link copiado al portapapeles",
      description: "Ya puedes compartir tu tristeza 😔",
    });
  };

  const encodedText = encodeURIComponent(
    "Mira cómo se destroza nuestro poder adquisitivo 😔\n\n"
  );
  const twitterShareHref = `https://twitter.com/intent/tweet?text=${encodedText}&url=${shareablePath}`;
  const whatsappShareHref = `https://api.whatsapp.com/send?text=${encodedText}${shareablePath}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <ShareIcon className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Comparte tu tristeza 🥺</DialogTitle>
          <DialogDescription>
            Sufre junto a tus amigxs la destrucción total de tu poder
            adquisitivo
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={shareablePath} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Compartir a traves de:</p>
            <div className="flex gap-3 items-center">
              <Link href={twitterShareHref} target="_blank">
                <Twitter />
              </Link>
              <Link href={whatsappShareHref} target="_blank">
                <FaWhatsapp className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

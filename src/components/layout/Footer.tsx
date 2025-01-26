import Image from "next/image";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 py-8">
          <div className="flex items-center justify-between">
            <div className="w-24">
              <Image
                src="https://gravatar.com/avatar/e53a75077d355074ce92ce1d36688bba?s=400&d=robohash&r=x"
                alt="Sunrise Logo"
                width={96}
                height={30}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Sunrise. All rights reserved.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">Follow us on</span>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

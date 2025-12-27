import Image from "next/image";

function Footer() {
  return (
    <footer className="px-6 py-15 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Image
                src="/LOGO-ONLY.png"
                alt="DentWise Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-cover"
              />
              <span className="font-semibold text-lg">KrishiSaathi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered agricultural insights that actually helps.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 KrishiSaathi. Built for grassroots farmers facing real agricultural challenges.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
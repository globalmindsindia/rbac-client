import companyLogo from "@/assets/gmi_logo.png";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-background-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="h-8 w-auto object-contain mb-4"
            />
            <p className="text-muted-foreground text-sm max-w-md">
              Empowering businesses with cutting-edge SaaS solutions. Transform
              your workflow with our comprehensive suite of applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Applications
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@company.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Business Ave</li>
              <li>Tech City, TC 12345</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

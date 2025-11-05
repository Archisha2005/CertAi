import { Link } from "wouter";
import logoImage from "@assets/Gemini_Generated_Image_d86gqtd86gqtd86g_1761457022206.png";

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <img src={logoImage} alt="CertAi Logo" className="h-10 w-10 rounded-full object-cover mr-2 bg-white" />
              <h3 className="font-bold text-lg">CertAi</h3>
            </div>
            <p className="text-neutral-300 mb-4">Simplifying Certificates & Citizen Services — Apply, Track, Receive, All in One Place</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white hover:text-accent"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-accent"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-accent"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/apply" className="text-neutral-300 hover:text-white transition">Apply for Certificate</Link></li>
              <li><Link href="/track" className="text-neutral-300 hover:text-white transition">Track Application</Link></li>
              <li><Link href="/certificates" className="text-neutral-300 hover:text-white transition">Download Certificate</Link></li>
              <li><a href="#faq" className="text-neutral-300 hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Certificate Types</h3>
            <ul className="space-y-2">
              <li><Link href="/apply?type=caste" className="text-neutral-300 hover:text-white transition">Caste Certificate</Link></li>
              <li><Link href="/apply?type=income" className="text-neutral-300 hover:text-white transition">Income Certificate</Link></li>
              <li><Link href="/apply?type=residence" className="text-neutral-300 hover:text-white transition">Residence Certificate</Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Birth Certificate</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Domicile Certificate</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-accent"></i>
                <span className="text-neutral-300">Department of Social Welfare, Government of India, New Delhi - 110001</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-accent"></i>
                <span className="text-neutral-300">Toll-Free: 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-accent"></i>
                <span className="text-neutral-300">support@ecertificate.gov.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-neutral-700 text-center text-neutral-400 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Government of India. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Accessibility</a>
            <a href="#" className="hover:text-white transition">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content pt-10 pb-6 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-7 w-7" /> BiblioDrop
          </Link>
          <p className="text-sm text-base-content/70">
            Your trusted online book delivery marketplace connecting readers with local libraries.
          </p>
        </div>

        <div>
          <span className="footer-title font-semibold text-base">Quick Links</span>
          <div className="flex flex-col gap-2 mt-2 text-sm">
            <Link to="/" className="link link-hover">Home</Link>
            <Link to="/books" className="link link-hover">Browse Books</Link>
            <Link to="/about" className="link link-hover">About Us</Link>
            <Link to="/privacy" className="link link-hover">Privacy Policy</Link>
          </div>
        </div>

        <div>
          <span className="footer-title font-semibold text-base">Follow Us</span>
          <div className="flex gap-4 mt-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="btn btn-ghost btn-circle btn-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

     
        <div>
          <span className="footer-title font-semibold text-base">Newsletter</span>
          <p className="text-sm text-base-content/70 mt-2 mb-3">Subscribe to receive book updates & special offers.</p>
          <div className="join w-full">
            <input className="input input-bordered input-sm join-item w-full" placeholder="Enter your email" />
            <button className="btn btn-primary btn-sm join-item">Subscribe</button>
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-base-content/50 mt-10 border-t border-base-300 pt-4">
        © {new Date().getFullYear()} BiblioDrop. All rights reserved.
      </div>
    </footer>
  );
}
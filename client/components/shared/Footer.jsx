import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() 
{
    return (
        <footer className="px-4 py-6 border-t border-gray-200">
            <div className="container flex flex-col items-center justify-between mx-auto text-sm text-gray-600 sm:flex-row">
                <div>
                © {new Date().getFullYear()} Your Company. All rights reserved.
                </div>

                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <Link
                        href="/complaints"
                        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                    >
                        <MessageCircle size={16} />
                        <span>Complaints</span>
                    </Link>
                    <Link href="#" className="hover:text-gray-900">Privacy</Link>
                    <Link href="#" className="hover:text-gray-900">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
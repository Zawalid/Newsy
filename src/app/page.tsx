import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Newsy Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-gray-900">Newsy</span>
          </div>
          <nav className="space-x-6">
            <Link href="/features" className="text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            {session ? (
              <Link href="/app/inbox" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto flex flex-col md:flex-row items-center px-6 py-24">
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold mb-6">Your Newsletters, Simplified</h1>
              <p className="text-lg mb-8">
                Declutter your inbox and effortlessly manage all your newsletters in one beautiful
                app. Enjoy a seamless reading experience with smart organization and powerful
                integrations.
              </p>
              {session ? (
                <Link
                  href="/app/inbox"
                  className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100"
                >
                  Get Started
                </Link>
              )}
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <Image
                src="/hero-image.png"
                alt="Newsy app showcase"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Smart Management</h3>
                <p className="text-gray-700">
                  Automatically extract and organize newsletters from your inbox.
                </p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">In-App Reading</h3>
                <p className="text-gray-700">
                  Enjoy a distraction-free reading experience with a clean design.
                </p>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Seamless Integrations</h3>
                <p className="text-gray-700">
                  Connect with your favorite tools like Pocket, Notion, and Obsidian.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <div className="container mx-auto text-center px-6">
            <h2 className="text-4xl font-bold mb-8">Ready to take control of your newsletters?</h2>
            <p className="text-lg mb-12">
              Experience the future of newsletter management and transform your inbox today.
            </p>
            {session ? (
              <Link
                href="/app/inbox"
                className="px-10 py-4 bg-white text-indigo-600 rounded-full hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-10 py-4 bg-white text-indigo-600 rounded-full hover:bg-gray-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 shadow-inner">
        <div className="container mx-auto text-center text-gray-700">
          © {new Date().getFullYear()} Newsy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

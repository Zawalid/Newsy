import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Newsy Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-gray-900">Newsy</span>
          </div>
          <nav className="space-x-6">
            <Link
              href="/features"
              className="text-gray-700 hover:text-gray-900"
            >
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
            {session ? (
              <Link
                href="/app/inbox"
                className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="grow">
        <section className="bg-linear-to-r from-blue-500 to-indigo-600 text-white">
          <div className="container mx-auto flex flex-col items-center px-6 py-24 md:flex-row">
            <div className="md:w-1/2">
              <h1 className="mb-6 text-5xl font-bold">
                Your Newsletters, Simplified
              </h1>
              <p className="mb-8 text-lg">
                Declutter your inbox and effortlessly manage all your
                newsletters in one beautiful app. Enjoy a seamless reading
                experience with smart organization and powerful integrations.
              </p>
              {session ? (
                <Link
                  href="/app/inbox"
                  className="rounded-full bg-white px-8 py-4 text-blue-600 hover:bg-gray-100"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="rounded-full bg-white px-8 py-4 text-blue-600 hover:bg-gray-100"
                >
                  Get Started
                </Link>
              )}
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
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
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-center text-4xl font-bold">Features</h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="rounded-lg bg-white p-8 shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">
                  Smart Management
                </h3>
                <p className="text-gray-700">
                  Automatically extract and organize newsletters from your
                  inbox.
                </p>
              </div>
              <div className="rounded-lg bg-white p-8 shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">In-App Reading</h3>
                <p className="text-gray-700">
                  Enjoy a distraction-free reading experience with a clean
                  design.
                </p>
              </div>
              <div className="rounded-lg bg-white p-8 shadow-md">
                <h3 className="mb-4 text-2xl font-semibold">
                  Seamless Integrations
                </h3>
                <p className="text-gray-700">
                  Connect with your favorite tools like Pocket, Notion, and
                  Obsidian.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-linear-to-r from-indigo-600 to-blue-500 py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-8 text-4xl font-bold">
              Ready to take control of your newsletters?
            </h2>
            <p className="mb-12 text-lg">
              Experience the future of newsletter management and transform your
              inbox today.
            </p>
            {session ? (
              <Link
                href="/app/inbox"
                className="rounded-full bg-white px-10 py-4 text-indigo-600 hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/signin"
                className="rounded-full bg-white px-10 py-4 text-indigo-600 hover:bg-gray-100"
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

import React, { useContext } from 'react';
import LocationContext from '../context/locationContext';
import Buttons from '../components/buttons';

function AboutPage() {
  const { profileInfo } = useContext(LocationContext);

  return (
    <div className="flex h-screen bg-base-200 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f]/35 p-6 hidden lg:flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center">
            <img
              src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
              className="w-20 h-20 rounded-full border-2 border-green-500"
              alt="profile"
            />
            <h2 className="mt-4 font-semibold">{profileInfo?.name || 'Loading.....'}</h2>
          </div>

          <nav className="mt-10 space-y-4">
            <Buttons/>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen flex flex-col bg-base-200 text-white">
          <main className="flex-1 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8 text-green-400">About Us</h1>

              <div className="bg-base-100 shadow-2xl border border-green-600 rounded-lg p-8">
                <p className="text-lg leading-relaxed mb-6 text-gray-300">
                  <span className="text-green-400 font-semibold">Foodie Fusion</span> is more than just a recipe platform — it’s a personal,
                  modern take on collecting and organizing the meals you love.
                  Whether you’re experimenting in the kitchen or recreating family favorites,
                  our goal is to give food lovers a clean and simple space to store and explore recipes without the distractions.
                </p>

                {/* WHY WE BUILT THIS */}
                <div className="mt-10 bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-green-400">Why We Built This</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We created <span className="text-green-400 font-semibold">Foodie Fusion</span> because we were tired of losing track of good recipes —
                    between bookmarks, screenshots, and scribbled notes. We wanted a space where we could:
                    <br /><br />
                    ✦ Save and categorize recipes that matter to us.<br />
                    ✦ Share our own creations and cooking experiences.<br />
                    ✦ Build our very own digital cookbook — one we can actually find things in.
                    <br /><br />
                    If you love to cook, create, or just collect, you’re home.
                  </p>
                </div>

                {/* TEAM / MISSION / VISION CARDS */}
                <div className="grid md:grid-cols-3 gap-8 text-center mt-10">
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                    <h3 className="font-bold text-lg mb-2 text-green-400">Our Team</h3>
                    <p className="text-sm text-gray-400">A bunch of food-obsessed creators, designers, and coders who love great UX & great snacks.</p>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                    <h3 className="font-bold text-lg mb-2 text-green-400">Our Mission</h3>
                    <p className="text-sm text-gray-400">To make discovering, saving, and sharing recipes simple, social, and satisfying.</p>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                    <h3 className="font-bold text-lg mb-2 text-green-400">Our Vision</h3>
                    <p className="text-sm text-gray-400">Be the go-to platform for food inspiration, collaboration, and digital cookbooks.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
            <nav>
              <h6 className="footer-title">Services</h6>
              <a className="link link-hover">Recipe Storage</a>
              <a className="link link-hover">Bookmarking</a>
              <a className="link link-hover">Meal Planning</a>
              <a className="link link-hover">Community Sharing</a>
            </nav>
            <nav>
              <h6 className="footer-title">Company</h6>
              <a className="link link-hover">About us</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Jobs</a>
              <a className="link link-hover">Press kit</a>
            </nav>
            <nav>
              <h6 className="footer-title">Social</h6>
              <div className="grid grid-flow-col gap-4 text-white">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775A4.932 
                      4.932 0 0023.337 3.1a9.864 9.864 0 01-3.127 
                      1.195 4.916 4.916 0 00-8.38 4.482A13.94 
                      13.94 0 011.671 3.149 4.916 4.916 0 003.195 
                      9.723a4.9 4.9 0 01-2.229-.616c-.054 
                      2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 
                      4.928 4.928 0 004.6 3.417 9.867 9.867 0 01-6.102 
                      2.104c-.396 0-.787-.023-1.175-.069A13.945 
                      13.945 0 007.548 21c9.142 0 14.307-7.721 
                      13.995-14.646A10.025 10.025 0 0024 4.557z" />
                  </svg>
                </a>

                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 
                      0-3.897.266-4.356 2.62-4.385 
                      8.816.029 6.185.484 8.549 4.385 8.816 
                      3.6.245 11.626.246 15.23 0 3.897-.266 
                      4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 
                      15.999v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 
                      1.115-1.333h2.885v-5h-3.808c-3.596 
                      0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </nav>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AboutPage;

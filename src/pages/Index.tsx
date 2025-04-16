
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Experience AI like never before with <span className="text-brand-purple">ChatBPT</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                  Elevate your conversations with our enhanced ChatGPT experience. 
                  More powerful, more intuitive, and built for the way you work.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-xl border border-purple-100">
                  <div className="flex items-center mb-4">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="user-message">How can I learn JavaScript quickly?</div>
                    <div className="ai-message">
                      <p className="mb-2">To learn JavaScript quickly, I recommend these steps:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Start with the fundamentals (variables, data types, functions)</li>
                        <li>Practice with small projects</li>
                        <li>Use interactive platforms like freeCodeCamp or Codecademy</li>
                        <li>Build a simple web app to apply your knowledge</li>
                      </ol>
                      <p className="mt-2">Would you like more specific resources?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Experience the difference</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Free & Paid Tiers</h3>
                <p className="text-gray-600">
                  Choose the plan that works for you. Get started for free and upgrade for premium features.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Chat History</h3>
                <p className="text-gray-600">
                  Never lose an important conversation. Access your chat history anytime.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Enhanced Experience</h3>
                <p className="text-gray-600">
                  Enjoy a beautiful, intuitive interface designed for productive conversations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-brand-purple">ChatBPT</span>
              <p className="text-sm text-gray-500 mt-1">© 2025 ChatBPT. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Shield, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] left-[30%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Navbar Placeholder (Optional) */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TP</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Test Platform</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center mt-10 md:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 text-sm mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          New Tests Available Now
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl">
          Master Your Skills with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Intelligent Assessments
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          The comprehensive platform for students to take tests, track progress,
          and achieve academic excellence. Administered by experts, designed for success.
        </p>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          {/* Login Card */}
          <Link
            href="/login"
            className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-cyan-500/50 hover:to-blue-600/50 transition-all duration-500 shadow-xl hover:shadow-cyan-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative h-full bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center border border-slate-800 group-hover:border-transparent transition-colors">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-300">
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Login</h3>
              <p className="text-slate-400 text-sm mb-6">Access your dashboard</p>
              <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-4 transition-all">
                Sign In <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Sign Up Card */}
          <Link
            href="/register"
            className="group relative p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-purple-500/50 hover:to-pink-600/50 transition-all duration-500 shadow-xl hover:shadow-purple-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            <div className="relative h-full bg-slate-950 rounded-xl p-8 flex flex-col items-center justify-center border border-slate-800 group-hover:border-transparent transition-colors">
              <div className="h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-300">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-slate-400 text-sm mb-6">Create a new account</p>
              <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all">
                Register Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Features/Footer Strip */}
      <div className="relative z-10 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center md:justify-start text-white font-semibold">
              <Shield className="w-5 h-5 text-green-400" />
              Secure & Reliable
            </div>
            <p className="text-slate-500 text-sm">Enterprise-grade security for your data and assessments.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center md:justify-start text-white font-semibold">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              Instant Results
            </div>
            <p className="text-slate-500 text-sm">Get real-time analytics and performance insights immediately.</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-center md:justify-start text-white font-semibold">
              <Users className="w-5 h-5 text-purple-400" />
              Role-Based Access
            </div>
            <p className="text-slate-500 text-sm">Dedicated portals for students and administrators.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

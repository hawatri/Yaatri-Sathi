import {
  Shield,
  MapPin,
  Bell,
  Users,
  Globe,
  AlertTriangle,
  FileText,
  Route,
  Database,
  Lock,
  BarChart3,
  WifiOff,
  Languages,
  Activity
} from "lucide-react";
export default function FeaturesPage() {
  const categories = [
    {
      title: "🚨 Core Features",
      features: [
        { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Tourist Registration & KYC", desc: "Secure onboarding with ID verification." },
        { icon: <FileText className="w-8 h-8 text-green-500" />, title: "Journey Management", desc: "Plan trips with start/end dates & family details." },
        { icon: <MapPin className="w-8 h-8 text-pink-500" />, title: "Real-Time Tracking", desc: "GPS-based tourist movement tracking." },
        { icon: <AlertTriangle className="w-8 h-8 text-red-500" />, title: "Safe Zone Alerts", desc: "Green (safe), Yellow (crowded), Red (danger)." },
        { icon: <Bell className="w-8 h-8 text-orange-500" />, title: "Emergency SOS", desc: "One-tap alert to police, hospitals & contacts." }
      ]
    },
    {
      title: "🛡️ Safety Features",
      features: [
        { icon: <Route className="w-8 h-8 text-indigo-500" />, title: "Geo-Fencing", desc: "Alert tourists when entering risky areas." },
        { icon: <Activity className="w-8 h-8 text-purple-500" />, title: "Crowd Detection", desc: "AI/ML detects crowded unsafe zones." },
        { icon: <Users className="w-8 h-8 text-teal-500" />, title: "Lost Tourist Assistance", desc: "Guides tourists back to safe points." },
        { icon: <Bell className="w-8 h-8 text-yellow-500" />, title: "Incident Reporting", desc: "Tourists can report theft, medical issues, etc." }
      ]
    },
    {
      title: "📍 Tourist Experience",
      features: [
        { icon: <MapPin className="w-8 h-8 text-green-400" />, title: "Interactive Maps", desc: "View safe zones & routes in real-time." },
        { icon: <Route className="w-8 h-8 text-blue-400" />, title: "Safe Route Suggestions", desc: "Avoid risky shortcuts with safe navigation." },
        { icon: <Globe className="w-8 h-8 text-purple-400" />, title: "Verified Local Services", desc: "Trusted hotels, guides & transport info." },
        { icon: <Languages className="w-8 h-8 text-pink-400" />, title: "Multi-Language Support", desc: "Tourists can access in their own language." },
        { icon: <WifiOff className="w-8 h-8 text-gray-400" />, title: "Offline Mode", desc: "Emergency info works without internet." }
      ]
    },
    {
      title: "🔐 Security & Trust",
      features: [
        { icon: <Lock className="w-8 h-8 text-red-400" />, title: "End-to-End Privacy", desc: "Tourist data stored securely." },
        { icon: <Shield className="w-8 h-8 text-blue-400" />, title: "Role-Based Access", desc: "Separate views for tourist, admin & police." },
        { icon: <Database className="w-8 h-8 text-green-400" />, title: "Tamper-Proof Records", desc: "Blockchain (optional) for secure verification." },
        { icon: <Bell className="w-8 h-8 text-yellow-400" />, title: "2FA Security", desc: "Two-factor authentication for logins." }
      ]
    },
    {
      title: "📊 Analytics & Admin",
      features: [
        { icon: <BarChart3 className="w-8 h-8 text-indigo-400" />, title: "Tourist Flow Dashboard", desc: "Track active tourists & journeys." },
        { icon: <MapPin className="w-8 h-8 text-pink-400" />, title: "Heatmaps", desc: "Identify tourist hotspots & danger zones." },
        { icon: <FileText className="w-8 h-8 text-green-400" />, title: "Incident Logs", desc: "Track past emergencies for insights." },
        { icon: <Users className="w-8 h-8 text-teal-400" />, title: "Resource Suggestions", desc: "AI suggests where to deploy forces." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">✨ Project Features</h1>

        {categories.map((cat, i) => (
          <section key={i} className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 border-b border-gray-700 pb-2">
              {cat.title}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cat.features.map((f, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition"
                >
                  <div className="flex justify-center mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{f.title}</h3>
                  <p className="text-gray-300 text-center">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

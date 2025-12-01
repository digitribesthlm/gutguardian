'use client';

import { ShieldCheck, Ban, Activity, Layers, Stethoscope } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Gut Health Knowledge Base</h1>
        <p className="text-slate-500 text-sm">
          Understanding the link between diet and autoimmune stomach issues.
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-3xl border border-teal-100 shadow-sm">
        <div className="flex items-start mb-4">
          <Activity className="w-6 h-6 text-teal-600 mr-3 mt-1" />
          <h2 className="text-lg font-bold text-teal-900">The Link Between Diet and Inflammation</h2>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed mb-4">
          For many autoimmune diseases, especially those affecting the digestive system like autoimmune
          gastritis or inflammatory bowel disease (IBD), diet plays a significant role. The underlying
          issue is often chronic inflammation.
        </p>
        <p className="text-slate-700 text-sm leading-relaxed">
          <strong>"Leaky Gut":</strong> Many experts believe increased intestinal permeability is a common
          factor. This is where the lining of the intestine becomes damaged, allowing particles to pass
          into the bloodstream and trigger an immune response.
        </p>
      </div>

      {/* AIP Phases */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-slate-800">
          <Layers className="w-5 h-5" />
          <h3 className="font-bold text-lg">The Autoimmune Protocol (AIP) Phases</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-rose-500">
            <div className="flex items-center mb-3">
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Phase 1
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Elimination</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The most restrictive phase. You remove foods that are common triggers for inflammation
              (grains, legumes, dairy, nightshades, coffee, alcohol, processed foods) to calm the immune
              system and heal the gut lining.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-amber-500">
            <div className="flex items-center mb-3">
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Phase 2
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Reintroduction</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              After symptoms improve, foods are slowly added back one at a time. This process helps
              identify specific personal triggers that cause a negative reaction.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-teal-500">
            <div className="flex items-center mb-3">
              <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Phase 3
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Maintenance</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              A long-term, personalized diet created based on what was learned. It avoids specific
              triggers while being as varied and nutritious as possible.
            </p>
          </div>
        </div>
      </div>

      {/* General Guidelines */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-4 text-emerald-600">
            <ShieldCheck className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Anti-Inflammatory Principles</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500">•</span>Wide variety of vegetables (except
              nightshades initially)
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500">•</span>Lean, minimally processed meats & fish
              (grass-fed/wild-caught)
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500">•</span>Healthy fats: Olive oil, avocado oil,
              coconut oil
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500">•</span>Fermented foods like sauerkraut to support
              gut health
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center mb-4 text-rose-600">
            <Ban className="w-5 h-5 mr-2" />
            <h3 className="font-bold">Common Culprits</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start">
              <span className="mr-2 text-rose-500">•</span>
              <strong>Processed Foods:</strong> High in additives and sugar.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-rose-500">•</span>
              <strong>Gluten & Dairy:</strong> Common triggers that increase permeability.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-rose-500">•</span>
              <strong>Nightshades:</strong> Tomatoes, potatoes, peppers, eggplants.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-rose-500">•</span>
              <strong>Alcohol & NSAIDs:</strong> Can worsen gut lining damage.
            </li>
          </ul>
        </div>
      </div>

      {/* Important Considerations */}
      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <div className="flex items-center mb-3 text-indigo-800">
          <Stethoscope className="w-5 h-5 mr-2" />
          <h3 className="font-bold">Important Considerations</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-indigo-900/80">
          <div>
            <strong className="block text-indigo-900 mb-1">Individual Triggers</strong>
            <p>
              What causes a reaction in one person may not in another. The elimination diet is a tool to
              discover <em>your</em> personal triggers.
            </p>
          </div>
          <div>
            <strong className="block text-indigo-900 mb-1">Nutrient Deficiencies</strong>
            <p>
              Autoimmune stomach conditions can lead to problems absorbing Vitamin B12 and iron. Ensure
              your diet is rich in these or consult a doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


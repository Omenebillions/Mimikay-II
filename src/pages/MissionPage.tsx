import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

export const MissionPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-[#f9fafb] min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-8 space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#008037] font-bold">
            Guiding Charter
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Our Mission Statement
          </h1>
          <p className="text-gray-600 text-base max-w-2xl">
            The guiding blueprint for our advocacy, citizen mobilization, and community development actions.
          </p>
        </div>

        {/* Primary Mission Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gray-200/80 shadow-xs space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#008037] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Mimikay Political Movement Charter
              </h2>
              <p className="text-xs text-gray-500">
                Adopted by the Leadership &amp; Grassroots Executive
              </p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p className="font-normal">
              The mission of <strong className="text-gray-900 font-semibold">Mimikay Political Movement</strong> is to promote inclusive leadership, responsible governance, and sustainable development through active citizen participation, political education, and advocacy for policies that improve the welfare of the people.
            </p>

            <p className="font-normal">
              We are committed to fostering unity across communities, empowering youths and women, upholding democratic values, and supporting visionary leadership that prioritizes transparency, accountability, and people-centered development.
            </p>

            <p className="font-normal">
              <strong className="text-gray-900 font-semibold">Mimikay Political Movement</strong> exists to mobilize, educate, and inspire citizens to contribute meaningfully to the political process and to build a society where justice, equity, and opportunity are accessible to all.
            </p>
          </div>

          {/* Highlighted Closing Statement */}
          <div className="mt-10 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 border border-emerald-200 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-[#008037] mx-auto opacity-80" />
            <blockquote className="text-2xl sm:text-3xl font-bold text-[#008037] tracking-tight">
              &ldquo;Together, we move forward for a better tomorrow.&rdquo;
            </blockquote>
            <p className="text-xs uppercase tracking-widest text-emerald-800 font-semibold">
              Mimikay Political Movement Moto &amp; Resolution
            </p>
          </div>
        </div>

        {/* Strategic Pillars Recap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#008037] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inclusive Leadership</span>
            </div>
            <p className="text-sm text-gray-600">
              Ensuring all segments of society, especially marginalized voices, participate in governance choices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#008037] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Responsible Governance</span>
            </div>
            <p className="text-sm text-gray-600">
              Upholding democratic values, fiscal accountability, and stewardship of public resources.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#008037] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sustainable Development</span>
            </div>
            <p className="text-sm text-gray-600">
              Targeting durable roads, health clinics, youth vocational hubs, and clean community infrastructure.
            </p>
          </div>
        </div>

        {/* Navigation bottom row */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => onNavigate('/about')}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Back to About Us
          </button>
          <button
            onClick={() => onNavigate('/events')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008037] hover:underline"
          >
            <span>Explore Movement Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

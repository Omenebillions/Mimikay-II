import React from 'react';
import { SiteSettings } from '../types';
import { Users, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<Props> = ({ settings, onNavigate }) => {
  return (
    <div className="bg-[#f9fafb] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumbs / Title */}
        <div className="border-b border-gray-200 pb-8 space-y-2">
          <div className="text-xs uppercase tracking-widest text-[#008037] font-bold">
            Leadership &amp; Identity
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            About Mimikay Political Movement
          </h1>
          <p className="text-gray-600 text-base max-w-3xl">
            Learn about our origins, our grassroots mandate, and the leadership driving civic development across Delta State.
          </p>
        </div>

        {/* Two-Column About Layout */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-12 items-center">
            {/* Column 1: Story & Mission Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#e8f5e9] text-[#008037] text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Grassroots Coalition</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-snug">
                  Transforming Communities Through Responsible Citizenship
                </h2>
              </div>

              <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-5 font-normal">
                <p>
                  <strong className="text-gray-900 font-semibold">Mimikay Political Movement (MPM)</strong> is a coalition of dedicated individuals united by a single vision: the total transformation of our communities through active and responsible citizenship.
                </p>
                <p>
                  Powered by the <strong className="text-gray-900 font-semibold">Voice for Delta Grassroot Development Initiative</strong>, we believe that true leadership starts from the grassroots. We are a movement of fathers, mothers, youths, and professionals advocating for policies that prioritize the common man.
                </p>
                <p className="text-base text-gray-600">
                  Across Delta Central and beyond, MPM builds constructive bridges between everyday citizens and elected representatives. By fostering civic education, peaceful advocacy, and structured community dialogues, we ensure governance reflects the genuine aspirations of the people.
                </p>
              </div>

              {/* Guiding Principles Checklist */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#008037] flex-shrink-0" />
                  <span>Citizen-First Representation</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#008037] flex-shrink-0" />
                  <span>Transparent Public Advocacy</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#008037] flex-shrink-0" />
                  <span>Youth &amp; Women Empowerment</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-800">
                  <CheckCircle2 className="w-4 h-4 text-[#008037] flex-shrink-0" />
                  <span>Grassroots Community Synergy</span>
                </div>
              </div>
            </div>

            {/* Column 2: Convener Profile with Original Image */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-[#f4f7f6] p-4 rounded-2xl border border-gray-200/80 shadow-sm text-center space-y-4">
                <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-gray-200 shadow-inner">
                  <img
                    src={settings.convenerImageUrl}
                    alt={settings.convenerName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
                      Leadership
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#008037]">
                    {settings.convenerName}
                  </h3>
                  <p className="text-sm italic text-gray-600 font-medium mt-0.5">
                    {settings.convenerTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 px-2 leading-normal">
                    Leading the coalition with passion, integrity, and unwavering dedication to the progress of Delta State.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Organizational Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ward Assemblies</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Organized consultations at polling unit and ward levels to collect feedback on infrastructure, healthcare, and educational priorities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-gray-900">Strategic Endorsement</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Evaluating elected officials strictly by performance, developmental delivery, accessibility, and fidelity to their constituents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008037] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-gray-900">Civic Education</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Equipping citizens with voter knowledge, rights awareness, and constructive tools for peaceful and productive political advocacy.
            </p>
          </div>
        </div>

        {/* CTA to Mission & Events */}
        <div className="bg-[#008037] rounded-3xl text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">Read Our Official Mission Statement</h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Discover how our long-term objectives align with sustainable development across Nigeria.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('/mission')}
              className="px-6 py-3 bg-white text-[#008037] hover:bg-emerald-50 font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Our Mission
            </button>
            <button
              onClick={() => onNavigate('/events')}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              View Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { VIDEO_TRANSCRIPT } from "@/lib/courseData";
import { recordActivityCompleted } from "@/lib/supabase";
import {
  Play,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

interface CourseMediaViewerProps {
  userId: string;
}

export function CourseMediaViewer({ userId }: CourseMediaViewerProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showPdfEmbed, setShowPdfEmbed] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const handleVideoEnded = () => {
    setVideoWatched(true);
    recordActivityCompleted(userId, "MWSHS-W3-VIDEO");
  };

  return (
    <div className="space-y-8">
      {/* 02: Read Two-Page Note */}
      <div id="act-02" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Activity 02 • Core Reading
              </span>
              <span className="text-xs text-slate-500 font-medium">85,191 Bytes • 2 Pages</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              02 Read: Saving Safely (Two-Page PDF Note)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Covers safe custodians, paying yourself first, avoiding unverified high-yield schemes, and keeping credentials secret.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowPdfEmbed(!showPdfEmbed);
                recordActivityCompleted(userId, "MWSHS-W3-PDF");
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{showPdfEmbed ? "Hide PDF Viewer" : "Read In Browser"}</span>
            </button>

            <a
              href="/course/Saving_Safely_Two_Page_Note.pdf"
              download
              onClick={() => recordActivityCompleted(userId, "MWSHS-W3-PDF")}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF (85 KB)</span>
            </a>
          </div>
        </div>

        {showPdfEmbed && (
          <div className="p-4 sm:p-6 bg-slate-900">
            <div className="w-full h-[600px] rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              <iframe
                src="/course/Saving_Safely_Two_Page_Note.pdf"
                className="w-full h-full"
                title="Saving Safely Two Page Note"
              />
            </div>
          </div>
        )}
      </div>

      {/* 03: Watch Video with Captions */}
      <div id="act-03" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600 text-white">
                Activity 03 • Microlearning Video
              </span>
              <span className="text-xs text-slate-500 font-medium">117 Seconds • 593 KB • Captioned</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              03 Watch: Spot the Fake Message
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Educational microlearning video demonstrating the 3 warning sign patterns: account impersonation, wrong-transfer claims, and upfront prize fees.
            </p>
          </div>

          {videoWatched && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Video Completed</span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {/* HTML5 Video Player */}
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
            <video
              controls
              preload="metadata"
              onEnded={handleVideoEnded}
              className="w-full aspect-video"
            >
              <source src="/course/Spot_The_Fake_Message.mp4" type="video/mp4" />
              <track
                default
                kind="subtitles"
                src="/course/Spot_The_Fake_Message.en.vtt"
                srcLang="en"
                label="English Subtitles"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Transcript Toggle (Activity 03b) */}
          <div id="act-03b" className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowTranscript(!showTranscript);
                recordActivityCompleted(userId, "MWSHS-W3-TRANSCRIPT");
              }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition text-left text-xs sm:text-sm font-semibold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Activity 03b: Read Full Video Transcript &amp; Lesson Notes</span>
              </div>
              {showTranscript ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showTranscript && (
              <div className="mt-3 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans space-y-3 whitespace-pre-line animate-fadeIn">
                {VIDEO_TRANSCRIPT}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


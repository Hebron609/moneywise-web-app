"use client";

import { useState } from "react";
import { getForumPosts, addForumPost, addForumReply, StoredForumPost } from "@/lib/supabase";
import { recordActivityCompleted } from "@/lib/supabase";
import {
  MessageSquare,
  Send,
  Plus,
  CornerDownRight,
  Pin,
  ShieldCheck,
  User,
  CheckCircle2,
} from "lucide-react";

interface CourseForumProps {
  userId: string;
  userName: string;
  userRole: string;
}

export function CourseForum({ userId, userName, userRole }: CourseForumProps) {
  const [posts, setPosts] = useState<StoredForumPost[]>(getForumPosts());
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newContent.trim()) return;

    const created = addForumPost({
      authorName: userName,
      authorRole: userRole,
      topic: newTopic.trim(),
      content: newContent.trim(),
    });

    setPosts([created, ...posts]);
    setNewTopic("");
    setNewContent("");
    setShowNewTopicModal(false);
    recordActivityCompleted(userId, "MWSHS-W3-FORUM");
  };

  const handleSendReply = (postId: string) => {
    const text = replyText[postId]?.trim();
    if (!text) return;

    addForumReply(postId, {
      authorName: userName,
      authorRole: userRole,
      content: text,
    });

    setPosts(getForumPosts());
    setReplyText((prev) => ({ ...prev, [postId]: "" }));
    setActiveReplyId(null);
    recordActivityCompleted(userId, "MWSHS-W3-FORUM");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
              Activity 05 • Discussion Forum
            </span>
            <span className="text-xs text-slate-500 font-medium">Collaborative Sharing</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Discuss: Pause Before You Pay
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Share one warning sign and safe response from your analysis. Reply to a classmate with an independent verification method.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewTopicModal(!showNewTopicModal)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Topic</span>
        </button>
      </div>

      {/* New Topic Form */}
      {showNewTopicModal && (
        <form onSubmit={handleCreateTopic} className="p-5 bg-indigo-50/50 border-b border-indigo-100 space-y-3">
          <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Start a New Forum Discussion
          </h4>
          <div>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Topic Subject (e.g., My Safe Response to Wrong-Transfer Scams)"
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your explanation (2–3 sentences describing the warning sign and what safe step you take)..."
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewTopicModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
            >
              Post Topic
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="p-5 sm:p-6 space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`border rounded-2xl p-4 sm:p-5 ${
              post.isPinned ? "bg-amber-50/30 border-amber-200" : "bg-white border-slate-200"
            }`}
          >
            {/* Post Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {post.authorName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        post.authorRole === "LECTURER" || post.authorRole === "ADMIN"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {post.authorRole}
                    </span>
                    {post.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{post.date}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">
              {post.topic}
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
              {post.content}
            </p>

            {/* Replies List */}
            {post.replies && post.replies.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100 pl-4 sm:pl-6 border-l-2 border-l-indigo-200 my-3">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{reply.authorName}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {reply.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{reply.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            {activeReplyId === post.id ? (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                <textarea
                  rows={2}
                  value={replyText[post.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  placeholder="Write a constructive reply with an independent checking step..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendReply(post.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveReplyId(post.id)}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Reply to this discussion</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


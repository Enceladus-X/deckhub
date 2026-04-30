"use client";

import { FormEvent, useState } from "react";
import { MessageSquare, Send, ThumbsUp } from "lucide-react";
import type { DeckComment } from "@/lib/deck-data";

type CommentThreadProps = {
  comments: DeckComment[];
};

export function CommentThread({ comments }: CommentThreadProps) {
  const [items, setItems] = useState(comments);
  const [body, setBody] = useState("");

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = body.trim();

    if (!trimmed) {
      return;
    }

    setItems((current) => [
      {
        id: `local-${Date.now()}`,
        author: "guest",
        body: trimmed,
        createdAt: "방금",
        helpfulCount: 0,
      },
      ...current,
    ]);
    setBody("");
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold leading-7">댓글</h2>
          <p className="text-sm text-zinc-500">{items.length}개의 의견</p>
        </div>
        <MessageSquare size={20} className="text-zinc-500" aria-hidden="true" />
      </div>

      <form className="mt-5 flex flex-col gap-3" onSubmit={submitComment}>
        <textarea
          className="min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
          maxLength={600}
          onChange={(event) => setBody(event.target.value)}
          placeholder="덱 품질, 시험 범위, 오탈자 의견을 남겨주세요"
          value={body}
        />
        <div className="flex justify-end">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            type="submit"
          >
            <Send size={16} aria-hidden="true" />
            등록
          </button>
        </div>
      </form>

      <div className="mt-5 divide-y divide-zinc-100">
        {items.map((comment) => (
          <article className="py-4 first:pt-0 last:pb-0" key={comment.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {comment.author}
                </p>
                <p className="text-xs text-zinc-500">{comment.createdAt}</p>
              </div>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-teal-700"
                type="button"
              >
                <ThumbsUp size={14} aria-hidden="true" />
                {comment.helpfulCount}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              {comment.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

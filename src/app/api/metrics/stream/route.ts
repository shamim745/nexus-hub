import { NextResponse, type NextRequest } from "next/server";
import { nextLiveTick } from "@/lib/mock/dashboardData";
import type { LiveTick } from "@/features/analytics/types/metrics.types";
import { decodeSession, SESSION_COOKIE } from "@/lib/mock/session";

export const dynamic = "force-dynamic";

const TICK_MS = 2_500;

export async function GET(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;
  let previous: LiveTick | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const push = () => {
        previous = nextLiveTick(previous);
        controller.enqueue(encoder.encode(`event: tick\ndata: ${JSON.stringify(previous)}\n\n`));
      };

      push();
      interval = setInterval(push, TICK_MS);

      const teardown = () => {
        if (interval) clearInterval(interval);
        interval = undefined;
        try {
          controller.close();
        } catch {
          // Stream already closed by the client.
        }
      };

      request.signal.addEventListener("abort", teardown, { once: true });
    },
    cancel() {
      if (interval) clearInterval(interval);
      interval = undefined;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

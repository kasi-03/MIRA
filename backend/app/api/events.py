import json
import time
from flask import Blueprint, Response, stream_with_context

events_bp = Blueprint("events", __name__, url_prefix="/api/events")

@events_bp.route("", methods=["GET"])
def event_stream():
    def generate():
        # Emit initial connected event
        yield f"event: connected\ndata: {json.dumps({'status': 'connected', 'service': 'mira-events'})}\n\n"
        # Heartbeat loop
        while True:
            time.sleep(15)
            yield f"event: heartbeat\ndata: {json.dumps({'timestamp': time.time()})}\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )

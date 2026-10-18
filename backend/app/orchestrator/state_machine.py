from typing import Set, Dict

VALID_TRANSITIONS: Dict[str, Set[str]] = {
    "pending_confirmation": {"confirmed", "cancelled"},
    "confirmed": {"validating", "executing", "awaiting_approval", "cancelled"},
    "validating": {"awaiting_approval", "approved", "executing", "failed"},
    "awaiting_approval": {"approved", "rejected", "cancelled", "failed"},
    "approved": {"executing", "cancelled"},
    "executing": {"verifying", "failed", "cancelled"},
    "verifying": {"completed", "failed"},
    # Terminal states
    "completed": set(),
    "failed": set(),
    "rejected": set(),
    "cancelled": set()
}

TERMINAL_STATES = {"completed", "failed", "rejected", "cancelled"}

class InvalidStateTransitionError(Exception):
    pass

def validate_state_transition(current_state: str, new_state: str) -> None:
    if current_state == new_state:
        return
    if current_state in TERMINAL_STATES:
        raise InvalidStateTransitionError(
            f"Cannot transition out of terminal state '{current_state}' to '{new_state}'"
        )
    allowed = VALID_TRANSITIONS.get(current_state, set())
    if new_state not in allowed:
        raise InvalidStateTransitionError(
            f"Invalid state transition from '{current_state}' to '{new_state}'. Allowed: {list(allowed)}"
        )

import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTCH_FULL_MS, NOTCH_HISTORY_MS, NOTCH_RETRACT_AT_MS, type NotchPhase } from './notch-phase';
import { pruneNotchHistory } from './prune-notch-history';
import type { NotchMessage } from '../../shared/types';

export interface NotchHistoryEntry extends NotchMessage {
	id: string;
}

const HOVER_LEAVE_DELAY_MS = 150;
/** Failsafe when Windows drops mouseleave under click-through (Plan 07 residual). */
export const HOVER_CEILING_MS = 8_000;
const EMPTY_HIDE_DELAY_MS = 350;
const COPY_FEEDBACK_MS = 1_500;
const PRUNE_INTERVAL_MS = 1_000;

let notchIdCounter = 0;

function nextNotchId(): string {
	return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${notchIdCounter++}`;
}

export interface UseNotchLifecycleReturn {
	history: NotchHistoryEntry[];
	newest: NotchHistoryEntry | null;
	phase: NotchPhase;
	hovering: boolean;
	reopening: boolean;
	replyOpen: boolean;
	replyingTo: string | null;
	copiedId: string | null;
	setHovering: (value: boolean) => void;
	openReply: (entry: NotchHistoryEntry) => void;
	closeReply: () => void;
	onNotchMessage: (message: NotchMessage) => void;
	copyText: (entry: NotchHistoryEntry) => void;
	scheduleHoverLeave: () => void;
	cancelHoverLeave: () => void;
	reopenFromHoverTarget: () => void;
}

export function useNotchLifecycle(options?: { onNotchHide?: () => void }): UseNotchLifecycleReturn {
	const [history, setHistory] = useState<NotchHistoryEntry[]>([]);
	const [phase, setPhase] = useState<NotchPhase>('retracted');
	const [hovering, setHovering] = useState(false);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const phaseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const leaveHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pointerInsideRef = useRef(false);
	const leaveSuppressedRef = useRef(false);
	const historyRef = useRef(history);
	historyRef.current = history;

	const newest = history[0] ?? null;
	const reopening = hovering;
	const replyOpen = replyingTo !== null;

	const cancelHoverLeave = useCallback(() => {
		pointerInsideRef.current = true;
		leaveSuppressedRef.current = false;
		if (leaveHoverTimer.current) {
			clearTimeout(leaveHoverTimer.current);
			leaveHoverTimer.current = null;
		}
	}, []);

	const clearHoveringSoon = useCallback(() => {
		if (leaveHoverTimer.current) {
			clearTimeout(leaveHoverTimer.current);
		}
		leaveHoverTimer.current = setTimeout(() => {
			setHovering(false);
			leaveHoverTimer.current = null;
		}, HOVER_LEAVE_DELAY_MS);
	}, []);

	const scheduleHoverLeave = useCallback(() => {
		pointerInsideRef.current = false;
		// Don't collapse while the reply field is open — remember the leave so
		// closeReply can re-arm once the reply ends.
		if (replyOpen) {
			leaveSuppressedRef.current = true;
			return;
		}
		leaveSuppressedRef.current = false;
		clearHoveringSoon();
	}, [replyOpen, clearHoveringSoon]);

	const reopenFromHoverTarget = useCallback(() => {
		if (history.length === 0) return;
		cancelHoverLeave();
		setHovering(true);
	}, [history.length, cancelHoverLeave]);

	const openReply = useCallback((entry: NotchHistoryEntry) => {
		setReplyingTo(entry.id);
	}, []);

	const closeReply = useCallback(() => {
		setReplyingTo(null);
		// Re-arm a leave that was suppressed while replyOpen was true.
		if (leaveSuppressedRef.current && !pointerInsideRef.current) {
			leaveSuppressedRef.current = false;
			clearHoveringSoon();
		} else {
			leaveSuppressedRef.current = false;
		}
	}, [clearHoveringSoon]);

	const copyText = useCallback((entry: NotchHistoryEntry) => {
		void navigator.clipboard.writeText(entry.text);
		setCopiedId(entry.id);
	}, []);

	const onNotchMessage = useCallback((message: NotchMessage) => {
		const entry: NotchHistoryEntry = {
			...message,
			id: nextNotchId(),
			receivedAt: message.receivedAt ?? new Date().toISOString(),
		};
		setHistory((current) => pruneNotchHistory([entry, ...current], Date.now(), NOTCH_HISTORY_MS));
		if (leaveHoverTimer.current) {
			clearTimeout(leaveHoverTimer.current);
			leaveHoverTimer.current = null;
		}
		leaveSuppressedRef.current = false;
		pointerInsideRef.current = false;
		setHovering(false);
		closeReply();
	}, [closeReply]);

	// Phase lifecycle: FULL → PEEK → RETRACTED for each new newest message.
	useEffect(() => {
		phaseTimers.current.forEach(clearTimeout);
		phaseTimers.current = [];

		if (!newest) {
			setPhase('retracted');
			return;
		}

		setPhase('full');
		const fullTimer = setTimeout(() => setPhase('peek'), NOTCH_FULL_MS);
		const retractTimer = setTimeout(() => setPhase('retracted'), NOTCH_RETRACT_AT_MS);
		phaseTimers.current = [fullTimer, retractTimer];

		return () => {
			phaseTimers.current.forEach(clearTimeout);
			phaseTimers.current = [];
		};
	}, [newest?.id]);

	// Prune history every second so old entries drop after 60 s.
	useEffect(() => {
		const pruneTimer = setInterval(() => {
			setHistory((current) => {
				const pruned = pruneNotchHistory(current, Date.now(), NOTCH_HISTORY_MS);
				return pruned.length === current.length ? current : pruned;
			});
		}, PRUNE_INTERVAL_MS);
		return () => clearInterval(pruneTimer);
	}, []);

	// Main-process push listeners that affect lifecycle state.
	useEffect(() => {
		const removeShow = window.electronAPI.onNotchShow(() => {
			cancelHoverLeave();
		});
		const removeHide = window.electronAPI.onNotchHide(() => {
			leaveSuppressedRef.current = false;
			pointerInsideRef.current = false;
			setHovering(false);
			closeReply();
			options?.onNotchHide?.();
		});
		const removeReopen = window.electronAPI.onNotchReopen(() => {
			if (historyRef.current.length > 0) {
				cancelHoverLeave();
				setHovering(true);
			}
		});
		return () => {
			removeShow();
			removeHide();
			removeReopen();
		};
	}, [cancelHoverLeave, closeReply, options?.onNotchHide]);

	// Keep the notch window interactive whenever the user needs to interact with it.
	useEffect(() => {
		const interactive = !!newest && (phase === 'full' || reopening || replyOpen);
		void window.electronAPI.notchSetInteractive(interactive);
	}, [newest?.id, phase, reopening, replyOpen]);

	// Defensive ceiling: if mouseleave is dropped under click-through, clear
	// hovering so phase-driven peek/retract CSS can take over again.
	useEffect(() => {
		if (!hovering || replyOpen) return;
		if (phase !== 'peek' && phase !== 'retracted') return;
		const ceiling = setTimeout(() => {
			setHovering(false);
		}, HOVER_CEILING_MS);
		return () => clearTimeout(ceiling);
	}, [hovering, replyOpen, phase]);

	// Hide the notch window once the buffer has been empty briefly.
	// NOTE: This is intentionally NOT gated on `!hovering`. On Windows the renderer
	// may never receive a `mouseleave` after `setIgnoreMouseEvents(true, { forward: true })`,
	// which would keep `hovering` stuck and prevent the notch from ever hiding.
	useEffect(() => {
		if (history.length > 0) return;
		const emptyTimer = setTimeout(() => {
			void window.electronAPI.notchEmpty();
		}, EMPTY_HIDE_DELAY_MS);
		return () => clearTimeout(emptyTimer);
	}, [history.length]);

	// Hover-leave and copy-feedback timer cleanup.
	useEffect(() => {
		return () => {
			if (leaveHoverTimer.current) {
				clearTimeout(leaveHoverTimer.current);
				leaveHoverTimer.current = null;
			}
			if (copyFeedbackTimer.current) {
				clearTimeout(copyFeedbackTimer.current);
				copyFeedbackTimer.current = null;
			}
		};
	}, []);

	// Reset copied feedback after COPY_FEEDBACK_MS.
	useEffect(() => {
		if (!copiedId) return;
		if (copyFeedbackTimer.current) {
			clearTimeout(copyFeedbackTimer.current);
		}
		copyFeedbackTimer.current = setTimeout(() => {
			setCopiedId(null);
			copyFeedbackTimer.current = null;
		}, COPY_FEEDBACK_MS);
		return () => {
			if (copyFeedbackTimer.current) {
				clearTimeout(copyFeedbackTimer.current);
			}
		};
	}, [copiedId]);

	return {
		history,
		newest,
		phase,
		hovering,
		reopening,
		replyOpen,
		replyingTo,
		copiedId,
		setHovering,
		openReply,
		closeReply,
		onNotchMessage,
		copyText,
		scheduleHoverLeave,
		cancelHoverLeave,
		reopenFromHoverTarget,
	};
}

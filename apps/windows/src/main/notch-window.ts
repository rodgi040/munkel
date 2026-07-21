import { BrowserWindow, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getWindowUrl } from './window-url';
import { unfocusNotchAfterReply } from './notch-focus';
import type { NotchMessage } from '../shared/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Compact dimensions (WIN-NOTCH-004 / macOS-parity P1.3): fixed width, content-
 * driven height via `notch-resize` IPC. Height starts compact and grows downward.
 */
export const NOTCH_WIDTH = 280;
export const NOTCH_DEFAULT_HEIGHT = 180;
export const NOTCH_MIN_HEIGHT = 40;
export const NOTCH_MAX_HEIGHT = 480;
const NOTCH_HIDE_DELAY_MS = 250;
const NOTCH_RESIZE_TOLERANCE_PX = 1;

let pendingHide: ReturnType<typeof setTimeout> | null = null;

function clearPendingHide(): void {
	if (!pendingHide) return;
	clearTimeout(pendingHide);
	pendingHide = null;
}

/** Prefer the display under the cursor (multi-monitor); fall back to primary. */
function resolveNotchDisplay(): Electron.Display {
	try {
		const point = screen.getCursorScreenPoint();
		return screen.getDisplayNearestPoint(point);
	} catch {
		return screen.getPrimaryDisplay();
	}
}

/** Top-center of the given display in absolute screen coordinates. */
export function notchPositionForDisplay(
	display: Electron.Display,
	width: number = NOTCH_WIDTH,
): { x: number; y: number } {
	const { x: dx, y: dy, width: dw } = display.bounds;
	return {
		x: Math.round(dx + (dw - width) / 2),
		y: dy,
	};
}

function positionNotchWindow(win: BrowserWindow): Electron.Display {
	const display = resolveNotchDisplay();
	// Center from the fixed constant, never from getSize(): reading the width back
	// picks up DPI rounding that grows each cycle and drifts the window left.
	const { x, y } = notchPositionForDisplay(display, NOTCH_WIDTH);
	win.setPosition(x, y);
	return display;
}

/** Clamp a renderer-reported content height to sane window bounds. */
export function clampNotchHeight(contentHeight: number): number {
	if (!Number.isFinite(contentHeight) || contentHeight <= 0) return NOTCH_DEFAULT_HEIGHT;
	return Math.min(NOTCH_MAX_HEIGHT, Math.max(NOTCH_MIN_HEIGHT, Math.ceil(contentHeight)));
}

/**
 * Resize the notch window vertically to fit its rendered content. Width and
 * position stay fixed (top-center), so the window only grows downward.
 */
export function resizeNotchToContent(win: BrowserWindow | null, contentHeight: number): void {
	if (!win) return;
	const height = clampNotchHeight(contentHeight);
	const [, currentHeight] = win.getSize();
	if (Math.abs(currentHeight - height) <= NOTCH_RESIZE_TOLERANCE_PX) return;
	const wasResizable = win.isResizable();
	if (!wasResizable) win.setResizable(true);
	// Pin width to the constant so DPI round-trips can't grow it over time.
	win.setSize(NOTCH_WIDTH, height);
	if (!wasResizable) win.setResizable(false);
	// Re-anchor top-center after height changes (multi-monitor / DPI).
	positionNotchWindow(win);
}

export function createNotchWindow(): BrowserWindow {
	const display = resolveNotchDisplay();
	const { x, y } = notchPositionForDisplay(display);
	const isDev = process.env.NODE_ENV === 'development';

	const win = new BrowserWindow({
		width: NOTCH_WIDTH,
		height: NOTCH_DEFAULT_HEIGHT,
		x,
		y,
		show: false,
		frame: false,
		// Transparent frameless: only the rounded `.notch-widget` paints; the rest of
		// the window must be see-through. An opaque dev background (#141418) painted
		// the whole BrowserWindow rectangle grey → the artifact seen behind the notch.
		transparent: true,
		backgroundColor: '#00000000',
		alwaysOnTop: true,
		skipTaskbar: true,
		resizable: false,
		focusable: false,
		// CSS `.notch-widget::before` provides the shadow; a native shadow would draw
		// a rectangle around the transparent window on Windows.
		hasShadow: false,
		// thickFrame + transparent is a known Windows compositing footgun.
		thickFrame: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	// Content protection hides the window from some capture paths; skip in DEV
	// so we can verify visibility while debugging.
	if (!isDev) {
		win.setContentProtection(true);
	}
	win.setAlwaysOnTop(true, 'screen-saver');

	win.webContents.on('did-fail-load', (_e, code, desc, url) => {
		console.error('[notch] did-fail-load', { code, desc, url });
	});

	win.loadURL(getWindowUrl('/notch'));
	win.on('ready-to-show', () => {
		positionNotchWindow(win);
	});
	return win;
}

export function showNotch(win: BrowserWindow | null): void {
	if (!win) return;
	clearPendingHide();
	positionNotchWindow(win);
	// Guarantee a visible footprint before the renderer measures content.
	const [, h] = win.getSize();
	if (h < 140) {
		resizeNotchToContent(win, 140);
	}
	win.setAlwaysOnTop(true, 'screen-saver');
	win.moveTop();
	// show() is more reliable than showInactive on some Windows multi-monitor setups.
	if (process.env.NODE_ENV === 'development') {
		win.show();
	} else {
		win.showInactive();
	}
	win.webContents.send('notch-show');
}

export function hideNotch(win: BrowserWindow | null): void {
	requestNotchHide(win);
}

export function requestNotchHide(win: BrowserWindow | null): void {
	if (!win) return;
	unfocusNotchAfterReply(win);
	win.webContents.send('notch-hide');
	clearPendingHide();
	pendingHide = setTimeout(() => {
		pendingHide = null;
		win.hide();
	}, NOTCH_HIDE_DELAY_MS);
}

export function updateNotch(win: BrowserWindow | null, data: NotchMessage): void {
	if (!win) return;
	win.webContents.send('notch-update', data);
}

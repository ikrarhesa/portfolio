import { useEffect, useState, useRef } from 'react';
import { useSpaceInvaders } from '../hooks/useSpaceInvaders';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/spaceInvaders';
import { gameAudio } from '../lib/gameAudio';
import { canUseHeadControl, startHeadControl, type HeadStatus } from '../lib/headControl';
import { prefetchFaceModel } from '../lib/faceAR';
import { fill, useContent } from '../i18n';

interface SpaceInvaderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// The dialog (and the game hook with its keyboard listeners) only exists while open
const GameDialog = ({ onClose }: { onClose: () => void }) => {
    const g = useContent().game;
    const { canvasRef, score, gameOver, highScore, isNewBest, lives, hitPulse, startGame, stopGame, setControl, setSteer, gameState } = useSpaceInvaders();
    // Alternate between two identical animations so every hit restarts the shake
    const hitClass = hitPulse === 0 ? '' : hitPulse % 2 ? 'game-hit-a' : 'game-hit-b';
    const [sound, setSound] = useState(gameAudio.getPrefs);
    const toggleMusic = () => {
        gameAudio.setMusicEnabled(!gameAudio.getPrefs().music);
        setSound(gameAudio.getPrefs());
    };
    const toggleSfx = () => {
        gameAudio.setSfxEnabled(!gameAudio.getPrefs().sfx);
        setSound(gameAudio.getPrefs());
    };
    const [gameStarted, setGameStarted] = useState(false);

    // Optional camera steering: desktop/tablet only, loads nothing until the visitor opts in
    const [headSupported] = useState(canUseHeadControl);
    const [headOn, setHeadOn] = useState(false);
    const [headStatus, setHeadStatus] = useState<HeadStatus>('loading');
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (!headOn || !videoRef.current) return;
        const stop = startHeadControl({ video: videoRef.current, setControl, setSteer, onStatus: setHeadStatus });
        return stop; // also switches the camera off
        // eslint-disable-next-line react-hooks/exhaustive-deps -- setControl only writes to a ref
    }, [headOn]);
    useEffect(() => {
        if (headStatus === 'error') setHeadOn(false);
    }, [headStatus]);
    const headLabel: Record<HeadStatus, string> = {
        loading: g.head.loading,
        calibrating: g.head.calibrating,
        tracking: g.head.tracking,
        lost: g.head.lost,
        error: '',
    };
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => modalRef.current?.focus(), 100);
        return () => {
            clearTimeout(timer);
            stopGame();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- stopGame only touches refs/setters, run once on unmount
    }, []);

    const handleStart = () => {
        setGameStarted(true);
        startGame();
        modalRef.current?.focus();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 outline-none"
            onClick={onClose}
            tabIndex={-1}
            ref={modalRef}
            onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'm' || e.key === 'M') toggleMusic();
                // Prevent default scrolling for game keys
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault();
                }
            }}
        >
            <div
                className="relative bg-[#0b0712] border border-fuchsia-400/40 rounded-2xl p-2 shadow-[0_0_60px_rgba(217,70,239,0.25)] max-w-full max-h-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Controls */}
                <div className="flex justify-between items-center mb-2 px-2">
                    <div className="text-fuchsia-300 font-mono text-xs tracking-widest">{g.title}</div>
                    <div className="ml-auto mr-3 flex items-center gap-1.5">
                        {([
                            [g.music, '♪', sound.music, toggleMusic],
                            [g.sfx, '◖))', sound.sfx, toggleSfx],
                        ] as const).map(([label, icon, on, toggle]) => (
                            <button
                                key={label}
                                type="button"
                                onClick={toggle}
                                aria-pressed={on}
                                aria-label={fill(g.toggle, { label, state: on ? g.on : g.off })}
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400 ${
                                    on
                                        ? 'border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-200'
                                        : 'border-white/10 text-zinc-500 line-through hover:text-zinc-300'
                                }`}
                            >
                                <span aria-hidden className="no-underline">{icon}</span>
                                {label}
                            </button>
                        ))}
                        {headSupported && (
                            <button
                                type="button"
                                onClick={() => setHeadOn((v) => !v)}
                                onPointerEnter={prefetchFaceModel}
                                onFocus={prefetchFaceModel}
                                aria-pressed={headOn}
                                title={g.cameraTitle}
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400 ${
                                    headOn
                                        ? 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100'
                                        : 'border-white/10 text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                <span aria-hidden>●</span>
                                {g.camera}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label={g.close}
                        className="rounded text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-fuchsia-400"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Game Container */}
                <div className={`relative flex items-center justify-center bg-[#07060b] rounded-xl border border-white/10 p-1 overflow-hidden ${hitClass}`}>
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="block image-pixelated"
                        style={{
                            imageRendering: 'pixelated',
                            aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
                            // As wide as the window allows (up to 1100px) without outgrowing its height
                            width: `min(1100px, 92vw, calc((100dvh - 11rem) * ${CANVAS_WIDTH} / ${CANVAS_HEIGHT}))`,
                            height: 'auto',
                        }}
                    />

                    {/* CRT scanlines + vignette */}
                    <div
                        className="pointer-events-none absolute inset-1 z-[5] rounded-lg"
                        aria-hidden
                        style={{
                            background:
                                'radial-gradient(ellipse at center, transparent 55%, rgba(7,6,11,0.55)), repeating-linear-gradient(transparent 0 2px, rgba(0,0,0,0.16) 2px 3px)',
                        }}
                    />

                    {/* Camera preview: small mirrored window, only while head control is on */}
                    {headOn && (
                        <div className="absolute bottom-3 right-3 z-30 w-32 overflow-hidden rounded-lg border border-cyan-300/40 bg-black/70 shadow-lg">
                            <video ref={videoRef} muted playsInline className="block h-24 w-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                            <div className="px-1.5 py-1 text-center font-mono text-[9px] uppercase tracking-wider text-cyan-100">
                                {headLabel[headStatus]}
                            </div>
                        </div>
                    )}

                    {/* Hit flash */}
                    {hitPulse > 0 && <div key={hitPulse} className="hit-flash pointer-events-none absolute inset-0 z-10 rounded-lg" aria-hidden />}

                    {/* Start Screen Overlay */}
                    {!gameStarted && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/85 z-20 rounded-lg">
                            <div className="text-fuchsia-300 font-mono text-2xl font-bold mb-4 animate-pulse">{g.ready}</div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                className="px-8 py-3 bg-fuchsia-500 text-white font-mono text-lg hover:bg-fuchsia-400 transition-colors rounded-lg shadow-[0_0_24px_rgba(217,70,239,0.5)] focus-visible:outline-2 focus-visible:outline-fuchsia-200"
                            >
                                {g.start}
                            </button>
                            {headSupported && (
                                <div className="mt-3 text-center text-[10px] font-mono text-zinc-500">
                                    {g.cameraHint1}<br />{g.cameraHint2}
                                </div>
                            )}
                            <div className="mt-4 text-zinc-400 text-xs font-mono">
                                {highScore > 0 ? fill(g.best, { n: highScore }) : g.pressToStart}
                            </div>
                        </div>
                    )}

                    {/* Score Overlay */}
                    {gameStarted && (
                        <div className="absolute top-4 left-4 right-4 flex justify-between font-mono text-sm z-10 pointer-events-none">
                            <span className="text-fuchsia-200">{fill(g.score, { n: score })}</span>
                            <div className="flex gap-4 text-cyan-200">
                                <span>{fill(g.level, { n: gameState.current.level })}</span>
                                <span key={lives} className={hitPulse > 0 ? 'lives-pop' : ''}>{fill(g.lives, { n: lives })}</span>
                            </div>
                        </div>
                    )}

                    {/* Level Transition Overlay */}
                    {!gameOver && gameStarted && gameState.current.aliens.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/60 z-20">
                            <div className="text-fuchsia-300 font-mono text-xl font-bold animate-pulse">{g.levelCleared}</div>
                            <div className="text-white font-mono text-sm">{g.nextWave}</div>
                        </div>
                    )}

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/90 z-20 rounded-lg px-6 text-center">
                            <div className="text-rose-400 font-mono text-2xl font-bold mb-3 animate-pulse">{g.gameOver}</div>
                            <div className="text-white font-mono text-lg">{fill(g.score, { n: score })}</div>
                            <div className="mt-1 font-mono text-sm text-fuchsia-300">
                                {isNewBest ? g.newBest : fill(g.best, { n: highScore })}
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                    className="px-6 py-2 bg-fuchsia-500 text-white font-mono text-sm hover:bg-fuchsia-400 transition-colors rounded-lg"
                                >
                                    {g.retry}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-white/20 text-zinc-300 font-mono text-sm hover:bg-white/5 transition-colors rounded-lg"
                                >
                                    {g.exit}
                                </button>
                            </div>
                            <div className="mt-6 border-t border-white/10 pt-5">
                                <p className="font-mono text-xs text-zinc-400">{g.niceShooting}</p>
                                <a
                                    href="/#contact"
                                    onClick={onClose}
                                    className="mt-3 inline-block rounded-lg bg-white px-5 py-2 font-mono text-sm font-semibold text-black hover:bg-fuchsia-200 transition-colors"
                                >
                                    {g.workTogether}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Touch controls (shown only on touch devices) */}
                {gameStarted && !gameOver && (
                    <div className="mt-2 hidden [@media(pointer:coarse)]:flex gap-2 select-none touch-none" aria-label={g.touch}>
                        {([
                            ['ArrowLeft', '◀', 'flex-1'],
                            ['Space', g.fireLabel, 'flex-[2] bg-fuchsia-500/80'],
                            ['ArrowRight', '▶', 'flex-1'],
                        ] as const).map(([key, label, extra]) => (
                            <button
                                key={key}
                                type="button"
                                aria-label={key === 'Space' ? g.fire : key === 'ArrowLeft' ? g.left : g.right}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    setControl(key, true);
                                    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not all browsers allow it */ }
                                }}
                                onPointerUp={() => setControl(key, false)}
                                onPointerCancel={() => setControl(key, false)}
                                onLostPointerCapture={() => setControl(key, false)}
                                onContextMenu={(e) => e.preventDefault()}
                                className={`rounded-lg border border-white/15 py-4 font-mono text-lg text-white active:bg-fuchsia-500 ${extra}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-2 text-center text-zinc-500 text-[10px] font-mono">
                    <span className="[@media(pointer:coarse)]:hidden">{g.helpKeys}</span>
                    <span className="hidden [@media(pointer:coarse)]:inline">{g.helpTouch}</span>
                </div>
            </div>
        </div>
    );
};

const SpaceInvaderModal = ({ isOpen, onClose }: SpaceInvaderModalProps) =>
    isOpen ? <GameDialog onClose={onClose} /> : null;

export default SpaceInvaderModal;

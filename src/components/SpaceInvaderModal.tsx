import { useEffect, useState, useRef } from 'react';
import { useSpaceInvaders } from '../hooks/useSpaceInvaders';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/spaceInvaders';
import { gameAudio } from '../lib/gameAudio';

interface SpaceInvaderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// The dialog (and the game hook with its keyboard listeners) only exists while open
const GameDialog = ({ onClose }: { onClose: () => void }) => {
    const { canvasRef, score, gameOver, highScore, isNewBest, lives, hitPulse, startGame, stopGame, setControl, gameState } = useSpaceInvaders();
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
                    <div className="text-fuchsia-300 font-mono text-xs tracking-widest">SPACE INVADERS</div>
                    <div className="ml-auto mr-3 flex items-center gap-1.5">
                        {([
                            ['Music', '♪', sound.music, toggleMusic],
                            ['SFX', '◖))', sound.sfx, toggleSfx],
                        ] as const).map(([label, icon, on, toggle]) => (
                            <button
                                key={label}
                                type="button"
                                onClick={toggle}
                                aria-pressed={on}
                                aria-label={`${label} ${on ? 'on' : 'off'}`}
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
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close game"
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
                        className="w-full h-full object-contain image-pixelated"
                        style={{
                            imageRendering: 'pixelated',
                            width: '600px',
                            height: '685px',
                            maxWidth: '90vw',
                            maxHeight: 'min(80vh, calc(100dvh - 11rem))'
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

                    {/* Hit flash */}
                    {hitPulse > 0 && <div key={hitPulse} className="hit-flash pointer-events-none absolute inset-0 z-10 rounded-lg" aria-hidden />}

                    {/* Start Screen Overlay */}
                    {!gameStarted && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/85 z-20 rounded-lg">
                            <div className="text-fuchsia-300 font-mono text-2xl font-bold mb-4 animate-pulse">READY?</div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                className="px-8 py-3 bg-fuchsia-500 text-white font-mono text-lg hover:bg-fuchsia-400 transition-colors rounded-lg shadow-[0_0_24px_rgba(217,70,239,0.5)] focus-visible:outline-2 focus-visible:outline-fuchsia-200"
                            >
                                START MISSION
                            </button>
                            <div className="mt-4 text-zinc-400 text-xs font-mono">
                                {highScore > 0 ? `BEST: ${highScore}` : 'PRESS BUTTON TO START'}
                            </div>
                        </div>
                    )}

                    {/* Score Overlay */}
                    {gameStarted && (
                        <div className="absolute top-4 left-4 right-4 flex justify-between font-mono text-sm z-10 pointer-events-none">
                            <span className="text-fuchsia-200">SCORE: {score}</span>
                            <div className="flex gap-4 text-cyan-200">
                                <span>LEVEL: {gameState.current.level}</span>
                                <span key={lives} className={hitPulse > 0 ? 'lives-pop' : ''}>LIVES: {lives}</span>
                            </div>
                        </div>
                    )}

                    {/* Level Transition Overlay */}
                    {!gameOver && gameStarted && gameState.current.aliens.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/60 z-20">
                            <div className="text-fuchsia-300 font-mono text-xl font-bold animate-pulse">LEVEL CLEARED</div>
                            <div className="text-white font-mono text-sm">PREPARE FOR NEXT WAVE</div>
                        </div>
                    )}

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07060b]/90 z-20 rounded-lg px-6 text-center">
                            <div className="text-rose-400 font-mono text-2xl font-bold mb-3 animate-pulse">GAME OVER</div>
                            <div className="text-white font-mono text-lg">SCORE: {score}</div>
                            <div className="mt-1 font-mono text-sm text-fuchsia-300">
                                {isNewBest ? 'NEW BEST!' : `BEST: ${highScore}`}
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleStart(); }}
                                    className="px-6 py-2 bg-fuchsia-500 text-white font-mono text-sm hover:bg-fuchsia-400 transition-colors rounded-lg"
                                >
                                    RETRY
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-white/20 text-zinc-300 font-mono text-sm hover:bg-white/5 transition-colors rounded-lg"
                                >
                                    EXIT
                                </button>
                            </div>
                            <div className="mt-6 border-t border-white/10 pt-5">
                                <p className="font-mono text-xs text-zinc-400">Nice shooting. Want to build something together?</p>
                                <a
                                    href="#contact"
                                    onClick={onClose}
                                    className="mt-3 inline-block rounded-lg bg-white px-5 py-2 font-mono text-sm font-semibold text-black hover:bg-fuchsia-200 transition-colors"
                                >
                                    Let's work together →
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Touch controls (shown only on touch devices) */}
                {gameStarted && !gameOver && (
                    <div className="mt-2 hidden [@media(pointer:coarse)]:flex gap-2 select-none touch-none" aria-label="Touch controls">
                        {([
                            ['ArrowLeft', '◀', 'flex-1'],
                            ['Space', 'FIRE', 'flex-[2] bg-fuchsia-500/80'],
                            ['ArrowRight', '▶', 'flex-1'],
                        ] as const).map(([key, label, extra]) => (
                            <button
                                key={key}
                                type="button"
                                aria-label={key === 'Space' ? 'Fire' : key === 'ArrowLeft' ? 'Move left' : 'Move right'}
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
                    <span className="[@media(pointer:coarse)]:hidden">ARROWS to Move • SPACE to Shoot • M to toggle music</span>
                    <span className="hidden [@media(pointer:coarse)]:inline">Hold ◀ ▶ to move • hold FIRE to shoot</span>
                </div>
            </div>
        </div>
    );
};

const SpaceInvaderModal = ({ isOpen, onClose }: SpaceInvaderModalProps) =>
    isOpen ? <GameDialog onClose={onClose} /> : null;

export default SpaceInvaderModal;

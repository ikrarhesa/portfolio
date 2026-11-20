import { useEffect, useRef, useState, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPRITES, GAME_CONFIG } from '../constants/spaceInvaders';
import { gameAudio } from '../lib/gameAudio';

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    type?: string;
    active: boolean;
    sprite?: number[][];
    frame?: number; // For animation
}

interface Alien extends GameObject {
    row: number;
    col: number;
    score: number;
    variant: 'SQUID' | 'CRAB' | 'OCTOPUS';
}

interface GameState {
    player: GameObject;
    aliens: Alien[];
    bullets: GameObject[]; // Player bullets
    alienBullets: GameObject[];
    particles: GameObject[]; // Explosions
    bunkers: GameObject[];
    ufo?: GameObject;
    score: number;
    lives: number;
    level: number;
    gameOver: boolean;
    paused: boolean;
    alienDirection: number; // 1 for right, -1 for left
    alienSpeed: number; // Frames per move (lower is faster)
    lastAlienMove: number; // Timestamp
    lastUfoSpawn: number;
    lastShotTime: number; // Timestamp of last shot fired
}

const HIGH_SCORE_KEY = "hesa_invaders_best";

const readHighScore = () => {
    try {
        return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10) || 0;
    } catch {
        return 0; // storage can be blocked (private mode, etc.)
    }
};

const writeHighScore = (value: number) => {
    try {
        localStorage.setItem(HIGH_SCORE_KEY, String(value));
    } catch {
        /* ignore */
    }
};

interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    max: number;
    color: string;
}

// Palette shared with the rest of the site (fuchsia / cyan on near-black)
const COLORS = {
    background: '#07060b',
    player: '#22d3ee',
    playerHit: '#f0abfc',
    alien: { SQUID: '#f0abfc', CRAB: '#e879f9', OCTOPUS: '#a78bfa' } as Record<string, string>,
    bunker: '#22d3ee',
    ufo: '#fbbf24',
    bullet: '#a5f3fc',
    alienBullet: '#f472b6',
    ground: '#22d3ee',
    sparks: ['#22d3ee', '#ffffff', '#f472b6', '#f0abfc'],
};

// Fixed starfield (positions are deterministic, so it never "jumps" between frames)
const STARS = Array.from({ length: 48 }, (_, i) => {
    const r = (n: number) => {
        const x = Math.sin((i + 1) * n) * 43758.5453;
        return x - Math.floor(x);
    };
    return { x: Math.floor(r(12.9898) * CANVAS_WIDTH), y: Math.floor(r(78.233) * (CANVAS_HEIGHT - 8)), phase: r(39.346) * 6.28 };
});

// Haptic buzz on touch devices. Browsers refuse it until the page has been tapped once.
const buzz = (pattern: number | number[]) => {
    if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(pattern);
};

const HIT_INVULNERABLE_MS = 1600; // brief grace period after being hit
const GAME_OVER_DELAY_MS = 900; // let the final explosion play before the overlay

export type ControlKey = 'ArrowLeft' | 'ArrowRight' | 'Space';

export const useSpaceInvaders = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(readHighScore);
    const [isNewBest, setIsNewBest] = useState(false);
    const [lives, setLives] = useState(3);
    const [hitPulse, setHitPulse] = useState(0); // bumps on every hit so the UI can react
    const sparks = useRef<Spark[]>([]);
    const hitUntil = useRef(0);
    const gameOverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Game State Ref (to avoid closure staleness in loop)
    const gameState = useRef<GameState>({
        player: { x: CANVAS_WIDTH / 2 - 6, y: CANVAS_HEIGHT - 20, width: 13, height: 8, active: true, sprite: SPRITES.PLAYER },
        aliens: [],
        bullets: [],
        alienBullets: [],
        particles: [],
        bunkers: [],
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        paused: false,
        alienDirection: 1,
        alienSpeed: 60, // Initial speed (frames per move)
        lastAlienMove: 0,
        lastUfoSpawn: 0,
        lastShotTime: 0
    });

    const requestRef = useRef<number | undefined>(undefined);
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    // Analog steering from -1 (full left) to 1 (full right), used by camera head control
    const steerRef = useRef(0);

    // Initialize Game
    const initGame = useCallback(() => {
        const aliens: Alien[] = [];
        for (let row = 0; row < GAME_CONFIG.ALIEN_ROWS; row++) {
            for (let col = 0; col < GAME_CONFIG.ALIEN_COLS; col++) {
                let sprite = SPRITES.SQUID;
                let scoreVal = 30;
                let variant: 'SQUID' | 'CRAB' | 'OCTOPUS' = 'SQUID';

                if (row >= 1 && row <= 2) {
                    sprite = SPRITES.CRAB;
                    scoreVal = 20;
                    variant = 'CRAB';
                } else if (row >= 3) {
                    sprite = SPRITES.OCTOPUS;
                    scoreVal = 10;
                    variant = 'OCTOPUS';
                }

                aliens.push({
                    x: GAME_CONFIG.ALIEN_SPACING_X * col + GAME_CONFIG.ALIEN_START_X,
                    y: GAME_CONFIG.ALIEN_START_Y + GAME_CONFIG.ALIEN_SPACING_Y * row,
                    width: sprite[0].length,
                    height: sprite.length,
                    active: true,
                    type: 'alien',
                    row,
                    col,
                    score: scoreVal,
                    sprite: sprite,
                    frame: 0,
                    variant
                });
            }
        }

        // Bunkers (4 blocks of protection)
        const bunkers: GameObject[] = [];
        for (let i = 0; i < 4; i++) {
            const bx = Math.round((CANVAS_WIDTH / 4) * (i + 0.5) - 8); // spread evenly across the width
            const by = CANVAS_HEIGHT - 40;
            // Create small blocks for each bunker to simulate destruction
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 4; c++) {
                    bunkers.push({
                        x: bx + (c * 4),
                        y: by + (r * 4),
                        width: 4,
                        height: 4,
                        active: true,
                        type: 'bunker'
                    });
                }
            }
        }

        gameState.current = {
            player: { x: CANVAS_WIDTH / 2 - 6, y: CANVAS_HEIGHT - 20, width: 13, height: 10, active: true, sprite: SPRITES.PLAYER },
            aliens,
            bullets: [],
            alienBullets: [],
            particles: [],
            bunkers,
            ufo: undefined,
            score: 0,
            lives: 3,
            level: 1,
            gameOver: false,
            paused: false,
            alienDirection: 1,
            alienSpeed: 40,
            lastAlienMove: 0,
            lastUfoSpawn: 0,
            lastShotTime: 0
        };
    }, []);

    const playingRef = useRef(false);

    const startGame = () => {
        gameAudio.begin(); // runs inside the START / RETRY click, so the browser allows sound
        setIsPlaying(true);
        playingRef.current = true;
        setGameOver(false);
        setIsNewBest(false);
        setScore(0);
        setLives(3);
        setHitPulse(0);
        clearTimeout(gameOverTimer.current);
        sparks.current = [];
        hitUntil.current = 0;
        keysPressed.current = {};
        initGame();
        if (!requestRef.current) {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    };

    const stopGame = () => {
        gameAudio.shutdown();
        setIsPlaying(false);
        playingRef.current = false;
        clearTimeout(gameOverTimer.current);
        keysPressed.current = {};
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = undefined;
        }
    };

    // Only claim the keyboard while a game is running, so the page can still scroll with
    // Space / arrow keys when the game is closed.
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!playingRef.current) return;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
        keysPressed.current[e.code] = true;
    };

    // On-screen touch buttons drive the same input map as the keyboard
    const setControl = (key: ControlKey, pressed: boolean) => {
        keysPressed.current[key] = pressed;
    };

    const setSteer = (value: number) => {
        steerRef.current = value;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        keysPressed.current[e.code] = false;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []); // Empty dependency array as we use refs

    const spawnExplosion = (cx: number, cy: number, count: number) => {
        const colors = COLORS.sparks;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 1.6;
            const life = 30 + Math.random() * 30;
            sparks.current.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.5,
                life,
                max: life,
                color: colors[i % colors.length],
            });
        }
    };

    const endGame = (state: GameState) => {
        state.gameOver = true;
        gameAudio.gameOver();
        const previous = readHighScore();
        const beat = state.score > previous;
        if (beat) writeHighScore(state.score);
        // Reveal the game-over overlay after the explosion has had a moment to play
        clearTimeout(gameOverTimer.current);
        gameOverTimer.current = setTimeout(() => {
            setGameOver(true);
            setHighScore(Math.max(previous, state.score));
            setIsNewBest(beat);
        }, GAME_OVER_DELAY_MS);
    };

    // The ship was hit: explosion, haptic buzz, brief invulnerability (or the end if out of lives)
    const hitPlayer = (state: GameState, now: number) => {
        state.lives--;
        setLives(state.lives);
        setHitPulse((n) => n + 1);
        gameAudio.playerHit();
        spawnExplosion(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, state.lives <= 0 ? 40 : 18);
        if (state.lives <= 0) {
            buzz([80, 40, 180]);
            state.player.active = false;
            endGame(state);
        } else {
            buzz(90);
            hitUntil.current = now + HIT_INVULNERABLE_MS;
        }
    };

    const update = (timestamp: number) => {
        const state = gameState.current;

        // Explosion sparks keep animating, even once the game is over
        sparks.current = sparks.current.filter((sp) => --sp.life > 0);
        sparks.current.forEach((sp) => {
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vy += 0.04;
        });

        if (state.gameOver || state.paused) return;

        // Player Movement
        if (steerRef.current !== 0) {
            const nextX = state.player.x + GAME_CONFIG.PLAYER_SPEED * steerRef.current;
            state.player.x = Math.max(2, Math.min(CANVAS_WIDTH - state.player.width - 2, nextX));
        }
        if (keysPressed.current['ArrowLeft'] && state.player.x > 2) {
            state.player.x -= GAME_CONFIG.PLAYER_SPEED;
        }
        if (keysPressed.current['ArrowRight'] && state.player.x < CANVAS_WIDTH - state.player.width - 2) {
            state.player.x += GAME_CONFIG.PLAYER_SPEED;
        }

        // Continuous Firing when Space is held
        const FIRE_COOLDOWN = 200; // milliseconds between shots
        if (keysPressed.current['Space'] && playingRef.current && !state.gameOver) {
            if (timestamp - state.lastShotTime > FIRE_COOLDOWN) {
                state.bullets.push({
                    x: state.player.x + 6,
                    y: state.player.y - 4,
                    width: 1,
                    height: 4,
                    active: true,
                    sprite: SPRITES.BULLET
                });
                state.lastShotTime = timestamp;
                gameAudio.shoot();
            }
        }

        // Bullet Movement
        state.bullets.forEach(b => b.y -= GAME_CONFIG.BULLET_SPEED);
        state.bullets = state.bullets.filter(b => b.y > 0 && b.active);

        // Alien Movement
        if (timestamp - state.lastAlienMove > state.alienSpeed * 16) {
            state.lastAlienMove = timestamp;
            let hitEdge = false;
            const activeAliens = state.aliens.filter(a => a.active);
            activeAliens.forEach(a => {
                if ((state.alienDirection === 1 && a.x + a.width >= CANVAS_WIDTH - 2) ||
                    (state.alienDirection === -1 && a.x <= 2)) {
                    hitEdge = true;
                }
            });

            if (hitEdge) {
                state.alienDirection *= -1;
                activeAliens.forEach(a => {
                    a.y += GAME_CONFIG.ALIEN_DROP_DISTANCE;
                    // Toggle frame
                    a.frame = a.frame === 0 ? 1 : 0;
                    // Update sprite based on variant and frame
                    const spriteName = `${a.variant}${a.frame === 1 ? '_2' : ''}`;
                    a.sprite = SPRITES[spriteName as keyof typeof SPRITES];
                });
                state.alienSpeed = Math.max(2, state.alienSpeed * 0.9);
            } else {
                activeAliens.forEach(a => {
                    a.x += 2 * state.alienDirection;
                    // Toggle frame
                    a.frame = a.frame === 0 ? 1 : 0;
                    // Update sprite based on variant and frame
                    const spriteName = `${a.variant}${a.frame === 1 ? '_2' : ''}`;
                    a.sprite = SPRITES[spriteName as keyof typeof SPRITES];
                });
            }
        }

        // UFO Spawning logic
        if (!state.ufo && Math.random() < 0.001) { // Low chance per frame
            state.ufo = {
                x: 0,
                y: 10,
                width: 16,
                height: 7,
                active: true,
                sprite: SPRITES.UFO,
                type: 'ufo'
            };
            gameAudio.ufoStart();
        }

        // UFO Movement
        if (state.ufo && state.ufo.active) {
            state.ufo.x += 1;
            if (state.ufo.x > CANVAS_WIDTH) {
                state.ufo.active = false;
                state.ufo = undefined;
                gameAudio.ufoStop();
            }
        }

        // Alien Shooting Logic
        const activeAliens = state.aliens.filter(a => a.active);
        // Probability scales with number of active aliens.
        // Base chance (0.02) is for when all aliens are alive.
        // As aliens die, the total frequency of shots decreases, maintaining a constant rate per alien.
        const shootChance = (0.02 + (state.level * 0.005)) * (activeAliens.length / state.aliens.length);

        if (Math.random() < shootChance) {
            if (activeAliens.length > 0) {
                // Pick a random alien to shoot
                const shooter = activeAliens[Math.floor(Math.random() * activeAliens.length)];
                // Only shoot if no other alien is immediately below (simple check)
                const isBottomAlien = !activeAliens.some(a => a.active && a.col === shooter.col && a.row > shooter.row);

                if (isBottomAlien) {
                    gameAudio.alienShoot();
                    state.alienBullets.push({
                        x: shooter.x + shooter.width / 2,
                        y: shooter.y + shooter.height,
                        width: 2,
                        height: 6,
                        active: true,
                        type: 'alienBullet'
                    });
                }
            }
        }

        // Alien Bullet Movement
        state.alienBullets.forEach(b => b.y += 1); // Reduced from 2 to 1 for slower speed
        state.alienBullets = state.alienBullets.filter(b => b.y < CANVAS_HEIGHT && b.active);

        // Collision Detection
        // Player Bullets
        state.bullets.forEach(bullet => {
            if (!bullet.active) return;

            // Vs Aliens
            state.aliens.forEach(alien => {
                if (alien.active && bullet.active &&
                    bullet.x < alien.x + alien.width &&
                    bullet.x + bullet.width > alien.x &&
                    bullet.y < alien.y + alien.height &&
                    bullet.y + bullet.height > alien.y) {
                    alien.active = false;
                    bullet.active = false;
                    state.score += alien.score;
                    setScore(state.score);
                    gameAudio.alienKill();
                    const alive = state.aliens.filter(a => a.active).length;
                    gameAudio.setIntensity(1 - alive / state.aliens.length);
                }
            });

            // Vs Bunkers (Player fire)
            state.bunkers?.forEach(bunker => {
                if (bunker.active && bullet.active &&
                    bullet.x < bunker.x + bunker.width &&
                    bullet.x + bullet.width > bunker.x &&
                    bullet.y < bunker.y + bunker.height &&
                    bullet.y + bullet.height > bunker.y) {
                    bunker.active = false;
                    bullet.active = false;
                }
            });

            // Vs UFO
            if (state.ufo && state.ufo.active && bullet.active &&
                bullet.x < state.ufo.x + state.ufo.width &&
                bullet.x + bullet.width > state.ufo.x &&
                bullet.y < state.ufo.y + state.ufo.height &&
                bullet.y + bullet.height > state.ufo.y) {
                state.ufo.active = false;
                bullet.active = false;
                gameAudio.ufoStop();
                gameAudio.ufoKill();
                state.score += Math.floor(Math.random() * 3 + 1) * 50; // 50, 100, 150
                setScore(state.score);
                state.ufo = undefined;
            }
        });

        // Alien Bullets Collision
        state.alienBullets.forEach(bullet => {
            if (!bullet.active) return;

            // Vs Player
            if (state.player.active && timestamp >= hitUntil.current &&
                bullet.x < state.player.x + state.player.width &&
                bullet.x + bullet.width > state.player.x &&
                bullet.y < state.player.y + state.player.height &&
                bullet.y + bullet.height > state.player.y) {

                bullet.active = false;
                hitPlayer(state, timestamp);
            }

            // Vs Bunkers (Alien fire)
            state.bunkers?.forEach(bunker => {
                if (bunker.active && bullet.active &&
                    bullet.x < bunker.x + bunker.width &&
                    bullet.x + bullet.width > bunker.x &&
                    bullet.y < bunker.y + bunker.height &&
                    bullet.y + bullet.height > bunker.y) {
                    bunker.active = false;
                    bullet.active = false;
                }
            });
        });

        // Check Win/Loss
        if (state.aliens.filter(a => a.active).length === 0) {
            gameAudio.levelUp();
            gameAudio.setIntensity(0);
            const aliens: Alien[] = [];
            for (let row = 0; row < GAME_CONFIG.ALIEN_ROWS; row++) {
                for (let col = 0; col < GAME_CONFIG.ALIEN_COLS; col++) {
                    let sprite = SPRITES.SQUID;
                    let scoreVal = 30;
                    let variant: 'SQUID' | 'CRAB' | 'OCTOPUS' = 'SQUID';

                    if (row >= 1 && row <= 2) {
                        sprite = SPRITES.CRAB;
                        scoreVal = 20;
                        variant = 'CRAB';
                    } else if (row >= 3) {
                        sprite = SPRITES.OCTOPUS;
                        scoreVal = 10;
                        variant = 'OCTOPUS';
                    }
                    aliens.push({
                        x: GAME_CONFIG.ALIEN_SPACING_X * col + GAME_CONFIG.ALIEN_START_X,
                        y: GAME_CONFIG.ALIEN_START_Y + GAME_CONFIG.ALIEN_SPACING_Y * row,
                        width: sprite[0].length,
                        height: sprite.length,
                        active: true,
                        type: 'alien',
                        row,
                        col,
                        score: scoreVal,
                        sprite: sprite,
                        frame: 0,
                        variant
                    });
                }
            }
            state.aliens = aliens;
            state.alienSpeed = Math.max(2, 40 - (state.level * 5));
            state.level++;
        }

        if (!state.gameOver && state.aliens.some(a => a.active && a.y + a.height >= state.player.y)) {
            state.lives = 0;
            setLives(0);
            setHitPulse((n) => n + 1);
            gameAudio.playerHit();
            buzz([80, 40, 180]);
            spawnExplosion(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 40);
            state.player.active = false;
            endGame(state);
        }
    };

    const drawSprite = (ctx: CanvasRenderingContext2D, sprite: number[][], x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        sprite.forEach((row, r) => {
            row.forEach((pixel, c) => {
                if (pixel) {
                    ctx.fillRect(x + c, y + r, 1, 1);
                }
            });
        });
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const state = gameState.current;

        // Faint twinkling stars for depth
        const t = performance.now() / 1000;
        ctx.fillStyle = '#e9d5ff';
        STARS.forEach(star => {
            ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 1.5 + star.phase);
            ctx.fillRect(star.x, star.y, 1, 1);
        });
        ctx.globalAlpha = 1;

        const now = performance.now();
        const invulnerable = now < hitUntil.current;
        if (state.player.active && (!invulnerable || Math.floor(now / 90) % 2 === 0)) {
            drawSprite(ctx, state.player.sprite!, state.player.x, state.player.y, invulnerable ? COLORS.playerHit : COLORS.player);
        }

        state.aliens.forEach(alien => {
            if (alien.active) {
                drawSprite(ctx, alien.sprite!, alien.x, alien.y, COLORS.alien[alien.variant] ?? '#e879f9');
            }
        });

        // Draw Bunkers
        ctx.fillStyle = COLORS.bunker;
        ctx.globalAlpha = 0.7;
        state.bunkers?.forEach(b => {
            if (b.active) {
                ctx.fillRect(b.x, b.y, b.width, b.height);
            }
        });
        ctx.globalAlpha = 1;

        // Draw UFO
        if (state.ufo && state.ufo.active) {
            drawSprite(ctx, state.ufo.sprite!, state.ufo.x, state.ufo.y, COLORS.ufo);
        }

        ctx.fillStyle = COLORS.bullet;
        state.bullets.forEach(bullet => {
            if (bullet.active) {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });

        // Draw Alien Bullets
        ctx.fillStyle = COLORS.alienBullet;
        state.alienBullets.forEach(bullet => {
            if (bullet.active) {
                // Zigzag pattern or just rect
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            }
        });

        sparks.current.forEach(sp => {
            ctx.globalAlpha = Math.max(0, sp.life / sp.max);
            ctx.fillStyle = sp.color;
            ctx.fillRect(sp.x, sp.y, 2, 2);
        });
        ctx.globalAlpha = 1;

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = COLORS.ground;
        ctx.fillRect(0, CANVAS_HEIGHT - 1, CANVAS_WIDTH, 1);
        ctx.globalAlpha = 1;
    };

    const gameLoop = (timestamp: number) => {
        update(timestamp);
        draw();
        if (playingRef.current) {
            requestRef.current = requestAnimationFrame(gameLoop);
        } else {
            requestRef.current = undefined;
        }
    };

    return {
        canvasRef,
        score,
        gameOver,
        highScore,
        isNewBest,
        lives,
        hitPulse,
        isPlaying,
        startGame,
        stopGame,
        setControl,
        setSteer,
        gameState // Expose full state for UI overlays
    };
};

import { shell } from "./shell";
import { home } from "./home";
import { project } from "./project";
import { template } from "./template";
import { tana } from "./tana";
import { game } from "./game";

/** All English text that isn't case-study data (that stays in constants/missions.ts and constants/arFilters.ts) */
export const en = { shell, home, project, template, tana, game };
export type Content = typeof en;

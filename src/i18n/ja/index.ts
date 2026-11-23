import type { Content } from "../en";
import { shell } from "./shell";
import { home } from "./home";
import { project } from "./project";
import { template } from "./template";
import { tana } from "./tana";
import { game } from "./game";

export { jaMissions } from "./missions";
export { jaArFilters } from "./arFilters";

/** Typed against the English content, so a missing or extra key is a compile error */
export const ja: Content = { shell, home, project, template, tana, game };

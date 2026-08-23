/**
 * Card artwork, keyed by project id.
 *
 * Lives outside WorkGallery so the server-rendered case-study pages can render
 * the same artwork the client-rendered gallery does — one registry, no drift.
 * The art components are plain SVG with no hooks, so they render in either.
 */

import type React from "react";
import { AlifArt } from "./AlifArt";
import { BeonAIArt } from "./BeonAIArt";
import { PaperPilotArt } from "./PaperPilotArt";
import { Burn0Art } from "./Burn0Art";

/** Where a card's artwork sits in its own stack. */
export type ArtSlot = "top" | "middle" | "bottom";

export type ArtEntry = {
  /** Coded artwork. Omit for projects that supply a `cover` image instead. */
  Component?: React.ComponentType;
  /** Artwork on a light ground. Needs its own dim treatment — see the CSS. */
  light?: boolean;
  /**
   * Artwork placement, per project rather than global.
   *
   * "top" is the original full-bleed banner above the whole card and stays
   * the default; it suppresses the blurb, since the image is the summary.
   * "middle" and "bottom" inset the art inside the padded body, below the
   * description, so the text is what introduces the image.
   *
   * Varying this across the grid is the point: a row of cards that all break
   * at the same line reads as a template.
   */
  slot?: ArtSlot;
  /**
   * The artwork already carries the logo and the name, so the card head
   * should not print them a second time. The <h2> stays in the DOM for the
   * document outline and screen readers, just visually hidden.
   */
  bare?: boolean;
  /**
   * The artwork's own background colour.
   *
   * Grid rows stretch cards to the tallest in the row. Rather than crop the
   * artwork to fill that slack or leave a dark hole, the frame around the
   * artwork is painted this colour and the art is centred in it — so the
   * leftover height reads as padding the artwork was drawn with.
   */
  ground?: string;
};

/**
 * Art presentation, keyed by project id — coded artwork and cover images alike.
 * An entry with no `Component` is pure placement config for a `cover` PNG.
 */
export const ART: Record<string, ArtEntry> = {
  alif: { Component: AlifArt, slot: "top", bare: true, ground: "#0a0a0c" },
  beonai: { Component: BeonAIArt, light: true, slot: "top", bare: true, ground: "#faf9f5" },
  paperpilot: { Component: PaperPilotArt, slot: "top", bare: true, ground: "#0b0907" },
  burn0: { Component: Burn0Art, slot: "middle", bare: true, ground: "#09090b" },
  basketo: { slot: "bottom", bare: true, ground: "#020605" },

  /* Playable builds. Each is poster key art with the title drawn into it, so
     `bare` hides the card head's copy of the name and the artwork leads the
     card. Uniformly "top" — unlike the coded artwork above, these are a set,
     and a shelf of game covers should look like a shelf. */
  "music-balls": { slot: "top", bare: true, ground: "#010102" },
  "text-editor": { slot: "top", bare: true, ground: "#000000" },
  "music-player": { slot: "top", bare: true, ground: "#010102" },
  "three-js-text": { slot: "top", bare: true, ground: "#040405" },
  "hacker-news": { slot: "top", bare: true, ground: "#010102" },
  "cs-leets": { slot: "top", bare: true, ground: "#000000" },
  "rgb-color-game": { slot: "top", bare: true, ground: "#010102" },
  "todo-list": { slot: "top", bare: true, ground: "#070808" },
  "space-x": { slot: "top", bare: true, ground: "#000000" },
  colorize: { slot: "top", bare: true, ground: "#010102" },
  "need-for-speed": { slot: "top", bare: true, ground: "#010103" },
};


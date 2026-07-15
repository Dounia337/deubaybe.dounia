// Shared entrance timing for the homepage hero ("Hello," -> "I" -> "am" -> photo + identity
// reveal). Exported so the nav (site-header.tsx) can wait for the full sequence to land on the
// homepage before its auto-peek cue fires, instead of detaching while the greeting is still
// playing and competing for attention.
export const HELLO_DURATION = 1300;
export const I_DURATION = 550;
export const AM_DURATION = 900;
export const REVEAL_DURATION = 600;

export const HERO_INTRO_MS = HELLO_DURATION + I_DURATION + AM_DURATION + REVEAL_DURATION;

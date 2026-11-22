export type ARFilter = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  purpose?: string; // why it exists
  trigger: string; // what the effect reacts to
  video: string; // /public/ar/<id>.mp4 (cropped, no audio)
  poster: string; // /public/ar/<id>.jpg
};

// Written from what's visible in each recording. Edit titles and blurbs freely,
// and add details only you know (brief, results, tools, your role on each).
export const AR_FILTERS: ARFilter[] = [
  {
    id: "editable-text",
    title: "Editable-text sticker",
    blurb:
      "A commercial sticker above the head. Pick a text sticker from the effects library, type your own message and it updates live: “Promo Spesial”, “Limited Offer!”, or anything else. One effect, any offer. Recorded in the live Shopee app.",
    tags: ["Commercial", "Editable text", "Head anchor"],
    purpose: "Commercial: sellers write their own offer",
    trigger: "Typed text, live",
    video: "/ar/editable-text.mp4",
    poster: "/ar/editable-text.jpg",
  },
  {
    id: "holo-glasses",
    title: "Holo glasses",
    blurb:
      "A glowing orange HUD visor that sits on the eyes and follows every head turn, tilt and blink. Made just for fun, inspired by a science fiction film that was out at the time.",
    tags: ["Eye tracking", "Head pose", "Just for fun"],
    purpose: "Just for fun, inspired by a sci-fi film of the time",
    trigger: "Eye and head tracking",
    video: "/ar/holo-glasses.mp4",
    poster: "/ar/holo-glasses.jpg",
  },
  {
    id: "ngantuk-ya",
    title: "Ngantuk ya?",
    blurb:
      "A small challenge: can you watch other people yawn without yawning? The effect shows yawning faces, and if you open your mouth, you fail. “Ngantuk ya?” is Indonesian for “Sleepy, huh?”",
    tags: ["Mouth-open trigger", "Challenge", "Local copy"],
    purpose: "A challenge game: don't yawn",
    trigger: "Open mouth",
    video: "/ar/ngantuk-ya.mp4",
    poster: "/ar/ngantuk-ya.jpg",
  },
  {
    id: "nod-to-switch",
    title: "Nod to switch",
    blurb:
      "A blank canvas of a face with hand-drawn expressions: sad, smirking, mischievous. Nod your head to switch between them (“Angguk kepala untuk mengganti”). Each nod changes the face.",
    tags: ["Nod detection", "Face mesh", "Hand-drawn"],
    trigger: "Nod detection",
    video: "/ar/nod-to-switch.mp4",
    poster: "/ar/nod-to-switch.jpg",
  },
  {
    id: "summer-fruit",
    title: "Summer fruit frame",
    blurb:
      "A hand-drawn summer frame of sun, fruit and butterflies around the screen edges, with cherries pinned to the cheeks that stay on the face.",
    tags: ["Face anchors", "Screen frame", "Decoration"],
    purpose: "Decoration for sharing cute videos with friends and family",
    trigger: "None, it follows the face",
    video: "/ar/summer-fruit.mp4",
    poster: "/ar/summer-fruit.jpg",
  },
  {
    id: "doodle-cats",
    title: "Doodle cats",
    blurb:
      "Doodled cats, hearts and confetti dots drift around the frame, while pink dots lock onto the forehead, cheeks and chin.",
    tags: ["Face anchors", "Decoration"],
    purpose: "Decoration for sharing cute videos with friends and family",
    trigger: "None, it follows the face",
    video: "/ar/doodle-cats.mp4",
    poster: "/ar/doodle-cats.jpg",
  },
];

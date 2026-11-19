export type ARFilter = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
  video: string; // /public/ar/<id>.mp4 (cropped, no audio)
  poster: string; // /public/ar/<id>.jpg
};

// Written from what's visible in each recording. Edit titles and blurbs freely,
// and add details only you know (brief, results, tools, your role on each).
export const AR_FILTERS: ARFilter[] = [
  {
    id: "holo-glasses",
    title: "Holo glasses",
    blurb: "A glowing orange HUD visor that sits on the eyes and follows every head turn, tilt and blink.",
    tags: ["Eye tracking", "Head pose"],
    video: "/ar/holo-glasses.mp4",
    poster: "/ar/holo-glasses.jpg",
  },
  {
    id: "ngantuk-ya",
    title: "Ngantuk ya?",
    blurb:
      "A sticker badge that pops up above the head and changes through a short sequence. “Ngantuk ya?” is Indonesian for “Sleepy, huh?”",
    tags: ["Head anchor", "Sticker sequence", "Local copy"],
    video: "/ar/ngantuk-ya.mp4",
    poster: "/ar/ngantuk-ya.jpg",
  },
  {
    id: "nod-to-switch",
    title: "Nod to switch",
    blurb:
      "A blank canvas of a face with hand-drawn expressions: sad, smirking, mischievous. Nod your head to switch between them (“Angguk kepala untuk mengganti”).",
    tags: ["Gesture trigger", "Face mesh", "Hand-drawn"],
    video: "/ar/nod-to-switch.mp4",
    poster: "/ar/nod-to-switch.jpg",
  },
  {
    id: "summer-fruit",
    title: "Summer fruit frame",
    blurb:
      "A hand-drawn summer frame of sun, fruit and butterflies around the screen edges, with cherries pinned to the cheeks that stay on the face.",
    tags: ["Face anchors", "Screen frame", "Illustrated"],
    video: "/ar/summer-fruit.mp4",
    poster: "/ar/summer-fruit.jpg",
  },
  {
    id: "doodle-cats",
    title: "Doodle cats",
    blurb:
      "Doodled cats, hearts and confetti dots drift around the frame, while pink dots lock onto the forehead, cheeks and chin.",
    tags: ["Face anchors", "Illustrated"],
    video: "/ar/doodle-cats.mp4",
    poster: "/ar/doodle-cats.jpg",
  },
];

/*
  JOURNEY (timeline, newest at the bottom)
  kind: "past" | "now" | "next"
    past = done, now = what you're doing, next = a goal (plan, not a claim)
  Required: when, title, kind. Optional: body, draft.
*/
window.CONTENT = window.CONTENT || {};

CONTENT.education = [
  {
    school: "BINUS University",
    degree: "B.Sc. Computer Science",
    when: "2024 – 2028 (expected)",
    place: "Jakarta",
  },
];

CONTENT.journey = [
  {
    when: "2024",
    title: "Started Computer Science at BINUS",
    body: "Programming fundamentals and a lot of trial and error.",
    kind: "past",
  },
  {
    when: "2025",
    title: "First website, designed and built by hand",
    body: "Human-Computer Interaction lab: Figma first, then HTML, CSS and JavaScript.",
    kind: "past",
  },
  {
    when: "2025",
    title: "Networks and data",
    body: "Simulated a network in Packet Tracer and built a Python data dashboard with a team.",
    kind: "past",
  },
  {
    when: "2026",
    title: "Backend developer on Harmoney",
    body: "Owned the savings module of a five-person finance app and learned how money moves safely under concurrency.",
    kind: "past",
  },
  {
    when: "Sep 2026",
    title: "Presented my first paper at EECSI 2026",
    body: "First author on the Docker vs Serverless benchmark, presented in Yogyakarta.",
    kind: "past",
  },
  {
    when: "Now",
    title: "Semester 5, looking for an internship",
    body: "Backend and infrastructure roles, where correctness and performance matter.",
    kind: "now",
  },
  {
    when: "Next",
    title: "Benchmark v2 on real AWS",
    body: "Rerun the study on AWS Lambda vs ECS/Fargate, including cost per million requests.",
    kind: "next",
  },
];

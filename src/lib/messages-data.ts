import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";

export type Presence = { activeNow: boolean; lastSeen?: string; hidden?: boolean };

export type Thread = {
  id: string;
  user: string;
  name: string;
  avatar: string;
  last: string;
  time: string;
  unread?: boolean;
  muted?: boolean;
  presence: Presence;
};

export const threads: Thread[] = [
  {
    id: "1",
    user: "mara.k",
    name: "Mara K",
    avatar: avatar1,
    last: "sent you a clip",
    time: "2m",
    unread: true,
    presence: { activeNow: true },
  },
  {
    id: "2",
    user: "orenlab",
    name: "Oren Lab",
    avatar: avatar2,
    last: "let's shoot friday",
    time: "1h",
    presence: { activeNow: false, lastSeen: "Last seen 12 min ago" },
  },
  {
    id: "3",
    user: "sable",
    name: "Sable",
    avatar: avatar1,
    last: "🖤",
    time: "3h",
    presence: { activeNow: false, hidden: true },
  },
  {
    id: "4",
    user: "elias",
    name: "Elias",
    avatar: avatar2,
    last: "the archive is live",
    time: "12h",
    muted: true,
    presence: { activeNow: false, lastSeen: "Last seen 4 h ago" },
  },
  {
    id: "5",
    user: "nightform",
    name: "Nightform",
    avatar: avatar2,
    last: "you: matte black only",
    time: "1d",
    presence: { activeNow: false, lastSeen: "Last seen yesterday" },
  },
];

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  kind: "text" | "images" | "voice";
  text?: string;
  images?: string[];
  duration?: string;
  time: string;
  status?: "sent" | "delivered" | "seen";
  reaction?: string;
};

export type ChatBlock = { label: string; messages: ChatMessage[] };

export const chatByThread: Record<string, ChatBlock[]> = {
  "1": [
    {
      label: "Yesterday, 11:04 PM",
      messages: [
        {
          id: "m1",
          from: "them",
          kind: "text",
          text: "Still up? I shot the rain series on the way back.",
          time: "11:04 PM",
        },
        {
          id: "m2",
          from: "me",
          kind: "text",
          text: "Always. Send the frames.",
          time: "11:06 PM",
          status: "seen",
        },
        {
          id: "m3",
          from: "them",
          kind: "images",
          images: [post1, post3],
          time: "11:07 PM",
          reaction: "🖤",
        },
      ],
    },
    {
      label: "Today, 4:32 PM",
      messages: [
        {
          id: "m4",
          from: "me",
          kind: "text",
          text: "The second one is the archive cover. No question.",
          time: "4:32 PM",
          status: "seen",
        },
        { id: "m5", from: "them", kind: "voice", duration: "0:14", time: "4:35 PM" },
        {
          id: "m6",
          from: "them",
          kind: "text",
          text: "Sent you a clip too — tell me if the grade is too cold.",
          time: "4:36 PM",
        },
        {
          id: "m7",
          from: "me",
          kind: "text",
          text: "Looking now.",
          time: "4:40 PM",
          status: "delivered",
        },
      ],
    },
  ],
  "2": [
    {
      label: "Today, 1:12 PM",
      messages: [
        { id: "o1", from: "them", kind: "text", text: "Studio 4 is free friday.", time: "1:12 PM" },
        {
          id: "o2",
          from: "me",
          kind: "text",
          text: "Book it. I'll bring the 35mm.",
          time: "1:20 PM",
          status: "seen",
        },
        { id: "o3", from: "them", kind: "images", images: [post2], time: "1:24 PM" },
      ],
    },
  ],
};

export const defaultChat: ChatBlock[] = [
  {
    label: "Today",
    messages: [
      { id: "d1", from: "them", kind: "text", text: "🖤", time: "3:02 PM" },
      {
        id: "d2",
        from: "me",
        kind: "text",
        text: "Archive drops tonight.",
        time: "3:05 PM",
        status: "seen",
      },
    ],
  },
];

export function getThread(id: string): Thread {
  return threads.find((t) => t.id === id) ?? (threads[0] as Thread);
}

export function getChat(id: string) {
  return chatByThread[id] ?? defaultChat;
}

export const recentPeople = threads.map((t) => ({
  id: t.id,
  user: t.user,
  name: t.name,
  avatar: t.avatar,
}));

export const suggestedPeople = [
  { id: "s1", user: "juno", name: "Juno", avatar: avatar1 },
  { id: "s2", user: "halcyon", name: "Halcyon", avatar: avatar2 },
  { id: "s3", user: "verte", name: "Verte", avatar: avatar1 },
  { id: "s4", user: "atlas.f", name: "Atlas F", avatar: avatar2 },
];

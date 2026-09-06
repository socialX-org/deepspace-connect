import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";

export const avatars = { avatar1, avatar2 };

export type Story = {
  id: string;
  name: string;
  avatar: string;
  seen?: boolean;
  isYou?: boolean;
};

export const stories: Story[] = [
  { id: "you", name: "Your story", avatar: avatar2, isYou: true },
  { id: "1", name: "mara.k", avatar: avatar1 },
  { id: "2", name: "nightform", avatar: avatar2 },
  { id: "3", name: "elias", avatar: avatar2 },
  { id: "4", name: "sable", avatar: avatar1 },
  { id: "5", name: "orenlab", avatar: avatar2 },
  { id: "6", name: "juno", avatar: avatar1 },
];

export type Post = {
  id: string;
  user: string;
  avatar: string;
  location?: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
};

export const posts: Post[] = [
  {
    id: "p1",
    user: "mara.k",
    avatar: avatar1,
    location: "Berlin",
    image: post1,
    caption: "Late walk home. The city is louder when it's empty.",
    likes: 4213,
    comments: 128,
    time: "2h ago",
  },
  {
    id: "p2",
    user: "orenlab",
    avatar: avatar2,
    location: "Studio 4",
    image: post2,
    caption: "Concrete, one line of light. Nothing else needed.",
    likes: 8842,
    comments: 341,
    time: "5h ago",
  },
  {
    id: "p3",
    user: "nightform",
    avatar: avatar2,
    image: post3,
    caption: "Matte black, one ember of red. Shot for the archive.",
    likes: 15320,
    comments: 902,
    time: "9h ago",
  },
];

export const clips = [
  {
    id: "c1",
    user: "mara.k",
    avatar: avatar1,
    image: post1,
    caption: "3AM in the rain · Clip 01",
    likes: "12.4k",
    comments: "834",
    audio: "original audio — mara.k",
  },
  {
    id: "c2",
    user: "nightform",
    avatar: avatar2,
    image: post3,
    caption: "One ember.",
    likes: "48.1k",
    comments: "2,104",
    audio: "nightform — blackout",
  },
  {
    id: "c3",
    user: "orenlab",
    avatar: avatar2,
    image: post2,
    caption: "Light study.",
    likes: "7,902",
    comments: "412",
    audio: "original audio — orenlab",
  },
];

export type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  replies?: Comment[];
};

export const comments: Comment[] = [
  {
    id: "1",
    user: "sable",
    avatar: avatar1,
    text: "This is unreal.",
    time: "1h",
    likes: 24,
    replies: [
      {
        id: "1a",
        user: "mara.k",
        avatar: avatar1,
        text: "@sable thank you — shot it on the walk back.",
        time: "58m",
        likes: 6,
      },
      {
        id: "1b",
        user: "juno",
        avatar: avatar1,
        text: "@mara.k the restraint here is everything.",
        time: "51m",
        likes: 2,
      },
    ],
  },
  {
    id: "2",
    user: "elias",
    avatar: avatar2,
    text: "The grain on this one is perfect.",
    time: "1h",
    likes: 9,
  },
  { id: "3", user: "juno", avatar: avatar1, text: "Archive worthy 🖤", time: "42m", likes: 3 },
  {
    id: "4",
    user: "orenlab",
    avatar: avatar2,
    text: "What lens was this shot on?",
    time: "20m",
    likes: 1,
    replies: [
      {
        id: "4a",
        user: "nightform",
        avatar: avatar2,
        text: "@orenlab 35mm, wide open.",
        time: "12m",
        likes: 4,
      },
    ],
  },
];

export const shareTargets = [
  { id: "1", user: "mara.k", avatar: avatar1 },
  { id: "2", user: "orenlab", avatar: avatar2 },
  { id: "3", user: "sable", avatar: avatar1 },
  { id: "4", user: "elias", avatar: avatar2 },
  { id: "5", user: "juno", avatar: avatar1 },
  { id: "6", user: "nightform", avatar: avatar2 },
];

export const suggestedUsers = [
  { id: "1", user: "sable", avatar: avatar1, meta: "Followed by juno" },
  { id: "2", user: "elias", avatar: avatar2, meta: "New to SocialX" },
  { id: "3", user: "juno", avatar: avatar1, meta: "Followed by mara.k" },
];

export const trending = [
  { tag: "#blackframe", posts: "128k posts" },
  { tag: "#nightwalk", posts: "94.2k posts" },
  { tag: "#clipsdaily", posts: "76.8k posts" },
  { tag: "#minimalism", posts: "52.1k posts" },
  { tag: "#deepred", posts: "31.4k posts" },
];

export const exploreGrid = [
  post1,
  post2,
  post3,
  post2,
  post3,
  post1,
  post3,
  post1,
  post2,
  post1,
  post3,
  post2,
];

export const profile = {
  user: "you.socialx",
  name: "Alex Rey",
  avatar: avatar2,
  bio: "Photographer · black frames only\nArchive of nights and light.",
  posts: 148,
  followers: "24.6k",
  following: 312,
  followersCount: 1240,
  followingCount: 430,
};

export type FollowAccount = {
  id: string;
  user: string;
  name: string;
  avatar: string;
  isFollowing?: boolean;
};

export const sampleFollowers: FollowAccount[] = [
  { id: "f1", user: "mara.k", name: "Mara K", avatar: avatar1, isFollowing: false },
  { id: "f2", user: "orenlab", name: "Oren Lab", avatar: avatar2, isFollowing: true },
  { id: "f3", user: "sable", name: "Sable", avatar: avatar1, isFollowing: false },
  { id: "f4", user: "elias", name: "Elias", avatar: avatar2, isFollowing: true },
  { id: "f5", user: "juno", name: "Juno", avatar: avatar1, isFollowing: false },
  { id: "f6", user: "nightform", name: "Night Form", avatar: avatar2, isFollowing: true },
];

export const sampleFollowing: FollowAccount[] = [
  { id: "g1", user: "mara.k", name: "Mara K", avatar: avatar1, isFollowing: true },
  { id: "g2", user: "orenlab", name: "Oren Lab", avatar: avatar2, isFollowing: true },
  { id: "g3", user: "elias", name: "Elias", avatar: avatar2, isFollowing: true },
  { id: "g4", user: "nightform", name: "Night Form", avatar: avatar2, isFollowing: true },
  { id: "g5", user: "kira.frame", name: "Kira Frame", avatar: avatar1, isFollowing: true },
  { id: "g6", user: "noir.studio", name: "Noir Studio", avatar: avatar2, isFollowing: true },
  { id: "g7", user: "velvet.raw", name: "Velvet Raw", avatar: avatar1, isFollowing: true },
  { id: "g8", user: "cine.luxe", name: "Cine Luxe", avatar: avatar2, isFollowing: true },
];

export const sampleSuggested: FollowAccount[] = [
  { id: "s1", user: "archive.00", name: "Archive Zero", avatar: avatar1 },
  { id: "s2", user: "mono.collective", name: "Mono Collective", avatar: avatar2 },
  { id: "s3", user: "redline.film", name: "Redline Film", avatar: avatar1 },
  { id: "s4", user: "darkroom.co", name: "Darkroom Co", avatar: avatar2 },
];

export const conversations = [
  {
    id: "1",
    user: "mara.k",
    avatar: avatar1,
    last: "sent you a clip",
    time: "2m",
    unread: true,
  },
  { id: "2", user: "orenlab", avatar: avatar2, last: "let's shoot friday", time: "1h" },
  { id: "3", user: "sable", avatar: avatar1, last: "🖤", time: "3h" },
  { id: "4", user: "elias", avatar: avatar2, last: "Seen 12h ago", time: "12h" },
];

export const notifications = [
  { id: "1", user: "mara.k", avatar: avatar1, text: "liked your post", time: "4m" },
  { id: "2", user: "elias", avatar: avatar2, text: "started following you", time: "22m" },
  { id: "3", user: "juno", avatar: avatar1, text: "commented: archive worthy", time: "1h" },
  { id: "4", user: "orenlab", avatar: avatar2, text: "reposted your clip", time: "3h" },
];

export function getUserProfile(username: string) {
  const post = posts.find((p) => p.user === username);
  const story = stories.find((s) => s.name === username);
  return {
    user: username,
    name: username.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    avatar: post?.avatar ?? story?.avatar ?? avatar1,
    bio: "Photographer · black frames only\nOn SocialX since 2024.",
    posts: 96,
    followers: "12.3k",
    following: 208,
  };
}

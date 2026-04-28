import { size } from "@/app/opengraph-image";
import { getPostBySlug } from "@/features/blog/lib/post";
import { ImageResponse } from "@vercel/og";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return new ImageResponse(<div>Not found</div>);
  }

  return new ImageResponse(
    <div
      style={{
        background: "#0f172a",
        color: "white",
        width: "100%",
        height: "100%",
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 20, opacity: 0.6 }}>Khant.dev</div>
      <div style={{ fontSize: 42, marginTop: 20, fontWeight: 600 }}>
        {post.title}
      </div>
      <div
        style={{
          fontSize: 20,
          marginTop: 20,
          opacity: 0.7,
        }}
      >
        {post.description}
      </div>
    </div>,
    { ...size },
  );
}

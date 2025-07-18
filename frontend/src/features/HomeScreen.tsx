import Image from "next/image";

export type HomeScreenProps = {
  onNext: () => void;
};

const HomeScreen = ({ onNext }: HomeScreenProps) => (
  <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
    {/* 背景画像 */}
    <Image
      src="/guitar.jpeg"
      alt="ギター"
      fill
      style={{ objectFit: "cover", zIndex: 0 }}
      priority
    />
    {/* 黒のオーバーレイ */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 1,
      }}
    />
    {/* 中央ボタン */}
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
      }}
    >
      <button
        style={{
          width: "180px",
          height: "56px",
          background: "transparent",
          color: "#fff",
          border: "3px solid #fff",
          borderRadius: "0px",
          fontSize: "1.3rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          transition: "background 0.2s, color 0.2s, border-color 0.2s",
          cursor: "pointer",
          backdropFilter: "blur(2px)",
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          (e.currentTarget as HTMLButtonElement).style.color = "#171717";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#fff";
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#fff";
        }}
        onClick={onNext}
      >
        Enter
      </button>
    </div>
  </div>
);

export default HomeScreen;


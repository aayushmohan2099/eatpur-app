// src/Layout.jsx

export default function Layout({ children }) {
  return (
    <div className="relative">

      {/* GLOBAL BG */}
      <div className="video-bg">
        <video autoPlay loop muted playsInline className="video-el">
          <source src="/defBg/milletBg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* CONTENT */}
      <div className="relative">
        {children}
      </div>

    </div>
  );
}
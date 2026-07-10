// import { useEffect, useRef, useState, CSSProperties } from "react";
// import video from "../assets/videoCanopux.mp4";
// import logo from "../assets/logo.png";

// const VIDEO_SRC: string = video;
// const LOGO_SRC: string = logo;

// const LOGO_SHOW_BEFORE_END: number = 2; // seconds

// export default function CanopuxBanner() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [showLogo, setShowLogo] = useState<boolean>(false);

//   useEffect(() => {
//     const vid = videoRef.current;
//     if (!vid) return;

//     const handleTimeUpdate = () => {
//       const timeLeft = vid.duration - vid.currentTime;
//       setShowLogo(timeLeft <= LOGO_SHOW_BEFORE_END);
//     };

//     vid.addEventListener("timeupdate", handleTimeUpdate);
//     return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
//   }, []);

//   return (
//     <>
//       {/* Responsive styles */}
//       <style>{`
//         .canopux-wrapper {
//           position: relative;
//           width: 100%;
//           height: 200px;
//           overflow: hidden;
//           background: #000;
//           display: block;
//         }
//         @media (max-width: 768px) {
//           .canopux-wrapper { height: 140px; }
//           .canopux-logo    { height: 36px !important; }
//         }
//         @media (max-width: 480px) {
//           .canopux-wrapper { height: 100px; }
//           .canopux-logo    { height: 26px !important; }
//         }
//       `}</style>

//       <div className="canopux-wrapper">

//         {/* Video: covers full width with no gaps */}
//         <video
//           ref={videoRef}
//           src={VIDEO_SRC}
//           style={styles.video}
//           autoPlay
//           muted
//           loop
//           playsInline
//         />

//         {/* Logo: fades in for last 2 seconds of each loop */}
//         <div style={{ ...styles.overlay, opacity: showLogo ? 1 : 0 }}>
//           <img
//             src={LOGO_SRC}
//             alt="Canopux"
//             className="canopux-logo"
//             style={styles.logo}
//           />
//         </div>

//       </div>
//     </>
//   );
// }

// const styles: Record<string, CSSProperties> = {
//   video: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "100%",       // stretch to full container width
//     height: "100%",      // stretch to full container height
//     objectFit: "cover",  // fills every pixel — no white gaps on any side
//     objectPosition: "center",
//   },

//   overlay: {
//     position: "absolute",
//     inset: 0,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "rgba(0, 0, 0, 0.55)",
//     transition: "opacity 0.9s ease",
//     pointerEvents: "none",
//   },

//   logo: {
//     height: "60px",
//     objectFit: "contain",
//     filter: "invert(1) brightness(10)", // black PNG → white
//   },
// };

// import { CSSProperties } from "react";
// import saturnImg from "../assets/saturn.png";
// import logoImg from "../assets/logo.png";

// export default function CanopuxFooterBanner() {
//   return (
//     <>
//       <style>{`
//         .cnpx-banner {
//           width: 100%;
//           height: 72px;
//           background: #0a0a0a;
//           border-top: 1px solid #1f1f1f;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0 40px;
//           position: relative;
//           overflow: hidden;
//         }

//         .cnpx-saturn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 90px;
//           height: 90px;
//           object-fit: contain;
//           opacity: 0.4;
//           pointer-events: none;
//           animation: cnpx-ltr 18s linear infinite;
//         }

//         .cnpx-saturn-rev {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 68px;
//           height: 68px;
//           object-fit: contain;
//           opacity: 0.07;
//           pointer-events: none;
//           animation: cnpx-rtl 22s linear infinite;
//         }

//         @keyframes cnpx-ltr {
//           0%   { left: -110px; }
//           100% { left: calc(100% + 110px); }
//         }

//         @keyframes cnpx-rtl {
//           0%   { left: calc(100% + 90px); }
//           100% { left: -90px; }
//         }

//         .cnpx-content {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           width: 100%;
//           position: relative;
//           z-index: 2;
//         }

//         .cnpx-left {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//         }

//         .cnpx-logo {
//           height: 28px;
//           object-fit: contain;
//           filter: invert(1) brightness(10);
//         }

//         .cnpx-divider {
//           width: 1px;
//           height: 20px;
//           background: #2a2a2a;
//         }

//         .cnpx-tagline {
//           font-family: sans-serif;
//           font-size: 11px;
//           font-weight: 300;
//           letter-spacing: 2.5px;
//           text-transform: uppercase;
//           color: #555;
//         }

//         .cnpx-copy {
//           font-family: sans-serif;
//           font-size: 11px;
//           font-weight: 400;
//           color: #333;
//           letter-spacing: 1px;
//         }

//         @media (max-width: 600px) {
//           .cnpx-banner   { padding: 0 20px; height: 60px; }
//           .cnpx-tagline  { display: none; }
//           .cnpx-divider  { display: none; }
//           .cnpx-saturn   { width: 60px; height: 60px; }
//           .cnpx-saturn-rev { width: 48px; height: 48px; }
//         }
//       `}</style>

//       <div className="cnpx-banner">

//         {/* Saturn left → right */}
//         <img src="https://www.treehugger.com/thmb/NjpJIKig2Oen5I06EN1axDxyXiU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2017__09__saturn_entire_planet-293966c762114c97b8ccfbfeea478db9.jpg" alt="" className="cnpx-saturn" />

//         {/* Saturn right → left */}
//         {/* <img src="https://www.treehugger.com/thmb/NjpJIKig2Oen5I06EN1axDxyXiU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2017__09__saturn_entire_planet-293966c762114c97b8ccfbfeea478db9.jpg" alt="" className="cnpx-saturn-rev" /> */}

//         <div className="cnpx-content">
//           <div className="cnpx-left">
//             <img src={logoImg} alt="Canopux" className="cnpx-logo" />
//             <div className="cnpx-divider" />
//             <span className="cnpx-tagline">Architecting the Digital Horizon</span>
//           </div>
//           <span className="cnpx-copy">© 2026 Canopux. All rights reserved.</span>
//         </div>

//       </div>
//     </>
//   );
// }



import { useEffect, useRef } from "react";
import saturnImg from "../assets/saturn.png";
import logoImg from "../assets/logo.jpeg";

// Real asteroid belt image from NASA (public domain)
const ASTEROID_BG =
  "https://t4.ftcdn.net/jpg/09/19/12/19/360_F_919121973_LPKWqKPTgIiI3h2c67pGuIJrQnN99BUv.jpg";

export default function CanopuxFooterBanner() {
  const saturnRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let x = -110;
    let raf: number;

    const step = () => {
      x += 0.55;
      if (x > window.innerWidth + 110) x = -110;

      if (saturnRef.current) {
        saturnRef.current.style.left = `${x}px`;
        saturnRef.current.style.transform = `translateY(-50%)`;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        .cnpx-banner {
          width: 100%;
          height: 72px;
          background: #0a0a0a;
          border-top: 1px solid #1f1f1f;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: relative;
          overflow: hidden;
        }

        /* Real asteroid belt image scrolling slowly as background texture */
        .cnpx-asteroids {
          position: absolute;
          inset: 0;
          background-image: url(${ASTEROID_BG});
          background-size: cover;
          background-position: center;
          opacity: 0.4;
          animation: cnpx-asteroid-scroll 60s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes cnpx-asteroid-scroll {
          0%   { background-position: 0% center; }
          100% { background-position: 100% center; }
        }

        /* Saturn — JS-driven for smooth rotate + drift */
        .cnpx-saturn {
          position: absolute;
          top: 50%;
          width: 82px;
          height: 82px;
          object-fit: contain;
          opacity: 0.7;
          pointer-events: none;
          z-index: 1;
          will-change: transform, left;
        }

        /* Content always on top */
        .cnpx-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .cnpx-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .cnpx-logo {
          height: 28px;
          object-fit: contain;
          filter: invert(1) brightness(10);
        }

        .cnpx-divider {
          width: 1px;
          height: 20px;
          background: #2a2a2a;
        }

        .cnpx-tagline {
          font-family: sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #555;
        }

        .cnpx-copy {
          font-family: sans-serif;
          font-size: 11px;
          color: #333;
          letter-spacing: 1px;
        }

        @media (max-width: 600px) {
          .cnpx-banner  { padding: 0 20px; height: 60px; }
          .cnpx-tagline { display: none; }
          .cnpx-divider { display: none; }
          .cnpx-saturn  { width: 56px; height: 56px; }
        }
      `}</style>

      <div className="cnpx-banner">

        {/* Real asteroid belt texture — slow background scroll */}
        <div className="cnpx-asteroids" />

        {/* Saturn — JS rotates and drifts left → right continuously */}
        <img
          ref={saturnRef}
          src="https://www.treehugger.com/thmb/NjpJIKig2Oen5I06EN1axDxyXiU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2017__09__saturn_entire_planet-293966c762114c97b8ccfbfeea478db9.jpg"
          alt=""
          className="cnpx-saturn"
        />

        <div className="cnpx-content">
          <div className="cnpx-left">
            <img src={logoImg} alt="Canopux" className="cnpx-logo" />
            <div className="cnpx-divider" />
            <span className="cnpx-tagline">Architecting the Digital Horizon</span>
          </div>
          <span className="cnpx-copy">© 2026 Canopux. All rights reserved.</span>
        </div>

      </div>
    </>
  );
}
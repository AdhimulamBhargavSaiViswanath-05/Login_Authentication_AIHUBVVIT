import { useEffect } from 'react';

const AIHubFooter = () => {
  useEffect(() => {
    // Add global styles for content z-index
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
      .container, .row, .col, .card, section, article, main {
        position: relative;
        z-index: 5;
      }
    `;
    document.head.appendChild(globalStyle);

    return () => {
      document.head.removeChild(globalStyle);
    };
  }, []);

  return (
    <>
      <div className="aihub-bg-circle-container">
        <div className="aihub-wheel-container">
          <img 
            src="https://aihub-vvit.github.io/images/vvit1.png" 
            alt="Outer Wheel" 
            className="aihub-outer"
          />
          <img 
            src="https://aihub-vvit.github.io/images/circular_cen.png" 
            alt="Center" 
            className="aihub-center"
          />
        </div>
      </div>

      <footer className="aihub-footer">
        <div className="aihub-footer-container">
          <ul className="aihub-footer-links">
            <li className="aihub-footer-item">
              <i className="fa-solid fa-home"></i>
              <a href="https://aihub-vvit.github.io/">AI-HUB@VVIT</a>
            </li>
            <li className="aihub-footer-item">
              <i className="fa-solid fa-building-columns"></i>
              <a href="https://www.vvitguntur.com/">VVIT</a>
            </li>
            <li className="aihub-footer-item">
              <i className="fa-solid fa-location-dot"></i>
              <a href="https://www.google.com/maps/place/Vasireddy+Venkatadri+Institute+of+Technology">Guntur</a>
            </li>
            <li className="aihub-footer-item">
              <i className="fas fa-envelope"></i>
              <a href="mailto:aihub@vvit.net">Mail</a>
            </li>
            <li className="aihub-footer-item">
              <i className="fa-brands fa-github"></i>
              <a href="https://github.com/AIHUB-VVIT">Github</a>
            </li>
          </ul>
        </div>
      </footer>

      <style jsx>{`
        /* AI-HUB Footer Styles */
        .aihub-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(248, 249, 250, 0.85);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 0;
        }

        .aihub-footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: center;
        }

        .aihub-footer-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .aihub-footer-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .aihub-footer-item i {
          font-size: 1rem;
          color: #667eea;
        }

        .aihub-footer-item a {
          color: #4a5568;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .aihub-footer-item a:hover {
          color: #667eea;
        }

        /* Background Circle Animation */
        .aihub-bg-circle-container {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          background: transparent;
          overflow: hidden;
        }

        .aihub-wheel-container {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 70vh;
          height: 70vh;
          background: transparent;
          overflow: visible;
          transform: translate(20%, 18.95%);
        }

        .aihub-wheel-container img {
          position: absolute;
          background: transparent;
        }

        .aihub-outer {
          width: 100%;
          height: 100%;
          animation: aihub-rotate 60s linear infinite;
          opacity: 0.2;
        }

        .aihub-center {
          width: 34.21%;
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          opacity: 0.2;
          object-fit: contain;
        }

        @keyframes aihub-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .aihub-footer:hover ~ .aihub-bg-circle-container .aihub-wheel-container {
          opacity: 0.5;
        }

        /* Add spacing for fixed footer */
        body {
          padding-bottom: 60px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .aihub-footer-links {
            gap: 1rem;
            font-size: 0.813rem;
          }

          .aihub-footer-item {
            gap: 0.4rem;
          }

          .aihub-footer-item i {
            font-size: 0.875rem;
          }

          .aihub-wheel-container {
            width: 48vh;
            height: 48vh;
            transform: translate(20%, 15.5%);
          }

          .aihub-footer-container {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AIHubFooter;

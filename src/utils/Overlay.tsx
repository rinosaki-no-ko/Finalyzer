import { JSX } from "react";

const Overlay = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <style>{`.overlay-wrapper {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }`}</style>
      <div className="overlay-wrapper">
        <div className="overlay-container">{children}</div>
      </div>
    </>
  );
};

export default Overlay;

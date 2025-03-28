import { useEffect } from "react";

const DisableOverscroll = () => {
  useEffect(() => {
    const preventOverscroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", preventOverscroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventOverscroll);
    };
  }, []);

  return null;
};

export default DisableOverscroll;

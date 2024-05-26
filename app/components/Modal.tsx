import { useEffect } from "react";

interface ModalProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => boolean | void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ modalOpen, setModalOpen, children }) => {
  useEffect(() => {
    const handleScroll = () => {
      if (modalOpen) {
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
      }
    };

    handleScroll(); // Initial call

    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
      <div className="modal-box relative">
        <label
          onClick={() => setModalOpen(false)}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </label>
        {children}
      </div>
    </div>
  );
};

export default Modal;

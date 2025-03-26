import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function ModalWrapper({ isOpen, onClose, title, children, className = "" }) {
  const modalRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const startDrag = (e) => {
    setDragging(true);
    setStartPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const duringDrag = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y,
    });
  };

  const endDrag = () => setDragging(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onMouseMove={duringDrag}
      onMouseUp={endDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className={`bg-white rounded shadow-lg p-6 w-fit max-w-[90vw] min-w-[350px] relative ${className}`}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <div
          onMouseDown={startDrag}
          className="cursor-move text-xl font-bold mb-4 select-none"
        >
          {title}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ModalWrapper;

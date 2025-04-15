import SignaturePad from "react-signature-canvas";
import ModalWrapper from "../common/ModalWrapper";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

function SignaturePadModal({ isOpen, onClose, onSign }) {
  const sigPadRef = useRef();
  const [error, setError] = useState("");

  const handleSave = () => {
    if (sigPadRef.current.isEmpty()) {
      setError("Please sign before saving.");
      return;
    }

    const signatureDataUrl = sigPadRef.current
      .getCanvas()
      .toDataURL("image/png");

    onSign(signatureDataUrl);
    onClose();
  };

  const clearSignature = () => {
    sigPadRef.current.clear();
    setError("");
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Sign Document">
      <div className="space-y-4">
        <SignaturePad
          ref={sigPadRef}
          canvasProps={{ className: "border w-full h-48 rounded" }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between">
          <button
            onClick={clearSignature}
            className="text-sm text-gray-500 underline"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="bg-[#6e66f3] text-white px-4 py-2 rounded"
          >
            Save Signature
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

SignaturePadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSign: PropTypes.func.isRequired,
};

export default SignaturePadModal;

import React, { useEffect, useRef } from "react";

const QrCodeScanner = ({ incrementValue, getValue }) => {
  const [qrCode, setQrCode] = React.useState(null);
  const [motokoValue, setMotokoValue] = React.useState(0);
  const videoRef = useRef(null);

  const handleQrCodeScan = (event) => {
    const scannedCode = event.target.value;
    setQrCode(scannedCode);
  };

  const handleIncrement = async () => {
    // Call the incrementValue function from Motoko actor
    await incrementValue();
    // Refresh the displayed value after incrementing
    const newValue = await getValue();
    setMotokoValue(newValue);
  };

  useEffect(() => {
    const initializeValue = async () => {
      const initialValue = await getValue();
      setMotokoValue(initialValue);
    };

    initializeValue();
  }, [getValue]);

  useEffect(() => {
    if (videoRef.current) {
      const constraints = {
        video: true,
      };

      // Request access to the user's camera
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }
  }, []);

  return (
    <div className="example">
      <p>QR Code Scanner with Camera</p>
      <input
        type="text"
        placeholder="Scan QR Code"
        onChange={handleQrCodeScan}
        value={qrCode || ""}
      />
      <p>Motoko Actor Value: {motokoValue}</p>
      <button className="connect-button" onClick={handleIncrement}>
        Increment Motoko Actor Value
      </button>
      <div>
        <video ref={videoRef} autoPlay playsInline muted style={{ maxWidth: "100%" }} />
      </div>
    </div>
  );
};

export default QrCodeScanner;
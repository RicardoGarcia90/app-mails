"use client";
import React, { useState } from "react";
import axios from "axios";

const SendEmails = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/api/uploadImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUploadedImagePath(response.data.filePath);
      } else {
        alert("Falha ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      alert("Erro ao fazer upload da imagem.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>

      {uploadedImagePath && (
        <div>
          <p>Imagem enviada com sucesso:</p>
          <img src={uploadedImagePath} alt="Imagem enviada" width="300" />
        </div>
      )}
    </div>
  );
};

export default SendEmails;

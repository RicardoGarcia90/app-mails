"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function SendEmails() {
  const [subject, setSubject] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [emails, setEmails] = useState([]);
  const [oneEmail, setOneEmail] = useState("");
  const [image, setImage] = useState(null)

  function handleAssunto(e) {
    setSubject(e.target.value);
  }

  function handleRedirectLink(e) {
    setRedirectLink(e.target.value);
  }

  function handleOneEmail(e) {
    setOneEmail(e.target.value);
  }


  // HANDLE CSV
  function handleCSVUpload(e) {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        delimiter: ";", // Especifica o delimitador correto
        complete: (results) => {

          const emailList = results.data
            .map((item) => item.emails)
            .filter(Boolean);

          setEmails((prevEmails) => [...prevEmails, ...emailList]);
        },
        error: (error) => {
          console.error("Erro ao ler o CSV:", error);
        },
      });
    }
  }

  // HANDLE IMAGE
  async function handleImage(e) {
    const file = e.target.files[0];
    const formData = new FormData();

    if (file) {
      formData.append('file', file); // Certifique-se de que o campo está nomeado corretamente
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value.name}`);
    }

    try {
      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json(); // Espera-se que a resposta de erro seja JSON
        alert(`Error: ${errorData.error || 'Something went wrong.'}`);
        return; // Saia da função em caso de erro
      }

      const data = await res.json(); // Espera-se que a resposta de sucesso seja JSON
      alert(data.message); // Exibe a mensagem de sucesso
    } catch (error) {
      console.log(`An unexpected error occurred: ${error.message}`);
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();

    // Objeto para armazenar dados do form
    const formDataObj = {
      subject,
      redirectLink,
      emails,
      oneEmail,
      image
    };

    console.log(formDataObj)

    // Convertendo formDataObj para JSON
    const jsonPayLoad = JSON.stringify(formDataObj);

    console.log("JSON enviado para API:", jsonPayLoad);

    // Envio para API

    // try {
    //   const response = await fetch("/api/sendEmails", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: jsonPayLoad,
    //   });

    //   const data = await response.json();
    //   console.log("Resposta da API: ", data);
    // } catch (error) {
    //   console.error("Erro ao enviar o e-mail:", error);
    // }
  }

  return (
    <>
      <div>
        <div>
          <h1>Disparo de emails</h1>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {/* Assunto */}
              <div className="flex flex-col">
                <label htmlFor="">Digite o assunto</label>
                <input
                  type="text"
                  placeholder="Assunto que irá abordar o e-mail"
                  className="border w-[50%] rounded-md"
                  onChange={handleAssunto}
                />
              </div>

              {/* Link redirecionamento */}
              <div className="flex flex-col">
                <label htmlFor="">Insira um link de redirecionamento</label>
                <input
                  type="text"
                  placeholder="URL de redirecionamento desejado"
                  className="border w-[50%] rounded-md"
                  onChange={handleRedirectLink}
                />
              </div>

              {/* Email destinatário ou CSV */}
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label htmlFor="">Digite o e-mail do destinatário*</label>
                  <input
                    type="text"
                    placeholder="Insira o remetente"
                    className="border w-[100%] rounded-md"
                    onChange={handleOneEmail}
                  />
                </div>
                <p>ou</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="border w-[auto] rounded-md"
                />
              </div>

              {/* Selecionar uma imagem */}
              <div className="flex gap-2">
                <label htmlFor="">Selecionar uma imagem:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage} // Chame a função de upload
                  className="border w-[auto] rounded-md"
                />
              </div>

              {/* ENVIAR FORMULARIO */}
              <button
                type="submit"
                className="px-2 py-1 bg-red-600 rounded-md hover:bg-red-400"
              >
                Enviar comunicação
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

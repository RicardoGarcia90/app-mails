import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    // Log para ver os dados recebidos
    console.log("Dados recebidos:", body);

    const { subject, redirectLink, emails, oneEmail } = body;

    const allEmails = emails.length ? emails : [oneEmail];

    if (!allEmails.length) {
      return NextResponse.json(
        { message: "Nenhum email fornecido.", success: false },
        { status: 400 }
      );
    }

    await Promise.all(
      allEmails.map(async (email) => {
        try {
          await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: subject,
            html: `<p>Olá, esse é o corpor do email</p>
                    <p>Visite: <a href="${redirectLink}">${redirectLink}</a></p>`,
          });
          console.log(`Email enviado para: ${email}`);
        } catch (err) {
          console.error(`Erro ao enviar email para ${email}`);
        }
      })
    );

    return NextResponse.json({
      message: "Emails enviados com sucesso",
      success: true,
    });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    return NextResponse.json(
      { message: "Erro ao processar os dados", success: false },
      { status: 500 }
    );
  }
}

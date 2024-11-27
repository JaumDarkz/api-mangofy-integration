'use client'

import { useState } from "react";
import QRCode from "qrcode";

export default function PaymentPix() {
    const [formData, setFormData] = useState({
        name: "",
        document: "",
        email: "",
        phone: "",
        payment_amount: "",
        ip: "",
        city: "",
        state: "",
        street: "",
        street_number: "",
        neighborhood: "",
        zip_code: "",
        complement: "",
    });

    const [response, setResponse] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/payment/pix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setResponse(data);

            console.log("Resposta da API:", data);

            if (data?.pix?.pix_qrcode_text) {
                console.log("Texto do QR Code PIX:", data.pix.pix_qrcode_text);

                const qrCode = await QRCode.toDataURL(data.pix.pix_qrcode_text);
                setQrCodeUrl(qrCode);
                console.log("QR Code gerado com sucesso.");
            } else {
                console.error("Texto do QR Code PIX não encontrado na resposta.");
                setQrCodeUrl(null);
            }
        } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nome" onChange={handleChange} required />
                <input type="text" name="document" placeholder="CPF" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Telefone" onChange={handleChange} required />
                <input type="number" name="payment_amount" placeholder="Valor (centavos)" onChange={handleChange} required />
                <input type="text" name="ip" placeholder="IP" onChange={handleChange} required />
                <input type="text" name="city" placeholder="Cidade" onChange={handleChange} required />
                <input type="text" name="state" placeholder="Estado" onChange={handleChange} required />
                <input type="text" name="street" placeholder="Rua" onChange={handleChange} required />
                <input type="text" name="street_number" placeholder="Número" onChange={handleChange} required />
                <input type="text" name="neighborhood" placeholder="Bairro" onChange={handleChange} required />
                <input type="text" name="zip_code" placeholder="CEP" onChange={handleChange} required />
                <input type="text" name="complement" placeholder="Complemento" onChange={handleChange} />
                <button type="submit">Gerar PIX</button>
            </form>

            {response && (
                <div>
                    <h3>Resposta da API:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {qrCodeUrl && (
                <div>
                    <h3>QR Code:</h3>
                    <img src={qrCodeUrl} alt="QR Code do PIX" />
                </div>
            )}
        </div>
    );
}

"use client"

import { ChangeEvent, useState } from "react";
import styles from "./styles.module.scss";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/dashboard/components/button";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface CategoyProps { id: string; name: string; }
interface Props { categories: CategoyProps[] }




export function Form({ categories }: Props) {
    const router = useRouter()
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");

    async function handleRegisterProduct(formData: FormData) {
        const categoryIndex = formData.get("category");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");

        if(!name || !categoryIndex || !price || !description || !image ){
            toast.warning("preencha todos os campos")
            
            return;
        }
        
        const data = new FormData();

        data.append("name", name)
        data.append("price", price)
        data.append("description", description)
        data.append("category_id", categories[Number(categoryIndex)].id)
        data.append("file", image)

        const token = getCookieClient();
        await api.post("/product", data, {
            headers:{ Authorization: `Bearer ${token}`}
        })
        .catch((err) => { 
            console.log(err)
            toast.warning("falha ao cadastrar este produto")
            
              return;})

        toast.success("produto registrado com sucesso")
        router.push("/dashboard")
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type !== "image/jpeg" && image.type !== "image/png") {
                toast.warning("Formato da imagem não permitido");
                return;
            }

            setImage(image);
            setPreviewImage(URL.createObjectURL(image))
        }
    }

    return (
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form action={handleRegisterProduct} className={styles.form}>
                
                <label className={styles.labelImg}>

                    <span> <UploadCloud size={30} color="#FFF" /> </span>

                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        required
                        onChange={handleFile}
                    />

                    {previewImage && (
                        <Image
                            alt="Imagem de previel"
                            src={previewImage}
                            className={styles.preview}
                            fill={true}
                            quality={100}
                            priority={true}
                        />
                    )}

                </label>

{/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */}





                <select name="category" >
                    {
                        categories.map((categiry, index) => (
                            <option key={categiry.id} value={index}>

                                {categiry.name}

                            </option>
                        ))
                    }
                </select>
{/* 

*/}
                <input
                    type="text"
                    name="name"
                    placeholder="Digite o nome do produto ..."
                    required
                    className={styles.input}
                />

                <input
                    type="text"
                    name="price"
                    placeholder="preço do produto ... "
                    required
                    className={styles.input}
                />

                <textarea
                    name="description"
                    placeholder="descrição do produto ... "
                    required
                    className={styles.input}
                >

                </textarea>

                <Button name="Cadastrar produto" />

            </form>

        </main>
    )
}
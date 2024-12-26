import { Button } from "@/app/dashboard/components/button";
import styles from "./styles.module.scss"
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { getCookieServer } from "@/lib/cookieServer";


async function handleRegisterCategory(formData: FormData) {
    "use server"

    const name = formData.get("name");
    if (!name) return;

    const data = { name: name, }
    const token = await getCookieServer();

    await api.post("/category", data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .catch((err) => { console.log(err); return; })

    redirect("/dashboard")

}

export default function Category() {

    return (
        <main className={styles.container}>
            <h1>Nova categoria</h1>

            <form
                action={handleRegisterCategory}
                className={styles.form}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Nome da categoria"
                    required
                    className={styles.input}
                />

                <Button name="Cadastrar" />

            </form>
        </main>
    )
}
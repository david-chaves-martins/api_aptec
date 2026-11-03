// CORRIGIDO: removido o formato de link Markdown e mantida apenas a URL.
const API_URL = "http://localhost:8080";

async function login(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        if (response.ok) {
            const token = response.headers.get("Authentication");

            if (token) {
                localStorage.setItem("Authorization", token);

                alert("Login realizado com sucesso!");

                // CORRIGIDO: removida a barra invertida antes de location.
                window.location.href = "index.html";

            } else {
                alert("Usuario ou senha invalidos");
            }
        }

        // CORRIGIDO: catch deve ficar ligado ao try, com a sintaxe catch (error).
    } catch (error) {
        console.error("Erro na requisição de login ", error);
    }
}
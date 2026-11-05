
// URL base da API
const API_URL = "http://localhost:8080";

// Evento executado automaticamente assim que a estrutura do documento HTML for carregada
document.addEventListener("DOMContentLoaded", () => {
    getTasks();

    // Evento para criar uma nova tarefa
    const createForm = document.getElementById("new-task-form");
    if (createForm) {
        createForm.addEventListener("submit", createTask);
    }

    // Evento para atualizar uma tarefa
    const editForm = document.getElementById("edit-task-form");
    if (editForm) {
        editForm.addEventListener("submit", updateTask);
    }
});


// Função responsável por recuperar o token JWT
function getAuthToken() {
    const token = localStorage.getItem("Authorization");

    if (!token) {
        alert("Acesso não autorizado, faça login primeiro.");
        window.location.href = "login.html";
        return null;
    }

    return token;
}


// Função assíncrona responsável por buscar e exibir as tarefas do usuário autenticado
async function getTasks() {

    // Recupera o token JWT salvo no localStorage
    const token = getAuthToken();

    if (!token) return;

    // Exibe o spinner de carregamento
    document.getElementById("loading").style.display = "block";

    try {
        // Envia requisição GET para buscar as tarefas do usuário
        const response = await fetch(`${API_URL}/task/user`, {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {

            // Converte a resposta recebida em um array JavaScript
            const tasks = await response.json();

            // Renderiza as tarefas na página
            renderTasks(tasks);

        } else if (response.status === 403 || response.status === 401) {

            alert("Sessão expirada. Por favor, faça login novamente.");
            logout();

        } else {
            alert("Erro ao buscar tarefas.");
        }

    } catch (error) {

        console.error("Erro na busca de tarefas:", error);
        alert("Erro de conexão com o servidor.");

    } finally {

        // Oculta o spinner após concluir a requisição
        document.getElementById("loading").style.display = "none";
    }
}


// Função responsável por montar o HTML da lista de tarefas recebida da API
function renderTasks(tasks) {

    const tasksList = document.getElementById("tasks-list");

    // Limpa a lista antes de inserir novos elementos
    tasksList.innerHTML = "";

    // Se a lista retornada estiver vazia
    if (!Array.isArray(tasks) || tasks.length === 0) {
        tasksList.innerHTML = `
            <li class="list-group-item text-center text-muted">
                Nenhuma tarefa encontrada.
            </li>
        `;
        return;
    }

    // Percorre cada objeto TaskProjection
    for (const task of tasks) {

        // Cria um elemento de lista
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center py-3";

        // Texto da descrição da tarefa
        const descSpan = document.createElement("span");
        descSpan.className = "me-3 flex-grow-1 text-break";
        descSpan.textContent = task.description;

        // Container dos botões de ação
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-sm flex-shrink-0";

        // Botão de editar
        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-outline-primary";
        editBtn.title = "Editar Tarefa";
        editBtn.innerHTML = '<i class="bi bi-pencil-fill me-1"></i>Editar';
        editBtn.onclick = () => openEditModal(task.id, task.description);

        // Botão de excluir
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-outline-danger";
        deleteBtn.title = "Excluir Tarefa";
        deleteBtn.innerHTML = '<i class="bi bi-trash-fill me-1"></i>Excluir';
        deleteBtn.onclick = () => deleteTask(task.id);

        // Adiciona os botões ao container
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);

        // Adiciona a descrição e os botões ao item da lista
        li.appendChild(descSpan);
        li.appendChild(btnGroup);

        // Adiciona o item à lista principal
        tasksList.appendChild(li);
    }
}


// Função responsável por criar uma nova tarefa
async function createTask(event) {

    event.preventDefault();

    const token = getAuthToken();
    if (!token) return;

    const inputDesc = document.getElementById("new-task-description");
    const description = inputDesc.value.trim();

    if (!description) {
        alert("Por favor, informe a descrição da tarefa.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/task`, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ description })
        });

        if (response.ok) {

            alert("Tarefa criada com sucesso!");
            inputDesc.value = "";

            // Atualiza a lista de tarefas
            getTasks();

        } else if (response.status === 403 || response.status === 401) {

            alert("Sessão expirada. Por favor, faça login novamente.");
            logout();

        } else {
            alert("Erro ao criar tarefa.");
        }

    } catch (error) {

        console.error("Erro ao criar tarefa:", error);
        alert("Erro de conexão ao criar a tarefa.");
    }
}


// Função responsável por abrir o modal de edição
function openEditModal(id, currentDescription) {

    document.getElementById("edit-task-id").value = id;

    document.getElementById("edit-task-description").value = currentDescription;

    const modalElement = document.getElementById("editTaskModel");

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    modal.show();
}


// Função responsável por atualizar uma tarefa
async function updateTask(event) {

    event.preventDefault();

    const token = getAuthToken();
    if (!token) return;

    const id = document.getElementById("edit-task-id").value;

    const newDescription = document
        .getElementById("edit-task-description")
        .value.trim();

    if (!newDescription) {
        alert("A descrição da tarefa não pode estar vazia.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/task/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ description: newDescription })
        });

        if (response.ok) {

            alert("Tarefa atualizada com sucesso!");

            // Fecha o modal
            const modalElement = document.getElementById("editTaskModel");
            const modal = bootstrap.Modal.getInstance(modalElement);

            if (modal) {
                modal.hide();
            }

            // Atualiza a lista
            getTasks();

        } else if (response.status === 403 || response.status === 401) {

            alert("Sessão expirada. Por favor, faça login novamente.");
            logout();

        } else {
            alert("Erro ao atualizar tarefa.");
        }

    } catch (error) {

        console.error("Erro ao atualizar tarefa:", error);
        alert("Erro de conexão ao atualizar a tarefa.");
    }
}


// Função responsável por excluir uma tarefa
async function deleteTask(id) {

    const token = getAuthToken();
    if (!token) return;

    // Confirma se o usuário realmente deseja excluir
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
        const response = await fetch(`${API_URL}/task/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {

            alert("Tarefa excluída com sucesso!");

            // Atualiza a lista
            getTasks();

        } else if (response.status === 403 || response.status === 401) {

            alert("Sessão expirada. Por favor, faça login novamente.");
            logout();

        } else {
            alert("Erro ao excluir tarefa.");
        }

    } catch (error) {

        console.error("Erro ao excluir tarefa:", error);
        alert("Erro de conexão ao excluir a tarefa.");
    }

}


// Função responsável por encerrar a sessão do usuário no navegador
function logout() {

    // Remove o token do localStorage
    localStorage.removeItem("Authorization");

    // Redireciona o usuário para a página de login
    window.location.href = "login.html";
}

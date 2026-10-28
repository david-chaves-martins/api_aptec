package tarefas02.api.controllers; // Pacote onde está localizada a classe controller

import java.net.URI; // Importa URI para montar o endereço do recurso criado
import java.util.List; // Importa List para trabalhar com listas

import org.springframework.beans.factory.annotation.Autowired; // Permite injetar dependências automaticamente
import org.springframework.http.ResponseEntity; // Permite construir respostas HTTP
import org.springframework.validation.annotation.Validated; // Habilita validações no controller
import org.springframework.web.bind.annotation.CrossOrigin; // Permite configurar o acesso de outras origens
import org.springframework.web.bind.annotation.DeleteMapping; // Mapeia requisições HTTP DELETE
import org.springframework.web.bind.annotation.GetMapping; // Mapeia requisições HTTP GET
import org.springframework.web.bind.annotation.PathVariable; // Obtém valores informados na URL
import org.springframework.web.bind.annotation.PostMapping; // Mapeia requisições HTTP POST
import org.springframework.web.bind.annotation.PutMapping; // Mapeia requisições HTTP PUT
import org.springframework.web.bind.annotation.RequestBody; // Converte o JSON recebido em um objeto Java
import org.springframework.web.bind.annotation.RequestMapping; // Define a rota base do controller
import org.springframework.web.bind.annotation.RestController; // Define a classe como um controller REST
import org.springframework.web.servlet.support.ServletUriComponentsBuilder; // Monta a URI do recurso criado

import jakarta.validation.Valid; // Ativa as validações declaradas na entidade recebida

import tarefas02.api.models.Task; // Importa a entidade Task
import tarefas02.api.models.projections.TaskProjection; // Importa a projeção de tarefas
import tarefas02.api.services.TaskService; // Importa o serviço responsável pelas regras de negócio

// Controller responsável pelos endpoints da API de tarefas
@RestController
@RequestMapping("/task") // Define a rota base /task
@Validated
@CrossOrigin("*")
public class TaskController {

    // Injeta o serviço de tarefas
    @Autowired
    private TaskService taskService;

    // Busca uma tarefa específica pelo ID: GET /task/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Task> findById(@PathVariable Long id) {

        // Busca a tarefa pelo ID através do serviço
        Task obj = this.taskService.findById(id);

        // Retorna HTTP 200 OK com os dados da tarefa
        return ResponseEntity.ok().body(obj);
    }

    // Lista as tarefas do usuário autenticado: GET /task/user
    @GetMapping("/user")
    public ResponseEntity<List<TaskProjection>> findByLoggedUser() {

        // Busca as tarefas pertencentes ao usuário autenticado
        List<TaskProjection> list = this.taskService.findByLoggedUser();

        // Retorna HTTP 200 OK com a lista de tarefas
        return ResponseEntity.ok().body(list);
    }

    // Cria uma nova tarefa: POST /task
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody Task obj) {

        // Cria a tarefa vinculada ao usuário autenticado
        Task created = this.taskService.create(obj);

        // Monta a URI da tarefa criada no formato /task/{id}
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        // Retorna HTTP 201 Created com o cabeçalho Location
        return ResponseEntity.created(uri).build();
    }

    // Atualiza uma tarefa: PUT /task/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @Valid @RequestBody Task obj,
            @PathVariable Long id) {

        // Define o ID informado na URL no objeto recebido
        obj.setId(id);

        // Atualiza a tarefa através do serviço
        this.taskService.update(obj);

        // Retorna HTTP 204 No Content
        return ResponseEntity.noContent().build();
    }

    // Exclui uma tarefa: DELETE /task/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        // Solicita a exclusão da tarefa através do serviço
        this.taskService.delete(id);

        // Retorna HTTP 204 No Content
        return ResponseEntity.noContent().build();
    }
}
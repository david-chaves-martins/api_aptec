package tarefas02.api.services;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tarefas02.api.models.Task;
import tarefas02.api.models.User;
import tarefas02.api.models.enums.ProfileEnums;
import tarefas02.api.models.projections.TaskProjection;
import tarefas02.api.repositories.TaskRepository;
import tarefas02.api.security.UserSpringSecurity;
import tarefas02.api.exceptions.AuthorizationException;
import tarefas02.api.services.exceptions.DataBindingViolationException;
import tarefas02.api.services.exceptions.ObjectNotFoundException;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    public Task findById(Long id) {
        Optional<Task> task = this.taskRepository.findById(id);

        Task t = task.orElseThrow(() -> new ObjectNotFoundException(
                "Tarefa não encontrada! Id: " + id + ", Tipo: " + Task.class.getName()));

        UserSpringSecurity userSpringSecurity = UserService.authenticated();

        if (Objects.isNull(userSpringSecurity)
                || (!userSpringSecurity.hasRole(ProfileEnums.ADMIN)
                && !t.getUser().getId().equals(userSpringSecurity.getId()))) {
            throw new AuthorizationException("Acesso negado! Você não possui permissão para visualizar esta tarefa.");
        }

        return t;
    }

    public List<TaskProjection> findByLoggedUser() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();

        if (Objects.isNull(userSpringSecurity)) {
            throw new AuthorizationException("Acesso negado! Usuário não autenticado.");
        }

        return this.taskRepository.findByUser_Id(userSpringSecurity.getId());
    }

    @Transactional
    public Task create(Task task) {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();

        if (Objects.isNull(userSpringSecurity)) {
            throw new AuthorizationException("Acesso negado, você precisa estar autenticado.");
        }

        User user = this.userService.findById(userSpringSecurity.getId());

        task.setId(null);
        task.setUser(user);

        return this.taskRepository.save(task);
    }

    @Transactional
    public Task update(Task obj) {
        Task newObj = findById(obj.getId());

        newObj.setDescription(obj.getDescription());

        return this.taskRepository.save(newObj);
    }
    @Transactional
    public void delete(Long id) {
        findById(id);
        try{
            this.taskRepository.deleteById(id);
        }catch(Exception e){
            throw new AuthorizationException("Não foi possível excluir a tarefa especificada");
        }
    }
    private boolean userHasTask(UserSpringSecurity userSpringSecurity, Task task) {
        return task.getUser().getId().equals(userSpringSecurity.getId());
    }
}
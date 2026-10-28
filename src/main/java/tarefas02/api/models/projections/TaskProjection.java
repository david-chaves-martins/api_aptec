package tarefas02.api.models.projections;

public interface TaskProjection {
    //Método getter para mapear e extrair apenas o Id da terefa
    long getId();

    //Método getter para mapear e extrair apenas a descrição da tarefa
    String getDescription();
}


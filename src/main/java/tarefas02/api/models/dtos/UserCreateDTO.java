package tarefas02.api.models.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserCreateDTO {

    //Nome de Usuario obrigatório na criação
    @NotBlank
    @Size(min = 2, max = 100)
    private String Username;

    //Senha obrigatória na criação
    @NotBlank
    @Size(min = 8, max = 60)
    private String Password;
}

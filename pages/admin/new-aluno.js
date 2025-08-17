import FormNewUsers from "components/admin/users/formNewUsers";

export default function NewAluno() {
    const onSubmit = async (data) => {
        console.log('Dados do formulário:', data);

        // Cria um novo objeto com os dados do formulário e os novos parâmetros
        const alunoData = {
            ...data,
            status: "TRUE",
            permission: "aluno"
        };

        alunoData.id_plano = 1;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch('/api/admin/insert-aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(alunoData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao cadastrar novo aluno');
            }

            const result = await response.json();
            console.log('Aluno cadastrado com sucesso:', result);
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
        }
    }

  return (
    <div>
      <FormNewUsers onSubmit={onSubmit}/>
    </div>
  );
}

import styles from './formNewUsers.module.css';

export default function FormNewUsers({ onSubmit, error, loading }) {
    

    const handleSubmit = (event) => {
        event.preventDefault();

        // cria um objeto FormData a partir do formulário que disparou o evento
        const formData = new FormData(event.target);

        // transforma em objeto normal { campo: valor }
        const data = Object.fromEntries(formData);
        onSubmit(data);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Cadastro de Novo Usuário</h2>

            {error && <p className={styles.error}>{error}</p>}

            <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                required
                className={styles.input}
            />

            <input
                type="text"
                name="number"
                placeholder="Número de Telefone"
                required
                className={styles.input}
            />

            <input
                type="password"
                name="password"
                placeholder="Senha"
                required
                className={styles.input}
            />

            <input
                type="text"
                name="altura_cm"
                placeholder="Altura (cm)"
                required
                className={styles.input}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className={styles.input}
            />

            <input
                type="date"
                name="data_nascimento"
                placeholder="Data de Nascimento"
                required
                className={styles.input}
            />

            <select
                name="id_plano"
                required
                className={styles.input}
                defaultValue=""
            >
                <option value="" disabled>Selecione o Plano</option>
                <option value="mensal">Mensal</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
            </select>

            <button type="submit" disabled={loading} className={styles.button} >
                {loading ? 'Carregando...' : 'Cadastrar'}
            </button>
        </form>
    );
}



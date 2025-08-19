export default function Gerador() {
    const gerarMensalidades = async () => {
        const response = await fetch('/api/admin/generator-mensalidade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 2,
                quantidadeMeses: 12,
                valorMensalidade: 100,
            }),
        });

        const data = await response.json();
        console.log(data);
    };

  return (
    <div>
      <h1>Gerador de Mensalidades</h1>
      <button onClick={() => gerarMensalidades()}>Gerar</button>
    </div>
  );
}
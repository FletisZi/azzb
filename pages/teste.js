
import GraficHeader from "components/admin/financa/CreditGauge";
import HomeFinancas from "components/admin/financa/home";
<<<<<<< HEAD
=======
// import HomeFinancas from "components/admin/financa/home";
>>>>>>> 913107f65f203582033394d56d61ae7868a19c66

import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [values, setValues] = useState(null);
  const [data, setData] = useState({credito:300,debito:700,pix:100});



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const mes = 8; // ou use new Date().getMonth() + 1
      const status = "a vencer";

      console.log("Token:", token);

      const response = await fetch("/api/admin/get-mensalidades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mes }),
      });

      const data = await response.json();
      setValues(data);
    };
<<<<<<< HEAD

    fetchData();
  }, []);



  return (
    <div>
      
      {values && <HomeFinancas totalAtivos={values.alunos_ativos} aVencer={values.mensalidades_a_vencer} atrasados={values.mensalidades_atraso}/>}
      <GraficHeader data={data}/>
      {/* {values && <pre>{JSON.stringify(values, null, 2)}</pre>} */}
=======

    fetchData();
  }, []);

console.log(values);

  return (
    <div>
      {/* <GraficHeader /> */}
      {values && <HomeFinancas totalAtivos={values.alunos_ativos} aVencer={values.mensalidades_a_vencer} atrasados={values.mensalidades_atraso}/>}
      {values && <pre>{JSON.stringify(values, null, 2)}</pre>}
>>>>>>> 913107f65f203582033394d56d61ae7868a19c66

    </div>
  );
}

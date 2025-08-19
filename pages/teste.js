import GraficHeader from "components/admin/financa/CreditGauge";
// import HomeFinancas from "components/admin/financa/home";

import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [values, setValues] = useState(null);



//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       const mes = 8; // ou use new Date().getMonth() + 1
//       const status = "a vencer";

//       console.log("Token:", token);

//       const response = await fetch("/api/admin/get-mensalidades", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ mes }),
//       });

//       const data = await response.json();
//       setValues(data);
//     };

//     fetchData();
//   }, []);

// console.log(values);

  return (
    <div>
      <GraficHeader />
      {/* {values && <HomeFinancas totalAtivos={values.alunos_ativos} aVencer={values.mensalidades_a_vencer} atrasados={values.mensalidades_atraso}/>} */}
      {/* {values && <pre>{JSON.stringify(values, null, 2)}</pre>} */}

    </div>
  );
}

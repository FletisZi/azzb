
import GraficHeader from "components/admin/financa/CreditGauge";
import HomeFinancas from "components/admin/financa/home";
import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [values, setValues] = useState(null);
  const [data, setData] = useState({credito:300,debito:700,pix:100});



  useEffect(() => {
    const fetchData = async () => {

      const response = await fetch("/api/v2/finaces/getValuesPayments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataInicio: '2023-12-31', dataFim: '2025-12-31', SEGREDOTOKEN: process.env.SEGREDOTOKEN }),
      });

      const data = await response.json();
      setValues(data);
    };

    fetchData();
  }, []);
  return (
    <div>
      {console.log(values)}
      {values && <pre>{JSON.stringify(values, null, 2)}</pre>}
    </div>
  );
}

import axios from "axios";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress"; // Certifique-se de que este componente existe

interface CostData {
    plan: number;
    total_clientes: number;
    cost: number;
}

export default function Cost() {
    const [data, setData] = useState<CostData[]>([]);

    useEffect(() => {
        const handleCost = async () => {
            try {
                const result = await axios.get("/src/services/CostPlan.php", {
                    params: {
                        idIntegra: "3"
                    }
                });

                setData(result.data);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        handleCost();
    }, []);

    const currentValue = data[0]?.total_clientes || 0;
    const maxPlan = data[0]?.plan;
    const progressPercentage = (currentValue / maxPlan) * 100; // Porcentagem do progresso

    // Função para retornar a classe de cor baseada no progresso
    const getProgressColor = () => {
        if (progressPercentage < 50) return "bg-green-700"; // Verde para menos de 50%
        if (progressPercentage < 80) return "bg-yellow-500"; // Amarelo entre 50% e 80%
        return "bg-red-500"; // Vermelho para mais de 80%
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3>Custo atual/mês</h3>
                <p>Plano Até <strong>{Number(maxPlan)}</strong></p>
            </div>

            <Progress
                value={progressPercentage}
                max={100}
                color={getProgressColor()} // Passa a cor aqui
                className="mt-4"
            />

            <div className="flex flex-col gap-2 mt-4">
                <h3><strong className="text-2xl">R$ {data[0]?.cost || 0}</strong>/mês</h3>
            </div>
        </div>
    );
}

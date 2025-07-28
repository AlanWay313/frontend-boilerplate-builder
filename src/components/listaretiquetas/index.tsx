'use client'

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Sincronizar } from "../sincronizar";
import tagPerClient from "@/services/etiquetas";
import { Skeleton } from "@/components/ui/skeleton";

interface doc {
    cpf: string;
}

export function ListarEtiquetas(props: { documento: string, dataItens: any }) {
    const [dataEtiquetas, setDataEtiquetas] = useState<any[]>([]);
    const [selectedEtiqueta, setSelectedEtiqueta] = useState<string | null>(null);
    const [dataSinc, setDataSinc] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento

    const cpf: doc = {
        cpf: props.documento
    };

    useEffect(() => {
        async function listarEtiquetas() {
            try {
                const result = await tagPerClient(cpf);
                console.log(result);
                setDataEtiquetas(result);
            } catch (error) {
                console.error("Erro ao buscar etiquetas:", error);
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        }

        listarEtiquetas();
    }, [props.documento]);

    const handleRadioChange = (etiqueta: string) => {
        setSelectedEtiqueta(etiqueta);
    };

    const handleSync = () => {
        if (selectedEtiqueta) {
            // Filtrando a etiqueta selecionada para formar o JSON
            const selectedData = dataEtiquetas.find((item: any) => item.etiqueta === selectedEtiqueta);

            if (selectedData) {
                // Incluir a imagem nos dados consolidados
                const syncedData = {
                    ...selectedData,
                    foto: props.dataItens.foto,
                    status_entrega: props.dataItens.status_entrega,
                    endereco: props.dataItens.endereco,
                    observacao: props.dataItens.observacao,
                    documento_tecnico: props.dataItens.documento_tecnico,
                    nome_tecnico: props.dataItens.nome_tecnico,
                    id: props.dataItens.id,
                    latitude: props.dataItens.latitude,
                    longitude: props.dataItens.longitude
                };

                setDataSinc(syncedData);
            }
        } else {
            alert("Nenhuma etiqueta selecionada.");
        }
    };

    return (
        <div>
            <div className="w-full h-[400px] overflow-y-auto gap-4 flex flex-col">
                <div className="w-full py-4">
                    <h3>Imagem anexada:</h3>
                    <img src={props.dataItens.foto} alt="imagem" width={80} height={80} />
                </div>

                {loading ? ( // Exibe o esqueleto enquanto os dados estão sendo carregados
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex flex-row items-center gap-4">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="w-[200px] h-[20px] rounded-full" />
                                <Skeleton className="w-[150px] h-[20px] rounded-full" />
                                <Skeleton className="w-[250px] h-[20px] rounded-full" />
                                <Skeleton className="w-[200px] h-[20px] rounded-full" />
                            </div>
                        </div>
                    ))
                ) : (
                    dataEtiquetas.map((item: any, index: any) => (
                        <div key={index} className="flex flex-row items-center gap-4">
                            <div>
                                <Input
                                    type="radio"
                                    name="etiqueta"
                                    id={item.etiqueta}
                                    value={item.etiqueta}
                                    checked={selectedEtiqueta === item.etiqueta}
                                    onChange={() => handleRadioChange(item.etiqueta)}
                                />
                            </div>
                        <label htmlFor={item.etiqueta} className="cursor-pointer">
                        <div>
                                <h3>Contrato: {item.contrato}</h3>
                                <h3>Etiqueta: {item.etiqueta}</h3>
                                <h3>Endereço pessoa: {item.endereco}</h3>
                                <h3>Descrição etiqueta: {item.etiqueta_descricao}</h3>
                                <hr />
                            </div>
                        </label>
                        </div>
                    ))
                )}
            </div>

            <div className={`w-full flex ${dataSinc ? 'hidden' : 'flex'} items-end justify-end py-8`}>
                <Button onClick={handleSync}>Preparar para Sincronizar</Button>
            </div>

            <div className="w-full flex items-end justify-end py-8">
                {dataSinc ? (
                    <Sincronizar data={dataSinc} />
                ) : (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" />
                )}
            </div>
        </div>
    );
}
'use client'

import axios from "axios";

import { Button } from "../ui/button";

import { useState } from "react";
import GerarToken from "../gerarToken";
import { UpdatedRegistro } from "../updatedRegistro";

export function Sincronizar({ data }: { data: any }) {
        const [loading, setLoading] = useState(false)
    async function Sinc() {
        if (!data || Object.keys(data).length === 0) {
            console.log("Dados inválidos para sincronização.");
            return;
        }

        setLoading(true)
        const dataSolicitation = {
            incidentStatusId: 4,
            personId: data.cliente_id,
            clientId: data.cliente_id,
            incidentTypeId: 2029,
            contractServiceTagId: data.etiqueta_id,
            contractServiceTagCategory: data.etiqueta,
            serviceLevelAgreementId: 15,
            catalogServiceId: 1137,
            assignment: {
                title: "SOLICITAÇÃO - AÇÃO DE CARNÊ",
                description: `AÇÃO AUTOMÁTICA DE ABERTURA POR ENTREGA - PÓS SINCRONIZAÇÃO - TELA ADMIN:
                \nREALIZADO POR: \nTécnico: ${data.nome_tecnico}  \nCPF: ${data.documento_tecnico} \n
                Local de abertura: Latitude: ${data.latitude} - Logintude: ${data.longitude}\n
                Endereço selecionado: 
                \nSTATUS: ${data.status_entrega}
                \nOBS: ${data.observacao}`,
                priority: 1,
                report: {
                    description: `
                    title: "SOLICITAÇÃO - AÇÃO DE CARNÊ",
                    description: AÇÃO AUTOMÁTICA DE ABERTURA POR ENTREGA - PÓS SINCRONIZAÇÃO:
                    \nREALIZADO POR: \nTécnico: ${data.nome_tecnico}  \nCPF: ${data.documento_tecnico} \n
                    Local de abertura: Latitude:  - Logintude: \n
                    Endereço selecionado: 
                    \nSTATUS: ${data.status_entrega}
                    \nOBS: ${data.observacao}
                    `,
                },
                companyPlaceId: 1,
            },
            solicitationServiceCategory1: "53288c69",
            solicitationServiceCategory2: "CN",
            solicitationServiceCategory3: "ac",
            solicitationServiceCategory4: `${data.status_entrega === "ENTREGUE COM SUCESSO" ? "E_CARNE" : "I_CARNE"}`,
        };

        try {
            const response = await axios.post(
                "https://erp-staging.internetway.com.br:45715/external/integrations/thirdparty/opendetailedsolicitation",
                dataSolicitation,
                {
                    headers: {
                        Authorization: "Bearer " + (await GerarToken()),
                    },
                }
            );

            if (response.data.response) {
                console.log(response.data.response.protocol);
                const resultUpdated = await UpdatedRegistro({protocolo: String(response.data.response.protocol), status_sincronismo: "sincronizado", id: data.id})
                setLoading(false)
              
                alert(resultUpdated.message)
            }
        } catch (error) {
             setLoading(false)
            console.log("Erro na sincronização:", error);
        }
    }

    return (
        <div>
            <Button onClick={Sinc}>{loading ? "Sincronizando..." : "Sincronizar"}</Button>
        </div>
    );
}

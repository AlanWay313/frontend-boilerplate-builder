"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"

import { TotalClienteDash } from "@/services/totalclientes"
import ClientesErros from "@/components/clienteserros"


export function AtivoInativos() {

   const [totalClientesNumber, setToalCLienteNumber]: any = useState(0)
   const [nulos, setNulos] = useState(0);
   const [naoNulos, setNaoNulos] = useState(0)
 
   async function totalClientes(){
     const numberCliente = await TotalClienteDash()
   
     setToalCLienteNumber(Number(numberCliente.nulos) + Number(numberCliente.nao_nulos))
     setNulos(numberCliente.nulos);
     setNaoNulos(numberCliente.nao_nulos)
   }
 
 
 totalClientes()

const chartData = [{ month: "january", nulos: nulos, nnulos: naoNulos}]

const chartConfig = {
  nulos: {
    label: "Inativos",
    color: "hsl(var(--chart-1))",
  },
  nnulos: {
    label: "Ativos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


const percentual = nulos / naoNulos * 100;

  return (
    <Card className="h-full flex-grow max-w-[400px]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-poppins font-light">Ativos / Inativos</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalClientesNumber}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Ativos - Inativos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="nulos"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-nulos)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="nnulos"
              fill="var(--color-nnulos)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">

      <h3><ClientesErros /></h3>
        <div className="flex items-center gap-2 font-medium leading-none">
         
          {percentual.toFixed(2)}% de clientes inativos<TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
      
        </div>
      </CardFooter>
    </Card>
  )
}

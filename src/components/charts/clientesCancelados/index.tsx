"use client"

import * as React from "react"

import { Label, Pie, PieChart } from "recharts"

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
import { ClientesCanceladosApi } from "@/services/clientesCancelados"
import VerCancelados from "@/components/vercancelados"
import { UserRoundMinus } from "lucide-react"


export function ClientesCancelados() {

  const [cancelados, setCancelados]: any = React.useState(0)


  
  async function Cancelados(){
    const clientesCancelados = await ClientesCanceladosApi()

    setCancelados(clientesCancelados.length)
  }


  Cancelados()


  const chartData = [
    { browser: "cancelados", cancelados: Number(cancelados), fill: "var(--color-cancelados)" },
   
  
  ]
  
  const chartConfig = {
   
    cancelados: {
      label: "Cancelados",
      color: "hsl(var(--chart-4))",
    }
  } satisfies ChartConfig


  
  return (
    <Card className="h-full flex-grow max-w-[400px]">
      <CardHeader className="items-center pb-0 flex justify-center">
        <div className="flex items-center gap-2">
        <CardTitle className="font-poppins font-light">Total de Cancelados</CardTitle>
        <h3 className="text-3xl font-bold flex items-center gap-2">
            <UserRoundMinus />
            <VerCancelados />
          </h3>
        </div>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="cancelados"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {cancelados}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Cancelados
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center  font-medium leading-none">

        </div>
        <div className="leading-none text-muted-foreground">
       
        </div>
      </CardFooter>
    </Card>
  )
}

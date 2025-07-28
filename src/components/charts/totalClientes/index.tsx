import { TotalClienteDash } from "@/services/totalclientes"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { useState } from "react"



export function TotalClientes(){

  const [totalClientesNumber, setToalCLienteNumber] = useState(0)

  async function totalClientes(){
    const numberCliente = await TotalClienteDash()
  


    setToalCLienteNumber(Number(numberCliente.nulos) + Number(numberCliente.nao_nulos))
  }


totalClientes()



  const chartData = [
    { browser: "safari", nulos: totalClientesNumber, fill: "var(--color-nulos)" },
  ]
  const chartConfig = {
    nulos: {
      label: "Clientes",
      color: "hsl(var(--chart-2))"
    }
  } satisfies ChartConfig
  

  return (
    <div>
 <Card className="h-full flex-grow max-w-[400px]" >
      <CardHeader className="items-center pb-0">
        <CardTitle className="font-poppins font-light">Total de Clientes</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="nulos" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalClientesNumber}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clientes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Mostrando total de clientes na base <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
        
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
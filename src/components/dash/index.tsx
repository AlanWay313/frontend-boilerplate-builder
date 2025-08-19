'use client'





import { LayoutGrid, Maximize2, Minimize2, BarChart3, Filter } from 'lucide-react';
import { useState } from 'react';
import { TotalClientes } from '../charts/totalClientes';
import { ClientesCancelados } from '../charts/clientesCancelados';
import { AtivoInativos } from '../charts/ativosInativos';



export function Dashboard() {
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'wide'
 
    const [isExpanded, setIsExpanded] = useState(false);

     
    const chartComponents = [
        { 
            id: 'total-clientes', 
            component: TotalClientes, 
            title: 'Total de Clientes',
            category: 'clientes',
            priority: 1 
        },
        { 
            id: 'clientes-cancelados', 
            component: ClientesCancelados, 
            title: 'Clientes Cancelados',
            category: 'cancelamentos',
            priority: 2 
        },
        { 
            id: 'ativo-inativos', 
            component: AtivoInativos, 
            title: 'Ativos/Inativos',
            category: 'status',
            priority: 3 
        },
    ];

    const getGridClasses = () => {
        switch (viewMode) {
            case 'list':
                return 'flex flex-col gap-4';
            case 'wide':
                return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';
            case 'grid':
            default:
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
        }
    };

    const getContainerClasses = () => {
        if (isExpanded) {
            return 'min-h-screen w-full max-w-none';
        }
        return 'w-full  mx-auto';
    };

     

    return (
        <div className={`${getContainerClasses()} transition-all duration-300`}>
            {/* Header do Dashboard */}
            <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h1>
                            <p className="text-gray-600 text-sm">Visão geral dos seus dados</p>
                        </div>

                     
                    </div>

                    {/* Controles de Layout */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                viewMode === 'grid' 
                                    ? 'bg-white shadow-sm text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title="Visualização em Grade"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        
                        <button
                            onClick={() => setViewMode('wide')}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                viewMode === 'wide' 
                                    ? 'bg-white shadow-sm text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title="Visualização Ampla"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                viewMode === 'list' 
                                    ? 'bg-white shadow-sm text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title="Visualização em Lista"
                        >
                            <Filter className="h-4 w-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1" />

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                                isExpanded 
                                    ? 'bg-white shadow-sm text-red-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title={isExpanded ? "Modo Normal" : "Tela Cheia"}
                        >
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Indicadores de Status */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {/* <span className="text-gray-600">Sistema Online</span> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                       {/*  <span className="text-gray-600">{chartComponents.length} Componentes Ativos</span> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        {/* <span className="text-gray-600">Última atualização: agora</span> */}
                    </div>
                </div>
            </div>

            {/* Área Principal dos Gráficos */}
            <div className="space-y-6">
                {/* Seção Principal */}
                <div className={`${getGridClasses()} transition-all duration-300`}>
                    {chartComponents.map(({ id, component: Component, category }) => (
                        <div
                            key={id}
                            className={`
                                group relative transition-all duration-300 hover:z-10
                                ${viewMode === 'list' ? 'w-full' : ''}
                                ${viewMode === 'wide' ? 'min-h-[400px]' : 'min-h-[300px]'}
                            `}
                        >
                            {/* Label da categoria (opcional) */}
                            <div className="absolute -top-2 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <span className={`
                                    px-2 py-1 text-xs rounded-full font-medium
                                    ${category === 'clientes' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${category === 'cancelamentos' ? 'bg-red-100 text-red-700' : ''}
                                    ${category === 'status' ? 'bg-green-100 text-green-700' : ''}
                                `}>
                                    {category}
                                </span>
                            </div>

                            <Component />
                        </div>
                    ))}
                </div>

               
         {/*        <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Análises Detalhadas</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Ver todos
                        </button>
                    </div>
                    
                    <div className={`
                        grid gap-4 transition-all duration-300
                        ${viewMode === 'list' 
                            ? 'grid-cols-1' 
                            : viewMode === 'wide' 
                            ? 'grid-cols-1 lg:grid-cols-2' 
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }
                    `}>
                       
                        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-blue-300 transition-colors duration-200">
                            <div className="text-center text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">Adicionar Gráfico</p>
                                <p className="text-xs">Clique para configurar</p>
                            </div>
                        </div>

                        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-green-300 transition-colors duration-200">
                            <div className="text-center text-gray-500 group-hover:text-green-500 transition-colors duration-200">
                                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-medium">Relatório Personalizado</p>
                                <p className="text-xs">Em breve</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Footer com informações */}
           {/*  <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <span>Dashboard v2.1.0</span>
                        <span>•</span>
                        <span>Última sincronização: há 2 min</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Exportar Dados
                        </button>
                        <span>•</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Configurações
                        </button>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
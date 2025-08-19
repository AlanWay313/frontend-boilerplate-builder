import { CriarUsuarios } from "@/components/criarusuarios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeletarUsuario } from "@/components/deletarusuario";
import { TitlePage } from "@/components/title";
import useIntegrador from "@/hooks/use-integrador";
import api from "@/services/api";

import { useEffect, useState, useRef } from "react";
import { 
  EllipsisVertical, 
  Pencil, 
  Trash, 
  Search, 
  Filter,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  Save,
  X,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";



interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: number;
}

interface EditUserForm {
  name: string;
  email: string;
  username: string;
  isActive: number;
  password?: string;
}

// Modal customizado usando React puro
const CustomModal = ({ 
  isOpen, 
  onClose, 
  children,
  title,
  description
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Pencil className="h-4 w-4 text-blue-600" />
                </div>
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600 mt-2">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente Modal de Edição
const EditUserModal = ({ 
  user, 
  isOpen, 
  onClose, 
  onUserUpdated 
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}) => {
  const [formData, setFormData] = useState<EditUserForm>({
    name: '',
    email: '',
    username: '',
    isActive: 1,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<EditUserForm>>({});
  const { toast } = useToast();
  const integrador = useIntegrador();

  // Preenche o formulário quando o usuário é selecionado
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        password: ''
      });
      setErrors({});
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof EditUserForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpa o erro do campo quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EditUserForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !validateForm()) return;

    setIsLoading(true);

    try {
      const updateData = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        isActive: formData.isActive,
        idIntegra: integrador,
        ...(formData.password && { password: formData.password })
      };

      const response = await api.put('/src/services/AtualizarUsuario.php', updateData);

      if (response.data.success) {
        toast({
          title: "Usuário atualizado",
          description: "Os dados do usuário foram atualizados com sucesso.",
          variant: "default",
        });
        
        onUserUpdated();
        handleClose();
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar usuário');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Erro interno do servidor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    
    // Reset do formulário
    setFormData({
      name: '',
      email: '',
      username: '',
      isActive: 1,
      password: ''
    });
    setErrors({});
    
    onClose();
  };

  if (!user) return null;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Usuário"
      description="Altere as informações do usuário. Deixe a senha em branco para mantê-la inalterada."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Digite o nome completo"
            disabled={isLoading}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Digite o email"
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nome de usuário *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Digite o nome de usuário"
            disabled={isLoading}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Deixe em branco para manter atual"
            disabled={isLoading}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.isActive.toString()}
            onValueChange={(value) => handleInputChange('isActive', parseInt(value))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  Ativo
                </div>
              </SelectItem>
              <SelectItem value="0">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-600" />
                  Inativo
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export function Usuarios() {
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");
  
  // Estados para o modal de edição
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const integra: any = useIntegrador();

  const listarUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await api.get(
        `src/services/ListarUsuarios.php?idIntegra=${integra}`,
      );

      if (result?.data?.data) {
        setData(result.data.data);
        setFilteredData(result.data.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      setError("Erro ao carregar usuários. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para o modal de edição
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    listarUsuarios(); // Recarrega a lista após a edição
  };

  // Filtros e busca
  useEffect(() => {
    let filtered = data;

    // Filtro por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (activeFilter !== "all") {
      filtered = filtered.filter(user => 
        activeFilter === "active" ? user.isActive === 1 : user.isActive !== 1
      );
    }

    setFilteredData(filtered);
  }, [data, searchTerm, activeFilter]);

  useEffect(() => {
    listarUsuarios();
  }, []);

  const activeUsers = data.filter(user => user.isActive === 1).length;
  const inactiveUsers = data.filter(user => user.isActive !== 1).length;

  const handleRefresh = () => {
    listarUsuarios();
  };



  return (
    <div className="space-y-6">
      <TitlePage title="Usuários" />

      

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuários cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.length > 0 ? `${Math.round((activeUsers / data.length) * 100)}%` : "0%"} do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.length > 0 ? `${Math.round((inactiveUsers / data.length) * 100)}%` : "0%"} do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles e Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários do sistema
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <CriarUsuarios listarUsuarios={listarUsuarios} />
            </div>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                Todos ({data.length})
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("active")}
              >
                Ativos ({activeUsers})
              </Button>
              <Button
                variant={activeFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter("inactive")}
              >
                Inativos ({inactiveUsers})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Estado de Loading */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Carregando usuários...</span>
            </div>
          ) : error ? (
            /* Estado de Erro */
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : filteredData.length === 0 ? (
            /* Estado Vazio */
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">
                {searchTerm || activeFilter !== "all" ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
              </p>
              <p className="text-sm">
                {searchTerm || activeFilter !== "all" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Clique em 'Criar Usuário' para adicionar o primeiro usuário"
                }
              </p>
            </div>
          ) : (
            /* Tabela de Usuários */
            <div className="rounded-md border">
              <Table>
                <TableCaption>
                  Mostrando {filteredData.length} de {data.length} usuários
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {user.username}
                        </code>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={user.isActive === 1 ? "default" : "secondary"}
                          className={user.isActive === 1 ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                          {user.isActive === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <EllipsisVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menu de ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>Ações do usuário</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => openEditModal(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar usuário
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <DeletarUsuario 
                                  idUser={user.id} 
                                  listarUsuarios={listarUsuarios}
                                />
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}